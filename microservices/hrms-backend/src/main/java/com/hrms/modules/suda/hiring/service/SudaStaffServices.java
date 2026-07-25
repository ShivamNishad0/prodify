package com.hrms.modules.suda.hiring.service;

import com.hrms.modules.dtos.*;
import com.hrms.modules.suda.hiring.models.SudaRemovedStaffs;
import com.hrms.modules.utilsServics.Actions;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SudaStaffServices {
	public String saveStaffDetails(Actions action, Long staffId, NewStaffDTO newStaff);
	public List<ResponseStaffDTO> allStaffs(Pageable pageable) ;
	 public List<ResponseStaffDTO> allStaffsByZone(int page, int size, Long zoneId);
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
	public GetStaffAndStaffCountDTO findByTempEmp(String tempEmp, String type, String verified);
	public CountAndStaffDetails findAllDeactivatedEmp(Pageable pageable);
	public SudaRemovedStaffs deactivationDetails(String emp_no);
}
