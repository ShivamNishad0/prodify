package com.hrms.modules.rmc.payroll.service;

import com.hrms.modules.rmc.payroll.modles.RmcAssest;

import java.util.List;

public interface RmcStaffAssestService {
	public String createNewAsset(RmcAssest asset);
	public String updateAsset(Long assetId, RmcAssest asset);
	public RmcAssest getByassetId(Long assetId);
	public List<RmcAssest> getAllAsset();
	public String deleteAsset(Long assetId);
}
