package com.hrms.modules.ho.hiring.service;

import com.hrms.modules.dtos.StaffExprienceDTOS;

public interface HoStaffExprienceService {
	public String saveExp(Long staffId, StaffExprienceDTOS expList);
	public String updateExp( StaffExprienceDTOS exp);
	public String deleteExp(Long expId);
}
