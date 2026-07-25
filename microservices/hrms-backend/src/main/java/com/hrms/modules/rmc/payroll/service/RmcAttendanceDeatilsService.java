package com.hrms.modules.rmc.payroll.service;

import com.hrms.modules.dtos.CountAndStaffDetails;
import com.hrms.modules.dtos.StaffAttendaceDetialDTO;
import com.hrms.modules.rmc.payroll.modles.RmcAttendanceDeatils;

import java.util.List;

public interface RmcAttendanceDeatilsService {
	 public String createOrUpdateStaffAttendanceDetails(Long savedAttendanceId,Long staffId,String month,String year);
	 public List<RmcAttendanceDeatils> findAttendanceDetailsByEnpNo(String empNo, String year);
	 public CountAndStaffDetails getDetailsOfStudent(int size, int page, String month, String year);
}
