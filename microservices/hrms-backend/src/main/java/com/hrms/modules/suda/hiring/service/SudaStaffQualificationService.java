package com.hrms.modules.suda.hiring.service;

import com.hrms.modules.dtos.QualificationDTO;
import com.hrms.modules.suda.hiring.models.SudaStaffQualification;

import java.util.List;

public interface SudaStaffQualificationService {
	public String saveQualifications(Long staffId, QualificationDTO qualifications);
	public String updateQualification(QualificationDTO quali);
	public List<SudaStaffQualification> getStaffQualification(Long staffId);
	public String deleteStaffQuali(Long qualiId);
}
