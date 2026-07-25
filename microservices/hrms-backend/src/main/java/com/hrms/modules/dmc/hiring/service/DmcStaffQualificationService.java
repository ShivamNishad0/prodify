package com.hrms.modules.dmc.hiring.service;

import com.hrms.modules.dtos.QualificationDTO;
import com.hrms.modules.dmc.hiring.models.DmcStaffQualification;

import java.util.List;

public interface DmcStaffQualificationService {
	public String saveQualifications(Long staffId, QualificationDTO qualifications);
	public String updateQualification(QualificationDTO quali);
	public List<DmcStaffQualification> getStaffQualification(Long staffId);
	public String deleteStaffQuali(Long qualiId);
}
