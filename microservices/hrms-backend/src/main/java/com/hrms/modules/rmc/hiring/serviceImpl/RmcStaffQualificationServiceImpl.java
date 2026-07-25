package com.hrms.modules.rmc.hiring.serviceImpl;

import com.hrms.modules.dtos.QualificationDTO;
import com.hrms.modules.rmc.hiring.models.RmcStaffQualification;
import com.hrms.modules.rmc.hiring.repository.RmcStaffQualificationRepo;
import com.hrms.modules.rmc.hiring.service.RmcStaffQualificationService;
import com.hrms.modules.utilsServics.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class RmcStaffQualificationServiceImpl implements RmcStaffQualificationService {

	@Autowired
	private RmcStaffQualificationRepo qualiRepo;
	
	@Override
	public String saveQualifications(Long staffId, QualificationDTO qualifications) {
		 RmcStaffQualification savedQualification;
	            // Create a new qualification if it doesn't exist
	            RmcStaffQualification newQualification = new RmcStaffQualification();
	            newQualification.setQualiFication(qualifications.getQualiFication());
	            newQualification.setQualiFication(qualifications.getQualiFication());
	            newQualification.setUniv(qualifications.getUniv());
	            newQualification.setMarks(qualifications.getMarks());
	            newQualification.setStartDate(qualifications.getStartDate());
	            newQualification.setEndDate(qualifications.getEndDate());
	            newQualification.setStaffId(staffId);
	            savedQualification=qualiRepo.save(newQualification);
	    return savedQualification!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
	    }
	

	@Override
	public String updateQualification(QualificationDTO quali) {
	   

	        Optional<RmcStaffQualification> optionalQualification = qualiRepo.findById(quali.getQualiID());
	        RmcStaffQualification updated = null;
	        if (optionalQualification.isPresent()) {
	            RmcStaffQualification found = optionalQualification.get();
	            // Update the fields
	            found.setQualiFication(quali.getQualiFication());
	            found.setUniv(quali.getUniv());
	            found.setMarks(quali.getMarks());
	            found.setStartDate(quali.getStartDate());
	            found.setEndDate(quali.getEndDate());
	            
	            // Save the updated qualification
	            log.info("found ====={}"+found);
	            updated= qualiRepo.save(found);
	    }

	    return updated != null ? Result.SUCCESS.toString() : Result.WENT_WRONG.toString();
	}





	
	@Override
	public List<RmcStaffQualification> getStaffQualification(Long staffId){
		List<RmcStaffQualification> staffQuali=qualiRepo.findByStaffId(staffId);
		return !staffQuali.isEmpty()?staffQuali:null;
	}
	
	@Override
	public String deleteStaffQuali(Long qualiId) {
		qualiRepo.deleteById(qualiId);
		return Result.SUCCESS.toString();
	}
}
