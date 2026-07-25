package com.hrms.modules.dmc.payroll.serviceImpl;

import com.hrms.modules.dmc.payroll.modles.DmcAssest;
import com.hrms.modules.dmc.payroll.repository.DmcStaffAssestRepository;
import com.hrms.modules.dmc.payroll.service.DmcStaffAssestService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DmcStaffAssestServiceImpl implements DmcStaffAssestService {

	@Autowired
	DmcStaffAssestRepository assetRepo;
	
	@Override
	public String createNewAsset(DmcAssest asset) {
		DmcAssest foundAsset= assetRepo.findByAssetName(asset.getAssetName());
		if(foundAsset==null) {
			assetRepo.save(asset);
			return Result.SUCCESS.toString();
		}
		return Result.ALLREADY_EXISTS.toString();
	}
	
	@Override
	public String updateAsset(Long assetId, DmcAssest asset) {
		DmcAssest foundAsset = assetRepo.findById(assetId).get();
		foundAsset.setAssetName(asset.getAssetName());
		DmcAssest savedAsset= assetRepo.save(foundAsset);
		return savedAsset!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
	}
	
	@Override
	public DmcAssest getByassetId(Long assetId) {
		DmcAssest foundAsset = assetRepo.findById(assetId).get();
		return foundAsset!=null?foundAsset:null;
	}
	
	@Override
	public List<DmcAssest> getAllAsset(){
		List<DmcAssest> foundAssets = assetRepo.findAll();
		return !foundAssets.isEmpty()?foundAssets:null;
	}
	
	@Override
	public String deleteAsset(Long assetId) {
		assetRepo.deleteById(assetId);
		return Result.SUCCESS.toString();
	}
}
