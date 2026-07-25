package com.hrms.modules.rmc.hiring.service;

import com.hrms.modules.rmc.hiring.models.RmcDepartments;

import java.util.List;

public interface RmcDepartmentsServices {
	public String createDepartment(RmcDepartments dep);
	
	public String editDepartment(Long id, RmcDepartments dep);
	
	public String deactive_Department(Long id,String action);
	
	public RmcDepartments findById(Long id);
	
	public List<RmcDepartments> allDepartment();
	
	public String removeDepartment(Long id);
}
