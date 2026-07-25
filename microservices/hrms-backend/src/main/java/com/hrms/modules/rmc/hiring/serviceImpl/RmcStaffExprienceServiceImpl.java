package com.hrms.modules.rmc.hiring.serviceImpl;


import com.hrms.modules.dtos.StaffExprienceDTOS;
import com.hrms.modules.rmc.hiring.models.RmcStaffExprience;
import com.hrms.modules.rmc.hiring.repository.RmcStaffExprienceRepo;
import com.hrms.modules.rmc.hiring.service.RmcStaffExprienceService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RmcStaffExprienceServiceImpl implements RmcStaffExprienceService {

	@Autowired
	private RmcStaffExprienceRepo expRepo;
	
	@Override
	public String saveExp(Long staffId, StaffExprienceDTOS exp) {
		// Fetch existing experiences for the staff
		RmcStaffExprience saved =null;
				// Create a new experience if it doesn't exist
				RmcStaffExprience experience = new RmcStaffExprience();
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
		RmcStaffExprience experience = expRepo.findById(exp.getStaffExpId()).get();
		RmcStaffExprience saved =null;
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
