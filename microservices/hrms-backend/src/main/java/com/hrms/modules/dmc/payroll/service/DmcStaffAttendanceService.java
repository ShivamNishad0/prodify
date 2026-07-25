package com.hrms.modules.dmc.payroll.service;


import com.hrms.modules.dmc.payroll.modles.DmcStaffAttendance;
import com.hrms.modules.dtos.AttendanceDTO;
import com.hrms.modules.dtos.StaffAttendanceDTO;

import java.util.List;

public interface DmcStaffAttendanceService {
	public String staffNewAddtendance(List<StaffAttendanceDTO> attendanceList);
	public DmcStaffAttendance findByempNo(String empNo, String month, int year);
	public String editAttendace(Long attendaceId, AttendanceDTO editedAttendance);
	 public String deleteStaffAttendance(Long attendaceId);
}
