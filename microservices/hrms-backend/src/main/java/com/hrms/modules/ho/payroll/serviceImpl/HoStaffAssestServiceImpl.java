package com.hrms.modules.ho.payroll.serviceImpl;

import com.hrms.modules.ho.payroll.modles.HoAssest;
import com.hrms.modules.ho.payroll.repository.HoStaffAssestRepository;
import com.hrms.modules.ho.payroll.service.HoStaffAssestService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HoStaffAssestServiceImpl implements HoStaffAssestService {

	@Autowired
	HoStaffAssestRepository assetRepo;
	
	@Override
	public String createNewAsset(HoAssest asset) {
		HoAssest foundAsset= assetRepo.findByAssetName(asset.getAssetName());
		if(foundAsset==null) {
			assetRepo.save(asset);
			return Result.SUCCESS.toString();
		}
		return Result.ALLREADY_EXISTS.toString();
	}
	
	@Override
	public String updateAsset(Long assetId, HoAssest asset) {
		HoAssest foundAsset = assetRepo.findById(assetId).get();
		foundAsset.setAssetName(asset.getAssetName());
		HoAssest savedAsset= assetRepo.save(foundAsset);
		return savedAsset!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
	}
	
	@Override
	public HoAssest getByassetId(Long assetId) {
		HoAssest foundAsset = assetRepo.findById(assetId).get();
		return foundAsset!=null?foundAsset:null;
	}
	
	@Override
	public List<HoAssest> getAllAsset(){
		List<HoAssest> foundAssets = assetRepo.findAll();
		return !foundAssets.isEmpty()?foundAssets:null;
	}
	
	@Override
	public String deleteAsset(Long assetId) {
		assetRepo.deleteById(assetId);
		return Result.SUCCESS.toString();
	}
}
