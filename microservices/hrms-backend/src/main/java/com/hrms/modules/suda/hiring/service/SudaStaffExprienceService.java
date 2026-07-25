package com.hrms.modules.suda.hiring.service;

import com.hrms.modules.dtos.StaffExprienceDTOS;

public interface SudaStaffExprienceService {
	public String saveExp(Long staffId, StaffExprienceDTOS expList);
	public String updateExp( StaffExprienceDTOS exp);
	public String deleteExp(Long expId);
}
