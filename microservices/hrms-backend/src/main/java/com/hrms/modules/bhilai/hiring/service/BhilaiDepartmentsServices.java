package com.hrms.modules.bhilai.hiring.service;

import com.hrms.modules.bhilai.hiring.models.BhilaiDepartments;

import java.util.List;

public interface BhilaiDepartmentsServices {
	public String createDepartment(BhilaiDepartments dep);
	
	public String editDepartment(Long id, BhilaiDepartments dep);
	
	public String deactive_Department(Long id,String action);
	
	public BhilaiDepartments findById(Long id);
	
	public List<BhilaiDepartments> allDepartment();
	
	public String removeDepartment(Long id);
}
