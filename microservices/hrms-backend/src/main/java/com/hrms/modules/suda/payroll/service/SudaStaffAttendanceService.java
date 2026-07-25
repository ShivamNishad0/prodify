package com.hrms.modules.suda.payroll.service;

import com.hrms.modules.dtos.AttendanceDTO;
import com.hrms.modules.dtos.StaffAttendanceDTO;
import com.hrms.modules.suda.payroll.modles.SudaStaffAttendance;

import java.util.List;

public interface SudaStaffAttendanceService {
	public String staffNewAddtendance(List<StaffAttendanceDTO> attendanceList);
	public SudaStaffAttendance findByempNo(String empNo, String month, int year);
	public String editAttendace(Long attendaceId, AttendanceDTO editedAttendance);
	 public String deleteStaffAttendance(Long attendaceId);
}
