package com.hrms.modules.bijli.hiring.serviceImpl;


import com.hrms.modules.dtos.StaffExprienceDTOS;
import com.hrms.modules.bijli.hiring.models.BijliStaffExprience;
import com.hrms.modules.bijli.hiring.repository.BijliStaffExprienceRepo;
import com.hrms.modules.bijli.hiring.service.BijliStaffExprienceService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BijliStaffExprienceServiceImpl implements BijliStaffExprienceService {

	@Autowired
	private BijliStaffExprienceRepo expRepo;
	
	@Override
	public String saveExp(Long staffId, StaffExprienceDTOS exp) {
		// Fetch existing experiences for the staff
		BijliStaffExprience saved =null;
				// Create a new experience if it doesn't exist
				BijliStaffExprience experience = new BijliStaffExprience();
				experience.setStaffId(staffId);
				experience.setEmapNo(exp.getEmapNo());
				experience.setCompanyName(exp.getCompanyName());
				experience.setDateFrom(exp.getDateFrom());
				experience.setDateTo(exp.getDateTo());
				experience.setDesignation(exp.getDesignation());
				experience.setTotalYear(exp.getTotalYear());
				experience.setLocation(exp.getLocation());
				experience.setRemarks(exp.getRemarks());
				saved=expRepo.save(experience);
		return saved!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
	}
	
	@Override
	public String updateExp( StaffExprienceDTOS exp) {
		BijliStaffExprience experience = expRepo.findById(exp.getStaffExpId()).get();
		BijliStaffExprience saved =null;
		if(experience !=null) {
			experience.setEmapNo(exp.getEmapNo());
			experience.setCompanyName(exp.getCompanyName());
			experience.setDateFrom(exp.getDateFrom());
			experience.setDateTo(exp.getDateTo());
			experience.setDesignation(exp.getDesignation());
			experience.setTotalYear(exp.getTotalYear());
			experience.setLocation(exp.getLocation());
			experience.setRemarks(exp.getRemarks());
			saved=expRepo.save(experience);
		}
		return saved!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
	}
	
	@Override
	public String deleteExp(Long expId) {
		expRepo.deleteById(expId);
		return Result.SUCCESS.toString();
	}
}
