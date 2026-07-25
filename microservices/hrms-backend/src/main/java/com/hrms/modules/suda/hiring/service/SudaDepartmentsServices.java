package com.hrms.modules.suda.hiring.service;

import com.hrms.modules.suda.hiring.models.SudaDepartments;

import java.util.List;

public interface SudaDepartmentsServices {
	public String createDepartment(SudaDepartments dep);
	
	public String editDepartment(Long id, SudaDepartments dep);
	
	public String deactive_Department(Long id,String action);
	
	public SudaDepartments findById(Long id);
	
	public List<SudaDepartments> allDepartment();
	
	public String removeDepartment(Long id);
}
