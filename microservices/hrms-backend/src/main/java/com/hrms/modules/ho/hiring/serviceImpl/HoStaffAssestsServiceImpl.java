package com.hrms.modules.ho.hiring.serviceImpl;

import com.hrms.modules.dtos.NewAssetDTO;
import com.hrms.modules.ho.hiring.models.HoStaff;
import com.hrms.modules.ho.hiring.models.HoStaffAssests;
import com.hrms.modules.ho.hiring.repository.HoStaffAssestsRepo;
import com.hrms.modules.ho.hiring.repository.HoStaffRepo;
import com.hrms.modules.ho.hiring.service.HoStaffAssestsService;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;


@Service
public class HoStaffAssestsServiceImpl implements HoStaffAssestsService {

	@Autowired
	private HoStaffAssestsRepo assetRepo;
	@Autowired
	private HoStaffRepo staffRepo;
	
	
	@Override
	public String createAssetChalan(NewAssetDTO assets) {
	    Date today = new Date(System.currentTimeMillis());
	    HoStaffAssests newAsset = new HoStaffAssests();
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
	        Optional<HoStaff> optionalStaff = staffRepo.findById(assets.getStaffId());
	        return optionalStaff.map(staff -> {
	            staff.setIsAssetAlloted(Status.TRUE);
	            staffRepo.save(staff);
	            HoStaffAssests savedAsset = assetRepo.save(newAsset);
	            return savedAsset == null ? Result.WENT_WRONG.toString() : Result.SUCCESS.toString();
	        }).orElse(Result.WENT_WRONG.toString());
	    }
	    
	    return Result.WENT_WRONG.toString();
	}

	
	@Override
	public List<HoStaffAssests> findByStaff(Long staffId){
		return assetRepo.findByStaff(staffId);
	}
	
	@Override
	public String updateStaffAsset(Long id, HoStaffAssests newAssetDetails) {
		HoStaffAssests existingStaff = assetRepo.findById(id).get();
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
	        HoStaffAssests saved=assetRepo.save(existingStaff);
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
