package com.hrms.modules.rmc.hiring.service;

import com.hrms.modules.dtos.QualificationDTO;
import com.hrms.modules.rmc.hiring.models.RmcStaffQualification;

import java.util.List;

public interface RmcStaffQualificationService {
	public String saveQualifications(Long staffId, QualificationDTO qualifications);
	public String updateQualification(QualificationDTO quali);
	public List<RmcStaffQualification> getStaffQualification(Long staffId);
	public String deleteStaffQuali(Long qualiId);
}
