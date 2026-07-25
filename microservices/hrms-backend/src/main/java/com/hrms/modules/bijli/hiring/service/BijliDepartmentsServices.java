package com.hrms.modules.bijli.hiring.service;

import com.hrms.modules.bijli.hiring.models.BijliDepartments;

import java.util.List;

public interface BijliDepartmentsServices {
	public String createDepartment(BijliDepartments dep);
	
	public String editDepartment(Long id, BijliDepartments dep);
	
	public String deactive_Department(Long id,String action);
	
	public BijliDepartments findById(Long id);
	
	public List<BijliDepartments> allDepartment();
	
	public String removeDepartment(Long id);
}
