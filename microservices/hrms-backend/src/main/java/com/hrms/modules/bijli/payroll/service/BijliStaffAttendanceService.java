package com.hrms.modules.bijli.payroll.service;

import com.hrms.modules.dtos.AttendanceDTO;
import com.hrms.modules.dtos.StaffAttendanceDTO;
import com.hrms.modules.bijli.payroll.modles.BijliStaffAttendance;

import java.util.List;

public interface BijliStaffAttendanceService {
	public String staffNewAddtendance(List<StaffAttendanceDTO> attendanceList);
	public BijliStaffAttendance findByempNo(String empNo, String month, int year);
	public String editAttendace(Long attendaceId, AttendanceDTO editedAttendance);
	 public String deleteStaffAttendance(Long attendaceId);
}
