package com.hrms.modules.bhilai.hiring.service;

import com.hrms.modules.dtos.QualificationDTO;
import com.hrms.modules.bhilai.hiring.models.BhilaiStaffQualification;

import java.util.List;

public interface BhilaiStaffQualificationService {
	public String saveQualifications(Long staffId, QualificationDTO qualifications);
	public String updateQualification(QualificationDTO quali);
	public List<BhilaiStaffQualification> getStaffQualification(Long staffId);
	public String deleteStaffQuali(Long qualiId);
}
