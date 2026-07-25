package com.hrms.modules.dmc.hiring.service;

import com.hrms.modules.dmc.hiring.models.DmcDepartments;

import java.util.List;

public interface DmcDepartmentsServices {
	public String createDepartment(DmcDepartments dep);
	
	public String editDepartment(Long id, DmcDepartments dep);
	
	public String deactive_Department(Long id,String action);
	
	public DmcDepartments findById(Long id);
	
	public List<DmcDepartments> allDepartment();
	
	public String removeDepartment(Long id);
}
