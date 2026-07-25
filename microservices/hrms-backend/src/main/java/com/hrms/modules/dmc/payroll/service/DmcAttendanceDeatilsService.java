package com.hrms.modules.dmc.payroll.service;

import com.hrms.modules.dmc.payroll.modles.DmcAttendanceDeatils;
import com.hrms.modules.dtos.CountAndStaffDetails;
import com.hrms.modules.dtos.StaffAttendaceDetialDTO;

import java.util.List;

public interface DmcAttendanceDeatilsService {
	 public String createOrUpdateStaffAttendanceDetails(Long savedAttendanceId,Long staffId,String month,String year);
	 public List<DmcAttendanceDeatils> findAttendanceDetailsByEnpNo(String empNo, String year);
	 public CountAndStaffDetails getDetailsOfStudent(int size, int page, String month, String year);
}
