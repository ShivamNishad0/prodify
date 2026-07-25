package com.hrms.modules.bijli.hiring.service;

import com.hrms.modules.dtos.QualificationDTO;
import com.hrms.modules.bijli.hiring.models.BijliStaffQualification;

import java.util.List;

public interface BijliStaffQualificationService {
	public String saveQualifications(Long staffId, QualificationDTO qualifications);
	public String updateQualification(QualificationDTO quali);
	public List<BijliStaffQualification> getStaffQualification(Long staffId);
	public String deleteStaffQuali(Long qualiId);
}
