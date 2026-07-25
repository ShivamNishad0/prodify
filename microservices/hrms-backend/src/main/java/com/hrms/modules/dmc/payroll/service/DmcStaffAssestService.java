package com.hrms.modules.dmc.payroll.service;

import com.hrms.modules.dmc.payroll.modles.DmcAssest;

import java.util.List;

public interface DmcStaffAssestService {
	public String createNewAsset(DmcAssest asset);
	public String updateAsset(Long assetId, DmcAssest asset);
	public DmcAssest getByassetId(Long assetId);
	public List<DmcAssest> getAllAsset();
	public String deleteAsset(Long assetId);
}
