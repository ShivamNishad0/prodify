package com.hrms.modules.suda.hiring.serviceImpl;


import com.hrms.modules.dtos.StaffExprienceDTOS;
import com.hrms.modules.suda.hiring.models.SudaStaffExprience;
import com.hrms.modules.suda.hiring.repository.SudaStaffExprienceRepo;
import com.hrms.modules.suda.hiring.service.SudaStaffExprienceService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SudaStaffExprienceServiceImpl implements SudaStaffExprienceService {

	@Autowired
	private SudaStaffExprienceRepo expRepo;
	
	@Override
	public String saveExp(Long staffId, StaffExprienceDTOS exp) {
		// Fetch existing experiences for the staff
		SudaStaffExprience saved =null;
				// Create a new experience if it doesn't exist
				SudaStaffExprience experience = new SudaStaffExprience();
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
		SudaStaffExprience experience = expRepo.findById(exp.getStaffExpId()).get();
		SudaStaffExprience saved =null;
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
