package com.hrms.modules.suda.payroll.service;

import com.hrms.modules.suda.payroll.modles.SudaAssest;

import java.util.List;

public interface SudaStaffAssestService {
	public String createNewAsset(SudaAssest asset);
	public String updateAsset(Long assetId, SudaAssest asset);
	public SudaAssest getByassetId(Long assetId);
	public List<SudaAssest> getAllAsset();
	public String deleteAsset(Long assetId);
}
