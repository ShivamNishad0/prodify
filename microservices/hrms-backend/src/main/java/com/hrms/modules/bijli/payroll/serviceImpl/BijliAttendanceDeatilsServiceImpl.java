package com.hrms.modules.bijli.payroll.serviceImpl;

import com.hrms.modules.dtos.CountAndStaffDetails;
import com.hrms.modules.bijli.hiring.models.BijliSalaryStructure;
import com.hrms.modules.bijli.hiring.service.BijliSalaryStructureService;
import com.hrms.modules.bijli.payroll.modles.BijliAttendanceDeatils;
import com.hrms.modules.bijli.payroll.modles.BijliStaffAttendance;
import com.hrms.modules.bijli.payroll.repository.BijliAttendanceDeatilsRepository;
import com.hrms.modules.bijli.payroll.repository.BijliStaffAttendanceRepository;
import com.hrms.modules.bijli.payroll.service.BijliAttendanceDeatilsService;
import com.hrms.modules.bijli.payroll.service.BijliStaffSalaryDetailsService;
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
public class BijliAttendanceDeatilsServiceImpl implements BijliAttendanceDeatilsService {

    @Autowired
    private BijliAttendanceDeatilsRepository detailRepo;

    @Autowired
    private BijliStaffAttendanceRepository attendanceRepo;
    
    @Autowired
    private BijliSalaryStructureService salaryStructure;
    
    @Autowired
    private BijliStaffSalaryDetailsService salaryDetails;
    

    @Override
    public String createOrUpdateStaffAttendanceDetails(Long savedAttendanceId,Long staffId,String month,String year) {
        BijliStaffAttendance attendance = attendanceRepo.findById(savedAttendanceId).orElse(null);
        if (attendance == null) {
            return Result.STAFF_NOT_FOUND.toString();
        }
        BijliAttendanceDeatils foundDetails = detailRepo.findDetailsByDetails(staffId,month,year);
        if(foundDetails==null) {
        	BijliAttendanceDeatils details = new BijliAttendanceDeatils();
            details.setEmpNo(attendance.getEmpNo());
            details.setStaffId(attendance.getStaffId());
            details.setEmpName(attendance.getEmpName());
            details.setMonth(attendance.getMonthName());
            details.setYear(attendance.getYear().toString());
            System.out.println("MAKING ATTENDANCE DETAILS PLEASE WAIT ----"+staffId);
            BijliSalaryStructure ssid = salaryStructure.findByStaffId(staffId);
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
            BijliAttendanceDeatils saved = detailRepo.save(details);
            System.out.println("ATTENDANCE DETAILS SAVED GOING TO GENERATE SALARY");
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
             BijliAttendanceDeatils saved = detailRepo.save(foundDetails);
            System.out.println("ATTENDANCE DETAILS UPDATED GOING TO GENERATE SALARY");
             if(saved!=null) {
             	salaryDetails.generateSalary(saved.getStaffId(),Integer.parseInt(saved.getYear()),saved.getMonth());
             }
             return Result.ATTENDANCE_UPDATED.toString();
        }
        return Result.WENT_WRONG.toString();
    }
    
    @Override
    public List<BijliAttendanceDeatils> findAttendanceDetailsByEnpNo(String empNo, String year) {
        List<BijliAttendanceDeatils> details= detailRepo.findByEmpNo(empNo,year);
    	return details!=null?details:null;
    }
    
    @Override
    public CountAndStaffDetails getDetailsOfStudent(int size, int page, String month,String emp_no, String year) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BijliAttendanceDeatils> details;
        if (emp_no!=null){
             details = detailRepo.findDetailsByEmpDetailsForView( month, year,emp_no, pageable);
        }else {
             details = detailRepo.findDetailsByDetailsForView( month, year, pageable);
        }
        Long count = detailRepo.countDetailsByDetailsForView( month, year);
        CountAndStaffDetails data = new CountAndStaffDetails();
        data.setResults(details.getContent());
        data.setCount(count);
        return data;
    }


//    Helping Methods
    public Map<Attendance, Integer> countAttendance(BijliStaffAttendance staffAttendance) {
        Map<Attendance, Integer> attendanceCount = new HashMap<>();
        for (Attendance att : Attendance.values()) {
            attendanceCount.put(att, 0);
        }
        try {
            for (int i = 1; i <= 31; i++) {
                Field field = BijliStaffAttendance.class.getDeclaredField("d" + i);
                field.setAccessible(true);
                Attendance attendance = (Attendance) field.get(staffAttendance);
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
