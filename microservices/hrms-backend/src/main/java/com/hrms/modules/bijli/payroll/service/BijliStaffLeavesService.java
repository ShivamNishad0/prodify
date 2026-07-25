package com.hrms.modules.bijli.payroll.service;

import com.hrms.modules.bijli.payroll.modles.BijliStaffLeaves;

import java.util.List;

public interface BijliStaffLeavesService {
	 public String createLeave(BijliStaffLeaves leave);
	 public String actionOnLeave(String action, Long leaveId, Long userId);
	 public List<BijliStaffLeaves> staffLeaves(Long StaffId);
	 public String deleteLeave(Long leaveId);
}
