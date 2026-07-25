package com.hrms.modules.bijli.payroll.serviceImpl;

import com.hrms.modules.bijli.payroll.modles.BijliAssest;
import com.hrms.modules.bijli.payroll.repository.BijliStaffAssestRepository;
import com.hrms.modules.bijli.payroll.service.BijliStaffAssestService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BijliStaffAssestServiceImpl implements BijliStaffAssestService {

	@Autowired
	BijliStaffAssestRepository assetRepo;
	
	@Override
	public String createNewAsset(BijliAssest asset) {
		BijliAssest foundAsset= assetRepo.findByAssetName(asset.getAssetName());
		if(foundAsset==null) {
			assetRepo.save(asset);
			return Result.SUCCESS.toString();
		}
		return Result.ALLREADY_EXISTS.toString();
	}
	
	@Override
	public String updateAsset(Long assetId, BijliAssest asset) {
		BijliAssest foundAsset = assetRepo.findById(assetId).get();
		foundAsset.setAssetName(asset.getAssetName());
		BijliAssest savedAsset= assetRepo.save(foundAsset);
		return savedAsset!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
	}
	
	@Override
	public BijliAssest getByassetId(Long assetId) {
		BijliAssest foundAsset = assetRepo.findById(assetId).get();
		return foundAsset!=null?foundAsset:null;
	}
	
	@Override
	public List<BijliAssest> getAllAsset(){
		List<BijliAssest> foundAssets = assetRepo.findAll();
		return !foundAssets.isEmpty()?foundAssets:null;
	}
	
	@Override
	public String deleteAsset(Long assetId) {
		assetRepo.deleteById(assetId);
		return Result.SUCCESS.toString();
	}
}
