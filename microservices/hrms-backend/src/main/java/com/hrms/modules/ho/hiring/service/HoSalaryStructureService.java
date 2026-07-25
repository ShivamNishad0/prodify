package com.hrms.modules.ho.hiring.service;

import com.hrms.modules.ho.hiring.models.HoSalaryStructure;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface HoSalaryStructureService {
	public String newSalaryStructure(HoSalaryStructure salary);
	public String updateSalary(Long salaryId, HoSalaryStructure salary);
	public HoSalaryStructure findById(Long salaryId);
	public List<HoSalaryStructure> getAllSalary();
	public String deleteSalaryById(Long salaryId);
	public HoSalaryStructure findByStaffId(Long staffId);
	public String saveTarget(Map<Long, BigDecimal> targets, int year, String month) ;
}
