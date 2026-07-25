package com.hrms.modules.suda.payroll.service;

import com.hrms.modules.dtos.CountAndStaffDetails;
import com.hrms.modules.dtos.StaffAttendaceDetialDTO;
import com.hrms.modules.suda.payroll.modles.SudaAttendanceDeatils;

import java.util.List;

public interface SudaAttendanceDeatilsService {
	 public String createOrUpdateStaffAttendanceDetails(Long savedAttendanceId,Long staffId,String month,String year);
	 public List<SudaAttendanceDeatils> findAttendanceDetailsByEnpNo(String empNo, String year);
	 public CountAndStaffDetails getDetailsOfStudent(int size, int page, String month, String year);
}
