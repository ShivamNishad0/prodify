package com.hrms.modules.bhilai.payroll.serviceImpl;

import com.hrms.modules.bhilai.payroll.modles.BhilaiAssest;
import com.hrms.modules.bhilai.payroll.repository.BhilaiStaffAssestRepository;
import com.hrms.modules.bhilai.payroll.service.BhilaiStaffAssestService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BhilaiStaffAssestServiceImpl implements BhilaiStaffAssestService {

	@Autowired
	BhilaiStaffAssestRepository assetRepo;
	
	@Override
	public String createNewAsset(BhilaiAssest asset) {
		BhilaiAssest foundAsset= assetRepo.findByAssetName(asset.getAssetName());
		if(foundAsset==null) {
			assetRepo.save(asset);
			return Result.SUCCESS.toString();
		}
		return Result.ALLREADY_EXISTS.toString();
	}
	
	@Override
	public String updateAsset(Long assetId, BhilaiAssest asset) {
		BhilaiAssest foundAsset = assetRepo.findById(assetId).get();
		foundAsset.setAssetName(asset.getAssetName());
		BhilaiAssest savedAsset= assetRepo.save(foundAsset);
		return savedAsset!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
	}
	
	@Override
	public BhilaiAssest getByassetId(Long assetId) {
		BhilaiAssest foundAsset = assetRepo.findById(assetId).get();
		return foundAsset!=null?foundAsset:null;
	}
	
	@Override
	public List<BhilaiAssest> getAllAsset(){
		List<BhilaiAssest> foundAssets = assetRepo.findAll();
		return !foundAssets.isEmpty()?foundAssets:null;
	}
	
	@Override
	public String deleteAsset(Long assetId) {
		assetRepo.deleteById(assetId);
		return Result.SUCCESS.toString();
	}
}
