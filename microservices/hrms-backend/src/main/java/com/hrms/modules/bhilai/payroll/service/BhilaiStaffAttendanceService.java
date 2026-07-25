package com.hrms.modules.bhilai.payroll.service;

import com.hrms.modules.dtos.AttendanceDTO;
import com.hrms.modules.dtos.StaffAttendanceDTO;
import com.hrms.modules.bhilai.payroll.modles.BhilaiStaffAttendance;

import java.util.List;

public interface BhilaiStaffAttendanceService {
	public String staffNewAddtendance(List<StaffAttendanceDTO> attendanceList);
	public BhilaiStaffAttendance findByempNo(String empNo, String month, int year);
	public String editAttendace(Long attendaceId, AttendanceDTO editedAttendance);
	 public String deleteStaffAttendance(Long attendaceId);
}
