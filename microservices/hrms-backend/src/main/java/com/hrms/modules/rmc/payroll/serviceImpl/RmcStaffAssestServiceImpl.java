package com.hrms.modules.rmc.payroll.serviceImpl;

import com.hrms.modules.rmc.payroll.modles.RmcAssest;
import com.hrms.modules.rmc.payroll.repository.RmcStaffAssestRepository;
import com.hrms.modules.rmc.payroll.service.RmcStaffAssestService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RmcStaffAssestServiceImpl implements RmcStaffAssestService {

	@Autowired
	RmcStaffAssestRepository assetRepo;
	
	@Override
	public String createNewAsset(RmcAssest asset) {
		RmcAssest foundAsset= assetRepo.findByAssetName(asset.getAssetName());
		if(foundAsset==null) {
			assetRepo.save(asset);
			return Result.SUCCESS.toString();
		}
		return Result.ALLREADY_EXISTS.toString();
	}
	
	@Override
	public String updateAsset(Long assetId, RmcAssest asset) {
		RmcAssest foundAsset = assetRepo.findById(assetId).get();
		foundAsset.setAssetName(asset.getAssetName());
		RmcAssest savedAsset= assetRepo.save(foundAsset);
		return savedAsset!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
	}
	
	@Override
	public RmcAssest getByassetId(Long assetId) {
		RmcAssest foundAsset = assetRepo.findById(assetId).get();
		return foundAsset!=null?foundAsset:null;
	}
	
	@Override
	public List<RmcAssest> getAllAsset(){
		List<RmcAssest> foundAssets = assetRepo.findAll();
		return !foundAssets.isEmpty()?foundAssets:null;
	}
	
	@Override
	public String deleteAsset(Long assetId) {
		assetRepo.deleteById(assetId);
		return Result.SUCCESS.toString();
	}
}
