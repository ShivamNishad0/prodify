package com.hrms.modules.dmc.hiring.service;

import com.hrms.modules.dtos.NewAssetDTO;
import com.hrms.modules.dmc.hiring.models.DmcStaffAssests;

import java.util.List;

public interface DmcStaffAssestsService {
	public String createAssetChalan(NewAssetDTO asstes);
	
	public List<DmcStaffAssests> findByStaff(Long staffId);
	
	public String updateStaffAsset(Long id, DmcStaffAssests newAssetDetails);
	
	public String deleteAsset(Long assetId);
}
