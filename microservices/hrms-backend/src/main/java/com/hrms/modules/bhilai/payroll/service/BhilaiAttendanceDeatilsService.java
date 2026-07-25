package com.hrms.modules.bhilai.payroll.service;


import com.hrms.modules.bhilai.payroll.modles.BhilaiAttendanceDeatils;
import com.hrms.modules.dtos.CountAndStaffDetails;
import com.hrms.modules.dtos.StaffAttendaceDetialDTO;

import java.util.List;

public interface BhilaiAttendanceDeatilsService {
	 public String createOrUpdateStaffAttendanceDetails(Long savedAttendanceId,Long staffId,String month,String year);
	 public List<BhilaiAttendanceDeatils> findAttendanceDetailsByEnpNo(String empNo, String year);
	 public CountAndStaffDetails getDetailsOfStudent(int size, int page, String month, String year,String emp_no);
}
