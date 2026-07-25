package com.hrms.modules.dmc.hiring.serviceImpl;


import com.hrms.modules.dtos.StaffExprienceDTOS;
import com.hrms.modules.dmc.hiring.models.DmcStaffExprience;
import com.hrms.modules.dmc.hiring.repository.DmcStaffExprienceRepo;
import com.hrms.modules.dmc.hiring.service.DmcStaffExprienceService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DmcStaffExprienceServiceImpl implements DmcStaffExprienceService {

	@Autowired
	private DmcStaffExprienceRepo expRepo;
	
	@Override
	public String saveExp(Long staffId, StaffExprienceDTOS exp) {
		// Fetch existing experiences for the staff
		DmcStaffExprience saved =null;
				// Create a new experience if it doesn't exist
				DmcStaffExprience experience = new DmcStaffExprience();
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
		DmcStaffExprience experience = expRepo.findById(exp.getStaffExpId()).get();
		DmcStaffExprience saved =null;
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
