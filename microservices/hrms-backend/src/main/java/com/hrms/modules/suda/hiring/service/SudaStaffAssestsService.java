package com.hrms.modules.suda.hiring.service;

import com.hrms.modules.dtos.NewAssetDTO;
import com.hrms.modules.suda.hiring.models.SudaStaffAssests;

import java.util.List;

public interface SudaStaffAssestsService {
	public String createAssetChalan(NewAssetDTO asstes);
	
	public List<SudaStaffAssests> findByStaff(Long staffId);
	
	public String updateStaffAsset(Long id, SudaStaffAssests newAssetDetails);
	
	public String deleteAsset(Long assetId);
}
