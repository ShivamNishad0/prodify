package com.hrms.modules.rmc.payroll.serviceImpl;


import com.hrms.modules.dtos.AttendanceDTO;
import com.hrms.modules.dtos.StaffAttendanceDTO;
import com.hrms.modules.rmc.hiring.models.RmcStaff;
import com.hrms.modules.rmc.hiring.repository.RmcStaffRepo;
import com.hrms.modules.rmc.payroll.modles.RmcStaffAttendance;
import com.hrms.modules.rmc.payroll.repository.RmcStaffAttendanceRepository;
import com.hrms.modules.rmc.payroll.service.RmcAttendanceDeatilsService;
import com.hrms.modules.rmc.payroll.service.RmcStaffAttendanceService;
import com.hrms.modules.utilsServics.Attendance;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RmcStaffAttendanceServiceImpl implements RmcStaffAttendanceService {

    private static final Logger logger = LoggerFactory.getLogger(RmcStaffAttendanceServiceImpl.class);

    @Autowired
    private RmcStaffAttendanceRepository attendanceRepo;
    @Autowired
    private RmcAttendanceDeatilsService detailService;
    @Autowired
    private RmcStaffRepo staffRepo;
    
    @Override
    public String staffNewAddtendance(List<StaffAttendanceDTO> attendanceList) {
        List<String> notFoundEmpNo = new ArrayList<>();
        List<String> errorMessages = new ArrayList<>();

        for (StaffAttendanceDTO staffAt : attendanceList) {
            RmcStaffAttendance newAttendance = new RmcStaffAttendance();
            RmcStaff staff = staffRepo.findStaffByTemp_emp(staffAt.getEmpNo());
            if(staff!=null) {
            	Long staffAtZone = staffAt.getZoneId();
            	System.out.println("Finding Data For Staff id ======> "+staff.getStaffId()+" ===== "+staff.getName());

            }
            if (staff == null) {
                String message = "EmpNo=" + staffAt.getEmpNo();
                notFoundEmpNo.add(message);
            } else {
                
                    RmcStaffAttendance found = attendanceRepo.findByDetails(staff.getStaffId(), staffAt.getMonthName(), staffAt.getYear());
                    if (found == null) {
                        createNewAttendance(newAttendance, staff, staffAt);
                    } else {
                        updateExistingAttendance(found, staffAt);
                    }
                
            }
        }

        if (!notFoundEmpNo.isEmpty()) {
            List<String> allMessages = new ArrayList<>();
            allMessages.addAll(notFoundEmpNo);
            return String.join(", ", allMessages);
        }

        return Result.SUCCESS.toString();
    }

    private void createNewAttendance(RmcStaffAttendance newAttendance, RmcStaff staff, StaffAttendanceDTO staffAt) {
        newAttendance.setStaffId(staff.getStaffId());
        newAttendance.setEmpNo(staffAt.getEmpNo());
        newAttendance.setStatus(Status.ACTIVE);
        newAttendance.setEmpName(staff.getName());
        newAttendance.setYear(Year.of(staffAt.getYear()));
        newAttendance.setMonth(getCurrentMonth());
        newAttendance.setMonthName(staffAt.getMonthName());
        newAttendance.setVerified(Status.UNVERIFIED);
        newAttendance.setCreatedBy(staffAt.getCreatedBy());
        newAttendance.setStamp(new Timestamp(System.currentTimeMillis()));

        for (AttendanceDTO attendanceDTO : staffAt.getAttendance()) {
            setDayAttendance(newAttendance, attendanceDTO);
        }

        RmcStaffAttendance savedAttendance = attendanceRepo.save(newAttendance);
        if (savedAttendance != null) {
            detailService.createOrUpdateStaffAttendanceDetails(savedAttendance.getAttendanceId(), savedAttendance.getStaffId(),
                    savedAttendance.getMonthName(), savedAttendance.getYear().toString());
        }
    }

    private void updateExistingAttendance(RmcStaffAttendance found, StaffAttendanceDTO staffAt) {
        found.setStatus(Status.ACTIVE);
        found.setMonth(getCurrentMonth());
        found.setVerified(Status.UNVERIFIED);
        found.setCreatedBy(staffAt.getCreatedBy());
        found.setStamp(new Timestamp(System.currentTimeMillis()));

        for (AttendanceDTO attendanceDTO : staffAt.getAttendance()) {
            setDayAttendance(found, attendanceDTO);
        }

        RmcStaffAttendance savedAttendance = attendanceRepo.save(found);
        if (savedAttendance != null) {
            detailService.createOrUpdateStaffAttendanceDetails(savedAttendance.getAttendanceId(), savedAttendance.getStaffId(),
                    savedAttendance.getMonthName(), savedAttendance.getYear().toString());
        }
    }

    @Override
    public RmcStaffAttendance findByempNo(String empNo, String month, int year) {
        return attendanceRepo.findByEmpNoAndDate(empNo,month,year);
    }

    @Override
    public String editAttendace(Long attendanceId, AttendanceDTO editedAttendance) {
        Optional<RmcStaffAttendance> optionalAttendance = attendanceRepo.findById(attendanceId);
        if (optionalAttendance.isPresent()) {
            RmcStaffAttendance attendance = optionalAttendance.get();
            setDayAttendance(attendance, editedAttendance);
            RmcStaffAttendance savedAttendance = attendanceRepo.save(attendance);
            if (savedAttendance != null) {
                detailService.createOrUpdateStaffAttendanceDetails(savedAttendance.getAttendanceId(), savedAttendance.getStaffId(),
                        savedAttendance.getMonthName(), savedAttendance.getYear().toString());
                return Result.SUCCESS.toString();
            }
        }
        return Result.WENT_WRONG.toString();
    }

    @Override
    public String deleteStaffAttendance(Long attendanceId) {
        attendanceRepo.deleteById(attendanceId);
        return Result.SUCCESS.toString();
    }

    // Helping Methods
    public Month getCurrentMonth() {
        return LocalDate.now().getMonth();
    }

    public Year getCurrentYear() {
        return Year.of(LocalDate.now().getYear());
    }

    private void setDayAttendance(RmcStaffAttendance newAttendance, AttendanceDTO attendanceDTO) {
        String day = attendanceDTO.getDay();
        Attendance status = Attendance.valueOf(attendanceDTO.getStatus());

        switch (day) {
            case "d1":
                newAttendance.setD1(status);
                newAttendance.setD1In(attendanceDTO.getInTime());
                newAttendance.setD1Out(attendanceDTO.getOutTime());
                break;
            case "d2":
                newAttendance.setD2(status);
                newAttendance.setD2In(attendanceDTO.getInTime());
                newAttendance.setD2Out(attendanceDTO.getOutTime());
                break;
            case "d3":
                newAttendance.setD3(status);
                newAttendance.setD3In(attendanceDTO.getInTime());
                newAttendance.setD3Out(attendanceDTO.getOutTime());
                break;
            case "d4":
                newAttendance.setD4(status);
                newAttendance.setD4In(attendanceDTO.getInTime());
                newAttendance.setD4Out(attendanceDTO.getOutTime());
                break;
            case "d5":
                newAttendance.setD5(status);
                newAttendance.setD5In(attendanceDTO.getInTime());
                newAttendance.setD5Out(attendanceDTO.getOutTime());
                break;
            case "d6":
                newAttendance.setD6(status);
                newAttendance.setD6In(attendanceDTO.getInTime());
                newAttendance.setD6Out(attendanceDTO.getOutTime());
                break;
            case "d7":
                newAttendance.setD7(status);
                newAttendance.setD7In(attendanceDTO.getInTime());
                newAttendance.setD7Out(attendanceDTO.getOutTime());
                break;
            case "d8":
                newAttendance.setD8(status);
                newAttendance.setD8In(attendanceDTO.getInTime());
                newAttendance.setD8Out(attendanceDTO.getOutTime());
                break;
            case "d9":
                newAttendance.setD9(status);
                newAttendance.setD9In(attendanceDTO.getInTime());
                newAttendance.setD9Out(attendanceDTO.getOutTime());
                break;
            case "d10":
                newAttendance.setD10(status);
                newAttendance.setD10In(attendanceDTO.getInTime());
                newAttendance.setD10Out(attendanceDTO.getOutTime());
                break;
            case "d11":
                newAttendance.setD11(status);
                newAttendance.setD11In(attendanceDTO.getInTime());
                newAttendance.setD11Out(attendanceDTO.getOutTime());
                break;
            case "d12":
                newAttendance.setD12(status);
                newAttendance.setD12In(attendanceDTO.getInTime());
                newAttendance.setD12Out(attendanceDTO.getOutTime());
                break;
            case "d13":
                newAttendance.setD13(status);
                newAttendance.setD13In(attendanceDTO.getInTime());
                newAttendance.setD13Out(attendanceDTO.getOutTime());
                break;
            case "d14":
                newAttendance.setD14(status);
                newAttendance.setD14In(attendanceDTO.getInTime());
                newAttendance.setD14Out(attendanceDTO.getOutTime());
                break;
            case "d15":
                newAttendance.setD15(status);
                newAttendance.setD15In(attendanceDTO.getInTime());
                newAttendance.setD15Out(attendanceDTO.getOutTime());
                break;
            case "d16":
                newAttendance.setD16(status);
                newAttendance.setD16In(attendanceDTO.getInTime());
                newAttendance.setD16Out(attendanceDTO.getOutTime());
                break;
            case "d17":
                newAttendance.setD17(status);
                newAttendance.setD17In(attendanceDTO.getInTime());
                newAttendance.setD17Out(attendanceDTO.getOutTime());
                break;
            case "d18":
                newAttendance.setD18(status);
                newAttendance.setD18In(attendanceDTO.getInTime());
                newAttendance.setD18Out(attendanceDTO.getOutTime());
                break;
            case "d19":
                newAttendance.setD19(status);
                newAttendance.setD19In(attendanceDTO.getInTime());
                newAttendance.setD19Out(attendanceDTO.getOutTime());
                break;
            case "d20":
                newAttendance.setD20(status);
                newAttendance.setD20In(attendanceDTO.getInTime());
                newAttendance.setD20Out(attendanceDTO.getOutTime());
                break;
            case "d21":
                newAttendance.setD21(status);
                newAttendance.setD21In(attendanceDTO.getInTime());
                newAttendance.setD21Out(attendanceDTO.getOutTime());
                break;
            case "d22":
                newAttendance.setD22(status);
                newAttendance.setD22In(attendanceDTO.getInTime());
                newAttendance.setD22Out(attendanceDTO.getOutTime());
                break;
            case "d23":
                newAttendance.setD23(status);
                newAttendance.setD23In(attendanceDTO.getInTime());
                newAttendance.setD23Out(attendanceDTO.getOutTime());
                break;
            case "d24":
                newAttendance.setD24(status);
                newAttendance.setD24In(attendanceDTO.getInTime());
                newAttendance.setD24Out(attendanceDTO.getOutTime());
                break;
            case "d25":
                newAttendance.setD25(status);
                newAttendance.setD25In(attendanceDTO.getInTime());
                newAttendance.setD25Out(attendanceDTO.getOutTime());
                break;
            case "d26":
                newAttendance.setD26(status);
                newAttendance.setD26In(attendanceDTO.getInTime());
                newAttendance.setD26Out(attendanceDTO.getOutTime());
                break;
            case "d27":
                newAttendance.setD27(status);
                newAttendance.setD27In(attendanceDTO.getInTime());
                newAttendance.setD27Out(attendanceDTO.getOutTime());
                break;
            case "d28":
                newAttendance.setD28(status);
                newAttendance.setD28In(attendanceDTO.getInTime());
                newAttendance.setD28Out(attendanceDTO.getOutTime());
                break;
            case "d29":
                newAttendance.setD29(status);
                newAttendance.setD29In(attendanceDTO.getInTime());
                newAttendance.setD29Out(attendanceDTO.getOutTime());
                break;
            case "d30":
                newAttendance.setD30(status);
                newAttendance.setD30In(attendanceDTO.getInTime());
                newAttendance.setD30Out(attendanceDTO.getOutTime());
                break;
            case "d31":
                newAttendance.setD31(status);
                newAttendance.setD31In(attendanceDTO.getInTime());
                newAttendance.setD31Out(attendanceDTO.getOutTime());
                break;
        }
    }
}
