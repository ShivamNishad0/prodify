package com.hrms.modules.rmc.hiring.service;

import com.hrms.modules.dtos.StaffExprienceDTOS;

public interface RmcStaffExprienceService {
	public String saveExp(Long staffId, StaffExprienceDTOS expList);
	public String updateExp( StaffExprienceDTOS exp);
	public String deleteExp(Long expId);
}
