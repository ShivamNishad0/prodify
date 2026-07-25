package com.hrms.modules.bijli.payroll.service;

import com.hrms.modules.bijli.payroll.modles.BijliAssest;

import java.util.List;

public interface BijliStaffAssestService {
	public String createNewAsset(BijliAssest asset);
	public String updateAsset(Long assetId, BijliAssest asset);
	public BijliAssest getByassetId(Long assetId);
	public List<BijliAssest> getAllAsset();
	public String deleteAsset(Long assetId);
}
