package com.hrms.modules.bijli.hiring.service;

import com.hrms.modules.dtos.StaffExprienceDTOS;

public interface BijliStaffExprienceService {
	public String saveExp(Long staffId, StaffExprienceDTOS expList);
	public String updateExp( StaffExprienceDTOS exp);
	public String deleteExp(Long expId);
}
