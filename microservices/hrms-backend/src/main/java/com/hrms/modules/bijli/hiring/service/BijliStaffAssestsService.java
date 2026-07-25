package com.hrms.modules.bijli.hiring.service;

import com.hrms.modules.dtos.NewAssetDTO;
import com.hrms.modules.bijli.hiring.models.BijliStaffAssests;

import java.util.List;

public interface BijliStaffAssestsService {
	public String createAssetChalan(NewAssetDTO asstes);
	
	public List<BijliStaffAssests> findByStaff(Long staffId);
	
	public String updateStaffAsset(Long id, BijliStaffAssests newAssetDetails);
	
	public String deleteAsset(Long assetId);
}
