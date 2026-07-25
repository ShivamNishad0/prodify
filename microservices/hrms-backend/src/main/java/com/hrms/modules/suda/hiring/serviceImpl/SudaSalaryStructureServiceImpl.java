package com.hrms.modules.suda.hiring.serviceImpl;

import com.hrms.modules.suda.hiring.models.SudaSalaryStructure;
import com.hrms.modules.suda.hiring.repository.SudaSalaryStructureRepo;
import com.hrms.modules.suda.hiring.repository.SudaStaffRepo;
import com.hrms.modules.suda.hiring.service.SudaSalaryStructureService;
import com.hrms.modules.suda.payroll.serviceImpl.SudaStaffSalaryDetailsServiceImpl;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class SudaSalaryStructureServiceImpl implements SudaSalaryStructureService {

	@Autowired
	private SudaSalaryStructureRepo salaryRepo;
	@Autowired
	private SudaStaffSalaryDetailsServiceImpl detailsService;
	@Autowired
	private SudaStaffRepo staffRepo;
	
	@Override
	public String newSalaryStructure(SudaSalaryStructure salary) {
		Long areaId = staffRepo.findById(salary.getStaffId()).get().getAreaId();
		BigDecimal security = getSecurityAmt(areaId);
		salary.setSecurity(security);
		SudaSalaryStructure found = salaryRepo.findByStaffId(salary.getStaffId());
		if(found==null) {
			SudaSalaryStructure saved = salaryRepo.save(salary);
			if(saved!=null) {
				return Result.SUCCESS.toString();
			}
			return Result.WENT_WRONG.toString();
		}
		return Result.ALLREADY_EXISTS.toString();
	}
	
	@Override
	public String updateSalary(Long salaryId, SudaSalaryStructure salary) {
		SudaSalaryStructure found = salaryRepo.findById(salaryId).get();
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
		SudaSalaryStructure saved = salaryRepo.save(found);
		return saved!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
		
	}
	
	@Override
	public SudaSalaryStructure findByStaffId(Long staffId) {
		SudaSalaryStructure found= salaryRepo.findByStaffId(staffId);
		return found!=null?found:null;
	}
	
	@Override
	public SudaSalaryStructure findById(Long salaryId) {
		return salaryRepo.findByStaffId(salaryId);
	}
	
	@Override
	public List<SudaSalaryStructure> getAllSalary(){
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
				SudaSalaryStructure saved = salaryRepo.save(found);
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


	//Helping Method


	private BigDecimal getSecurityAmt(Long areaId){
		if (areaId==4L||areaId==6L){
			return new BigDecimal(25000);
		}
		return new BigDecimal(15000);
	}

}
