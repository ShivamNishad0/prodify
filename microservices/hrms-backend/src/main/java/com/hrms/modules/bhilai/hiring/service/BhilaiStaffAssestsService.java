package com.hrms.modules.bhilai.hiring.service;

import com.hrms.modules.dtos.NewAssetDTO;
import com.hrms.modules.bhilai.hiring.models.BhilaiStaffAssests;

import java.util.List;

public interface BhilaiStaffAssestsService {
	public String createAssetChalan(NewAssetDTO asstes);
	
	public List<BhilaiStaffAssests> findByStaff(Long staffId);
	
	public String updateStaffAsset(Long id, BhilaiStaffAssests newAssetDetails);
	
	public String deleteAsset(Long assetId);
}
