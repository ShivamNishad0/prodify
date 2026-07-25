package com.hrms.modules.ho.hiring.service;

import com.hrms.modules.dtos.NewAssetDTO;
import com.hrms.modules.ho.hiring.models.HoStaffAssests;

import java.util.List;

public interface HoStaffAssestsService {
	public String createAssetChalan(NewAssetDTO asstes);
	
	public List<HoStaffAssests> findByStaff(Long staffId);
	
	public String updateStaffAsset(Long id, HoStaffAssests newAssetDetails);
	
	public String deleteAsset(Long assetId);
}
