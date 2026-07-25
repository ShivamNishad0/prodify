package com.hrms.modules.suda.payroll.serviceImpl;

import com.hrms.modules.suda.payroll.modles.SudaAssest;
import com.hrms.modules.suda.payroll.repository.SudaStaffAssestRepository;
import com.hrms.modules.suda.payroll.service.SudaStaffAssestService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SudaStaffAssestServiceImpl implements SudaStaffAssestService {

	@Autowired
	SudaStaffAssestRepository assetRepo;
	
	@Override
	public String createNewAsset(SudaAssest asset) {
		SudaAssest foundAsset= assetRepo.findByAssetName(asset.getAssetName());
		if(foundAsset==null) {
			assetRepo.save(asset);
			return Result.SUCCESS.toString();
		}
		return Result.ALLREADY_EXISTS.toString();
	}
	
	@Override
	public String updateAsset(Long assetId, SudaAssest asset) {
		SudaAssest foundAsset = assetRepo.findById(assetId).get();
		foundAsset.setAssetName(asset.getAssetName());
		SudaAssest savedAsset= assetRepo.save(foundAsset);
		return savedAsset!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
	}
	
	@Override
	public SudaAssest getByassetId(Long assetId) {
		SudaAssest foundAsset = assetRepo.findById(assetId).get();
		return foundAsset!=null?foundAsset:null;
	}
	
	@Override
	public List<SudaAssest> getAllAsset(){
		List<SudaAssest> foundAssets = assetRepo.findAll();
		return !foundAssets.isEmpty()?foundAssets:null;
	}
	
	@Override
	public String deleteAsset(Long assetId) {
		assetRepo.deleteById(assetId);
		return Result.SUCCESS.toString();
	}
}
