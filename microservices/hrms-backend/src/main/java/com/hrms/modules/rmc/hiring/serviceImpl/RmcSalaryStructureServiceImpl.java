package com.hrms.modules.rmc.hiring.serviceImpl;

import com.hrms.modules.dtos.CountAndDetails;
import com.hrms.modules.rmc.hiring.models.RmcSalaryStructure;
import com.hrms.modules.rmc.hiring.repository.RmcSalaryStructureRepo;
import com.hrms.modules.rmc.hiring.service.RmcSalaryStructureService;
import com.hrms.modules.rmc.payroll.serviceImpl.RmcStaffSalaryDetailsServiceImpl;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class RmcSalaryStructureServiceImpl implements RmcSalaryStructureService {

	@Autowired
	private RmcSalaryStructureRepo salaryRepo;
	@Autowired
	private RmcStaffSalaryDetailsServiceImpl detailsService;
	
	@Override
	public String newSalaryStructure(RmcSalaryStructure salary) {
		RmcSalaryStructure found = salaryRepo.findByStaffId(salary.getStaffId());
		if(found==null) {
//			salary.setEsiPercent(new BigDecimal(0.75));
			RmcSalaryStructure saved = salaryRepo.save(salary);
			if(saved!=null) {
				return Result.SUCCESS.toString();
			}
			return Result.WENT_WRONG.toString();
		}
		return Result.ALLREADY_EXISTS.toString();
	}
	
	@Override
	public String updateSalary(Long salaryId, RmcSalaryStructure salary) {
		RmcSalaryStructure found = salaryRepo.findById(salaryId).get();
		found.setBasic(salary.getBasic());
		found.setHra(salary.getHra());
		found.setConv_oth(salary.getConv_oth());
		found.setDa(salary.getDa());
		found.setPfStatus(salary.getPfStatus());
		found.setPfPercent(salary.getPfPercent());
		found.setEsiPercent(salary.getEsiPercent());
		found.setScale(salary.getScale());
		found.setGross(salary.getGross());
		found.setPfUAN_NO(salary.getPfUAN_NO());
		found.setEsiNo(salary.getEsiNo());
		found.setEsiStatus(salary.getEsiStatus());
		found.setTdsStatus(salary.getTdsStatus());
		found.setTargetBased(salary.getTargetBased());
		found.setTdsPercent(salary.getTdsPercent());
		RmcSalaryStructure saved = salaryRepo.save(found);
		return saved!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
		
	}
	
	@Override
	public RmcSalaryStructure findByStaffId(Long staffId) {
		RmcSalaryStructure found= salaryRepo.findByStaffId(staffId);
		return found!=null?found:null;
	}
	
	@Override
	public RmcSalaryStructure findById(Long salaryId) {
		return salaryRepo.findByStaffId(salaryId);
	}
	
	@Override
	public List<RmcSalaryStructure> getAllSalary(){
		return salaryRepo.findAll();
	}
	
	@Override
	public String deleteSalaryById(Long salaryId) {
		salaryRepo.deleteById(salaryId);
		return Result.SUCCESS.toString();
	}

	@Override
	public String saveTarget(Map<Long, BigDecimal> targets, int year, String month) {
		StringBuilder response = new StringBuilder();

		targets.forEach((salaryStructureId, target) -> {
			salaryRepo.findById(salaryStructureId).ifPresent(found -> {
//				found.setTarget(target);
				RmcSalaryStructure saved = salaryRepo.save(found);
				if (saved != null) {
					String result = detailsService.generateSalary(saved.getStaffId(), year, month);
					response.append("Salary generated = ").append(saved.getEmpNo()).append("\n");
				} else {
					response.append("Failed To Generated = ").append(saved.getEmpNo()).append("\n");
				}
			});
		});

		return response.toString();
	}

	@Override
	public CountAndDetails searchSalaryStructure(String searchTerm){
		List<RmcSalaryStructure>result= salaryRepo.methodForSearch(searchTerm);
		CountAndDetails details = new CountAndDetails();
		details.setResults(result);
		details.setCount(result.size());
		return  details;
	}

}
