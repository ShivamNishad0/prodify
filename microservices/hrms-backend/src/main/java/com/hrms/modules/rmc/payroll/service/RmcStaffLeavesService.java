package com.hrms.modules.rmc.payroll.service;

import com.hrms.modules.rmc.payroll.modles.RmcStaffLeaves;

import java.util.List;

public interface RmcStaffLeavesService {
	 public String createLeave(RmcStaffLeaves leave);
	 public String actionOnLeave(String action, Long leaveId, Long userId);
	 public List<RmcStaffLeaves> staffLeaves(Long StaffId);
	 public String deleteLeave(Long leaveId);
}
