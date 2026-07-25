package com.hrms.modules.bhilai.payroll.serviceImpl;

import com.hrms.modules.dtos.CountAndStaffDetails;
import com.hrms.modules.dtos.StaffAttendaceDetialDTO;
import com.hrms.modules.bhilai.hiring.models.BhilaiSalaryStructure;
import com.hrms.modules.bhilai.hiring.service.BhilaiSalaryStructureService;
import com.hrms.modules.bhilai.payroll.modles.BhilaiAttendanceDeatils;
import com.hrms.modules.bhilai.payroll.modles.BhilaiStaffAttendance;
import com.hrms.modules.bhilai.payroll.repository.BhilaiAttendanceDeatilsRepository;
import com.hrms.modules.bhilai.payroll.repository.BhilaiStaffAttendanceRepository;
import com.hrms.modules.bhilai.payroll.service.BhilaiAttendanceDeatilsService;
import com.hrms.modules.bhilai.payroll.service.BhilaiStaffSalaryDetailsService;
import com.hrms.modules.utilsServics.Attendance;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BhilaiAttendanceDeatilsServiceImpl implements BhilaiAttendanceDeatilsService {

    @Autowired
    private BhilaiAttendanceDeatilsRepository detailRepo;

    @Autowired
    private BhilaiStaffAttendanceRepository attendanceRepo;
    
    @Autowired
    private BhilaiSalaryStructureService salaryStructure;
    
    @Autowired
    private BhilaiStaffSalaryDetailsService salaryDetails;
    

    @Override
    public String createOrUpdateStaffAttendanceDetails(Long savedAttendanceId,Long staffId,String month,String year) {
        BhilaiStaffAttendance attendance = attendanceRepo.findById(savedAttendanceId).orElse(null);
        if (attendance == null) {
            return Result.STAFF_NOT_FOUND.toString();
        }
        BhilaiAttendanceDeatils foundDetails = detailRepo.findDetailsByDetails(staffId,month,year);
        if(foundDetails==null) {
        	BhilaiAttendanceDeatils details = new BhilaiAttendanceDeatils();
            details.setEmpNo(attendance.getEmpNo());
            details.setStaffId(attendance.getStaffId());
            details.setEmpName(attendance.getEmpName());
            details.setMonth(attendance.getMonthName());
            details.setYear(attendance.getYear().toString());
            System.out.println("MAKING ATTENDANCE DETAILS PLEASE WAIT ----"+staffId);
            BhilaiSalaryStructure ssid = salaryStructure.findByStaffId(staffId);
            if(ssid==null) {
            	return Result.SALARY_STRUCTURE_NOT_FOUND.toString()+" = "+details.getEmpNo();
            }
            details.setSalaryId(ssid.getSsId());
            Map<Attendance, Integer> attendanceCount = countAttendance(attendance);
            details.setNoOfDayPresent(attendanceCount.getOrDefault(Attendance.PRESENTS, 0).toString());
            details.setNoOfDayAbsent(attendanceCount.getOrDefault(Attendance.ABSENT, 0).toString());
            details.setNoOfDayHalfPresent(attendanceCount.getOrDefault(Attendance.HALFDAY, 0).toString());
            details.setNoOfWO(attendanceCount.getOrDefault(Attendance.WO,0).toString());
            details.setNoOfHoliday(attendanceCount.getOrDefault(Attendance.HOLIDAY, 0).toString());
            BhilaiAttendanceDeatils saved = detailRepo.save(details);
            if(saved!=null) {
            	salaryDetails.generateSalary(saved.getStaffId(),Integer.parseInt(saved.getYear()),saved.getMonth());
            }
        }
        if(foundDetails!=null) {
             Map<Attendance, Integer> attendanceCount = countAttendance(attendance);
             foundDetails.setNoOfDayPresent(attendanceCount.getOrDefault(Attendance.PRESENTS, 0).toString());
             foundDetails.setNoOfDayAbsent(attendanceCount.getOrDefault(Attendance.ABSENT, 0).toString());
             foundDetails.setNoOfDayHalfPresent(attendanceCount.getOrDefault(Attendance.HALFDAY, 0).toString());
             foundDetails.setNoOfWO(attendanceCount.getOrDefault(Attendance.WO,0).toString());
             foundDetails.setNoOfHoliday(attendanceCount.getOrDefault(Attendance.HOLIDAY, 0).toString());
             BhilaiAttendanceDeatils saved = detailRepo.save(foundDetails);
             if(saved!=null) {
             	salaryDetails.generateSalary(saved.getStaffId(),Integer.parseInt(saved.getYear()),saved.getMonth());
             }
             return Result.ATTENDANCE_UPDATED.toString();
        }
        return Result.WENT_WRONG.toString();
    }
    
    @Override
    public List<BhilaiAttendanceDeatils> findAttendanceDetailsByEnpNo(String empNo, String year) {
        List<BhilaiAttendanceDeatils> details= detailRepo.findByEmpNo(empNo,year);
    	return details!=null?details:null;
    }
    
    @Override
    public CountAndStaffDetails getDetailsOfStudent(int size, int page, String month, String year,String emp_no) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BhilaiAttendanceDeatils> details ;
        Long count =0l;
        if(emp_no==null||emp_no.isEmpty()){
            details  = detailRepo.findDetailsByDetailsForView( month, year, pageable);
            count = detailRepo.countDetailsByDetailsForView( month, year);
        }else {
            details  = detailRepo.findDetailsByDetailsForView( month, year,emp_no, pageable);
            count = detailRepo.countDetailsByDetailsForView( month, year,emp_no);
        }
        CountAndStaffDetails data = new CountAndStaffDetails();
        data.setResults(details.getContent());
        data.setCount(count);
        return data;
    }


//    Helping Methods
    public Map<Attendance, Integer> countAttendance(BhilaiStaffAttendance bhilaiStaffAttendance) {
        Map<Attendance, Integer> attendanceCount = new HashMap<>();
        for (Attendance att : Attendance.values()) {
            attendanceCount.put(att, 0);
        }
        try {
            for (int i = 1; i <= 31; i++) {
                Field field = BhilaiStaffAttendance.class.getDeclaredField("d" + i);
                field.setAccessible(true);
                Attendance attendance = (Attendance) field.get(bhilaiStaffAttendance);
                if (attendance != null) {
                    attendanceCount.put(attendance, attendanceCount.get(attendance) + 1);
                }
            }
        } catch (NoSuchFieldException | IllegalAccessException e) {
            e.printStackTrace();
        }
        return attendanceCount;
    }
    
}
