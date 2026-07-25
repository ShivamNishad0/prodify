package com.hrms.modules.ho.payroll.service;

import com.hrms.modules.ho.payroll.modles.HoStaffLeaves;

import java.util.List;

public interface HoStaffLeavesService {
	 public String createLeave(HoStaffLeaves leave);
	 public String actionOnLeave(String action, Long leaveId, Long userId);
	 public List<HoStaffLeaves> staffLeaves(Long StaffId);
	 public String deleteLeave(Long leaveId);
}
