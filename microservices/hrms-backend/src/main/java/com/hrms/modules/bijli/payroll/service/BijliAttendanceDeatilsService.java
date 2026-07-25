package com.hrms.modules.bijli.payroll.service;

import com.hrms.modules.dtos.CountAndStaffDetails;
import com.hrms.modules.dtos.StaffAttendaceDetialDTO;
import com.hrms.modules.bijli.payroll.modles.BijliAttendanceDeatils;

import java.util.List;

public interface BijliAttendanceDeatilsService {
	 public String createOrUpdateStaffAttendanceDetails(Long savedAttendanceId,Long staffId,String month,String year);
	 public List<BijliAttendanceDeatils> findAttendanceDetailsByEnpNo(String empNo, String year);
	 public CountAndStaffDetails getDetailsOfStudent(int size, int page, String month,String emp_no, String year);
}
