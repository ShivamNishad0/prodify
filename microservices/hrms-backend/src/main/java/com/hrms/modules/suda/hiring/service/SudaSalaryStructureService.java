package com.hrms.modules.suda.hiring.service;

import com.hrms.modules.suda.hiring.models.SudaSalaryStructure;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface SudaSalaryStructureService {
	public String newSalaryStructure(SudaSalaryStructure salary);
	public String updateSalary(Long salaryId, SudaSalaryStructure salary);
	public SudaSalaryStructure findById(Long salaryId);
	public List<SudaSalaryStructure> getAllSalary();
	public String deleteSalaryById(Long salaryId);
	public SudaSalaryStructure findByStaffId(Long staffId);
	public String saveTarget(Map<Long, BigDecimal> targets, int year, String month) ;
}
