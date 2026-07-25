package com.hrms.modules.dmc.hiring.service;

import com.hrms.modules.dmc.hiring.models.DmcSalaryStructure;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface DmcSalaryStructureService {
	public String newSalaryStructure(DmcSalaryStructure salary);
	public String updateSalary(Long salaryId, DmcSalaryStructure salary);
	public DmcSalaryStructure findById(Long salaryId);
	public List<DmcSalaryStructure> getAllSalary();
	public String deleteSalaryById(Long salaryId);
	public DmcSalaryStructure findByStaffId(Long staffId);
	public String saveTarget(Map<Long, BigDecimal> targets, int year, String month) ;
}
