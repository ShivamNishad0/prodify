package com.hrms.modules.ho.hiring.service;

import com.hrms.modules.dtos.QualificationDTO;
import com.hrms.modules.ho.hiring.models.HoStaffQualification;

import java.util.List;

public interface HoStaffQualificationService {
	public String saveQualifications(Long staffId, QualificationDTO qualifications);
	public String updateQualification(QualificationDTO quali);
	public List<HoStaffQualification> getStaffQualification(Long staffId);
	public String deleteStaffQuali(Long qualiId);
}
