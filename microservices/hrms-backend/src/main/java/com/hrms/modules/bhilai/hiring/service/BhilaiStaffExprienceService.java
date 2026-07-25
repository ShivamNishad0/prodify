package com.hrms.modules.bhilai.hiring.service;

import com.hrms.modules.dtos.StaffExprienceDTOS;

public interface BhilaiStaffExprienceService {
	public String saveExp(Long staffId, StaffExprienceDTOS expList);
	public String updateExp( StaffExprienceDTOS exp);
	public String deleteExp(Long expId);
}
