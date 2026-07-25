package com.hrms.modules.ho.payroll.service;

import com.hrms.modules.ho.payroll.modles.HoAssest;

import java.util.List;

public interface HoStaffAssestService {
	public String createNewAsset(HoAssest asset);
	public String updateAsset(Long assetId, HoAssest asset);
	public HoAssest getByassetId(Long assetId);
	public List<HoAssest> getAllAsset();
	public String deleteAsset(Long assetId);
}
