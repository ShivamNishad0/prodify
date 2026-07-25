package com.hrms.modules.rmc.payroll.service;


import com.hrms.modules.dtos.AttendanceDTO;
import com.hrms.modules.dtos.StaffAttendanceDTO;
import com.hrms.modules.rmc.payroll.modles.RmcStaffAttendance;

import java.util.List;

public interface RmcStaffAttendanceService {
	public String staffNewAddtendance(List<StaffAttendanceDTO> attendanceList);
	public RmcStaffAttendance findByempNo(String empNo, String month, int year);
	public String editAttendace(Long attendaceId, AttendanceDTO editedAttendance);
	 public String deleteStaffAttendance(Long attendaceId);
}
