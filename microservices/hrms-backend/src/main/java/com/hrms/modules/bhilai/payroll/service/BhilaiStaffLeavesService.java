package com.hrms.modules.bhilai.payroll.service;

import com.hrms.modules.bhilai.payroll.modles.BhilaiStaffLeaves;

import java.util.List;

public interface BhilaiStaffLeavesService {
	 public String createLeave(BhilaiStaffLeaves leave);
	 public String actionOnLeave(String action, Long leaveId, Long userId);
	 public List<BhilaiStaffLeaves> staffLeaves(Long StaffId);
	 public String deleteLeave(Long leaveId);
}
