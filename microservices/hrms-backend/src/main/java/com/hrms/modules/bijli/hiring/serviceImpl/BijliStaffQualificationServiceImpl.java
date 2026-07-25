package com.hrms.modules.bijli.hiring.serviceImpl;

import com.hrms.modules.dtos.QualificationDTO;
import com.hrms.modules.bijli.hiring.models.BijliStaffQualification;
import com.hrms.modules.bijli.hiring.repository.BijliStaffQualificationRepo;
import com.hrms.modules.bijli.hiring.service.BijliStaffQualificationService;
import com.hrms.modules.utilsServics.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class BijliStaffQualificationServiceImpl implements BijliStaffQualificationService {

	@Autowired
	private BijliStaffQualificationRepo qualiRepo;
	
	@Override
	public String saveQualifications(Long staffId, QualificationDTO qualifications) {
		 BijliStaffQualification savedQualification;
	            // Create a new qualification if it doesn't exist
	            BijliStaffQualification newQualification = new BijliStaffQualification();
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
	   

	        Optional<BijliStaffQualification> optionalQualification = qualiRepo.findById(quali.getQualiID());
	        BijliStaffQualification updated = null;
	        if (optionalQualification.isPresent()) {
	            BijliStaffQualification found = optionalQualification.get();
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
	public List<BijliStaffQualification> getStaffQualification(Long staffId){
		List<BijliStaffQualification> staffQuali=qualiRepo.findByStaffId(staffId);
		return !staffQuali.isEmpty()?staffQuali:null;
	}
	
	@Override
	public String deleteStaffQuali(Long qualiId) {
		qualiRepo.deleteById(qualiId);
		return Result.SUCCESS.toString();
	}
}
