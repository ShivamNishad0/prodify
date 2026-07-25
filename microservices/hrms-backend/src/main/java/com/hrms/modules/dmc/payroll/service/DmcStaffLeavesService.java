package com.hrms.modules.dmc.payroll.service;

import com.hrms.modules.dmc.payroll.modles.DmcStaffLeaves;

import java.util.List;

public interface DmcStaffLeavesService {
	 public String createLeave(DmcStaffLeaves leave);
	 public String actionOnLeave(String action, Long leaveId, Long userId);
	 public List<DmcStaffLeaves> staffLeaves(Long StaffId);
	 public String deleteLeave(Long leaveId);
}
