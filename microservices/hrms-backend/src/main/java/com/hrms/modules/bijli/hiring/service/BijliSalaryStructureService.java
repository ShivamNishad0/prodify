package com.hrms.modules.bijli.hiring.service;

import com.hrms.modules.bijli.hiring.models.BijliSalaryStructure;
import com.hrms.modules.dtos.CountAndDetails;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface BijliSalaryStructureService {
	public String newSalaryStructure(BijliSalaryStructure salary);
	public String updateSalary(Long salaryId, BijliSalaryStructure salary);
	public BijliSalaryStructure findById(Long salaryId);
	public List<BijliSalaryStructure> getAllSalary();
	public String deleteSalaryById(Long salaryId);
	public BijliSalaryStructure findByStaffId(Long staffId);
	public String saveTarget(Map<Long, BigDecimal> targets, int year, String month) ;

}
