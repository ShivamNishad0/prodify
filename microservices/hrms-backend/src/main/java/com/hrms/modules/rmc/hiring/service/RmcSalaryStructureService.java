package com.hrms.modules.rmc.hiring.service;

import com.hrms.modules.dtos.CountAndDetails;
import com.hrms.modules.rmc.hiring.models.RmcSalaryStructure;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface RmcSalaryStructureService {
	public String newSalaryStructure(RmcSalaryStructure salary);
	public String updateSalary(Long salaryId, RmcSalaryStructure salary);
	public RmcSalaryStructure findById(Long salaryId);
	public List<RmcSalaryStructure> getAllSalary();
	public String deleteSalaryById(Long salaryId);
	public RmcSalaryStructure findByStaffId(Long staffId);
	public String saveTarget(Map<Long, BigDecimal> targets, int year, String month) ;
	public CountAndDetails searchSalaryStructure(String searchTerm);
}
