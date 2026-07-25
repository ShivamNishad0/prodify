package com.hrms.modules.rmc.hiring.service;


import com.hrms.modules.dtos.NewAssetDTO;
import com.hrms.modules.rmc.hiring.models.RmcStaffAssests;

import java.util.List;

public interface RmcStaffAssestsService {
	public String createAssetChalan(NewAssetDTO asstes);
	
	public List<RmcStaffAssests> findByStaff(Long staffId);
	
	public String updateStaffAsset(Long id, RmcStaffAssests newAssetDetails);
	
	public String deleteAsset(Long assetId);
}
