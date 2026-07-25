package com.hrms.modules.bhilai.hiring.service;

import com.hrms.modules.bhilai.hiring.models.BhilaiSalaryStructure;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface BhilaiSalaryStructureService {
	public String newSalaryStructure(BhilaiSalaryStructure salary);
	public String updateSalary(Long salaryId, BhilaiSalaryStructure salary);
	public BhilaiSalaryStructure findById(Long salaryId);
	public List<BhilaiSalaryStructure> getAllSalary();
	public String deleteSalaryById(Long salaryId);
	public BhilaiSalaryStructure findByStaffId(Long staffId);
	public String saveTarget(Map<Long, BigDecimal> targets, int year, String month) ;
}
