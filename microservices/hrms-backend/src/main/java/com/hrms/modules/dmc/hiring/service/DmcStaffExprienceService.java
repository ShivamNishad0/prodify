package com.hrms.modules.dmc.hiring.service;

import com.hrms.modules.dtos.StaffExprienceDTOS;

public interface DmcStaffExprienceService {
	public String saveExp(Long staffId, StaffExprienceDTOS expList);
	public String updateExp( StaffExprienceDTOS exp);
	public String deleteExp(Long expId);
}
