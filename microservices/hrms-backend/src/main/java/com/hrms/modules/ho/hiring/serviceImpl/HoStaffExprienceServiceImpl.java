package com.hrms.modules.ho.hiring.serviceImpl;


import com.hrms.modules.dtos.StaffExprienceDTOS;
import com.hrms.modules.ho.hiring.models.HoStaffExprience;
import com.hrms.modules.ho.hiring.repository.HoStaffExprienceRepo;
import com.hrms.modules.ho.hiring.service.HoStaffExprienceService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HoStaffExprienceServiceImpl implements HoStaffExprienceService {

	@Autowired
	private HoStaffExprienceRepo expRepo;
	
	@Override
	public String saveExp(Long staffId, StaffExprienceDTOS exp) {
		// Fetch existing experiences for the staff
		HoStaffExprience saved =null;
				// Create a new experience if it doesn't exist
				HoStaffExprience experience = new HoStaffExprience();
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
		HoStaffExprience experience = expRepo.findById(exp.getStaffExpId()).get();
		HoStaffExprience saved =null;
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
