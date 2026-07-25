package com.hrms.modules.suda.hiring.service;

import com.hrms.modules.suda.hiring.models.SudaDesignations;

import java.util.List;

public interface SudaDesignationsServices {
	public String createDesignation(SudaDesignations desig);
	
	public String editDesignattion(Long id, SudaDesignations desig);
	
	public String statusOfDesig(Long id, String action);
	
	public SudaDesignations findById(Long id);
	
	public List<SudaDesignations> getAllDesignation();
	
	public String removeDesignation(Long id);
}
