package com.hrms.modules.ho.payroll.service;

import com.hrms.modules.dtos.*;
import com.hrms.modules.ho.payroll.modles.HoStaffAttendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface HoStaffAttendanceService {
    public String staffNewAddtendance(List<StaffAttendanceDTO> attendanceList);

    public HoStaffAttendance findByempNo(String empNo, String month, int year);

    public String editAttendace(Long attendaceId, AttendanceDTO editedAttendance);

    public String deleteStaffAttendance(Long attendaceId);

    public CountAndStaffDetails findByEmpNo(String empNo, String month, String year, Pageable pageable);
}
