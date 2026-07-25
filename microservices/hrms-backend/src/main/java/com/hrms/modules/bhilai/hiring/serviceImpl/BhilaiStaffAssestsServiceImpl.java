package com.hrms.modules.bhilai.hiring.serviceImpl;

import com.hrms.modules.dtos.NewAssetDTO;
import com.hrms.modules.bhilai.hiring.models.BhilaiStaff;
import com.hrms.modules.bhilai.hiring.models.BhilaiStaffAssests;
import com.hrms.modules.bhilai.hiring.repository.BhilaiStaffAssestsRepo;
import com.hrms.modules.bhilai.hiring.repository.BhilaiStaffRepo;
import com.hrms.modules.bhilai.hiring.service.BhilaiStaffAssestsService;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;


@Service
public class BhilaiStaffAssestsServiceImpl implements BhilaiStaffAssestsService {

	@Autowired
	private BhilaiStaffAssestsRepo assetRepo;
	@Autowired
	private BhilaiStaffRepo bhilaiStaffRepo;
	
	
	@Override
	public String createAssetChalan(NewAssetDTO assets) {
	    Date today = new Date(System.currentTimeMillis());
	    BhilaiStaffAssests newAsset = new BhilaiStaffAssests();
	    newAsset.setLeaderName(assets.getLeaderName());
	    newAsset.setDateOfIssue(today);
	    newAsset.setAssetId(assets.getAssetId());
	    newAsset.setAreaOfStaff(assets.getAreaOfStaff());
	    newAsset.setModelNo(assets.getModelNo());
	    newAsset.setDeviceSlNo(assets.getDeviceSlNo());
	    newAsset.setReciverName(assets.getReciverName());
	    newAsset.setEmpNo(assets.getEmpNo());
	    newAsset.setStaffId(assets.getStaffId());
	    newAsset.setRam(assets.getRam());
	    newAsset.setHardDisk(assets.getHardDisk());
	    newAsset.setRemarks(assets.getRemarks());
	    newAsset.setIssuer(assets.getIssuer());

	    // Fetch staff if staffId is not null and handle optional correctly
	    if (assets.getStaffId() != null) {
	        Optional<BhilaiStaff> optionalStaff = bhilaiStaffRepo.findById(assets.getStaffId());
	        return optionalStaff.map(staff -> {
	            staff.setIsAssetAlloted(Status.TRUE);
	            bhilaiStaffRepo.save(staff);
	            BhilaiStaffAssests savedAsset = assetRepo.save(newAsset);
	            return savedAsset == null ? Result.WENT_WRONG.toString() : Result.SUCCESS.toString();
	        }).orElse(Result.WENT_WRONG.toString());
	    }
	    
	    return Result.WENT_WRONG.toString();
	}

	
	@Override
	public List<BhilaiStaffAssests> findByStaff(Long staffId){
		return assetRepo.findByStaff(staffId);
	}
	
	@Override
	public String updateStaffAsset(Long id, BhilaiStaffAssests newAssetDetails) {
		BhilaiStaffAssests existingStaff = assetRepo.findById(id).get();
		if(existingStaff!=null) {
			existingStaff.setLeaderName(newAssetDetails.getLeaderName());
	        existingStaff.setDateOfIssue(newAssetDetails.getDateOfIssue());
	        existingStaff.setAssetId(newAssetDetails.getAssetId());
	        existingStaff.setAreaOfStaff(newAssetDetails.getAreaOfStaff());
	        existingStaff.setModelNo(newAssetDetails.getModelNo());
	        existingStaff.setDeviceSlNo(newAssetDetails.getDeviceSlNo());
	        existingStaff.setReciverName(newAssetDetails.getReciverName());
	        existingStaff.setEmpNo(newAssetDetails.getEmpNo());
	        existingStaff.setStaffId(newAssetDetails.getStaffId());
	        existingStaff.setRam(newAssetDetails.getRam());
	        existingStaff.setHardDisk(newAssetDetails.getHardDisk());
	        existingStaff.setRemarks(newAssetDetails.getRemarks());	
	        existingStaff.setIssuer(newAssetDetails.getIssuer());
	        BhilaiStaffAssests saved=assetRepo.save(existingStaff);
	        return saved!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
		}
		return Result.NOT_FOUND.toString();
        
    }
	
	@Override
	public String deleteAsset(Long assetId) {
		assetRepo.deleteById(assetId);
		return Result.SUCCESS.toString();
	}
}
