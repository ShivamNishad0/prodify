package com.hrms.modules.bhilai.hiring.service;


import com.hrms.modules.bhilai.hiring.models.BhilaiRemovedStaffs;
import com.hrms.modules.dtos.*;
import com.hrms.modules.utilsServics.Actions;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BhilaiStaffServices {
	public String saveStaffDetails(Actions action, Long staffId, NewStaffDTO newStaff);
	public List<ResponseStaffDTO> allStaffs(Pageable pageable) ;
	 public List<ResponseStaffDTO> allStaffsByZone(int page, int size);
	 public GetStaffAndStaffCountDTO allStaffsByZoneAndAreaSubDivision(int size, int page, String areaId,String type, String verified);
	public ResponseStaffDTO staffByID(Long staffId);
	public List<ResponseStaffDTO> staffByVerifiedStatus();
	public List<ResponseStaffDTO> staffVerifiedStatus();
	public String generateOfferLetter(Long staffId, Long userId);
	public String approveCandidate(Long staffId, Long userId);
	public String rejectCandidate(Long staffId, Long userId);
	public String fileUpload(String empNo, String fileOf, MultipartFile file);
	public String verifyCharacter(Long saffID);
	public String deleteStaff(RemoveStaffDTO data);
	public List<ResponseStaffDTO> tempForGetAllStaff();
	public GetStaffAndStaffCountDTO findByTempEmp(String tempEmp,String type, String verified);
	public CountAndStaffDetails findAllDeactivatedEmp(Pageable pageable);
	public BhilaiRemovedStaffs deactivationDetails(String emp_no);

}
