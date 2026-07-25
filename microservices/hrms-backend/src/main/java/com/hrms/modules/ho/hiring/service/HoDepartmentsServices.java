package com.hrms.modules.ho.hiring.service;

import com.hrms.modules.ho.hiring.models.HoDepartments;

import java.util.List;

public interface HoDepartmentsServices {
	public String createDepartment(HoDepartments dep);
	
	public String editDepartment(Long id, HoDepartments dep);
	
	public String deactive_Department(Long id,String action);
	
	public HoDepartments findById(Long id);
	
	public List<HoDepartments> allDepartment();
	
	public String removeDepartment(Long id);
}
