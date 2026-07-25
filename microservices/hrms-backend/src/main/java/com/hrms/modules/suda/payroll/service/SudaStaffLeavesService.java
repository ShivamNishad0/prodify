package com.hrms.modules.suda.payroll.service;

import com.hrms.modules.suda.payroll.modles.SudaStaffLeaves;

import java.util.List;

public interface SudaStaffLeavesService {
	 public String createLeave(SudaStaffLeaves leave);
	 public String actionOnLeave(String action, Long leaveId, Long userId);
	 public List<SudaStaffLeaves> staffLeaves(Long StaffId);
	 public String deleteLeave(Long leaveId);
}
