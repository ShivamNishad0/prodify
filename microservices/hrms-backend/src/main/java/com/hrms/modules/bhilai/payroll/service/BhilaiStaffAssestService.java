package com.hrms.modules.bhilai.payroll.service;

import com.hrms.modules.bhilai.payroll.modles.BhilaiAssest;

import java.util.List;

public interface BhilaiStaffAssestService {
	public String createNewAsset(BhilaiAssest asset);
	public String updateAsset(Long assetId, BhilaiAssest asset);
	public BhilaiAssest getByassetId(Long assetId);
	public List<BhilaiAssest> getAllAsset();
	public String deleteAsset(Long assetId);
}
