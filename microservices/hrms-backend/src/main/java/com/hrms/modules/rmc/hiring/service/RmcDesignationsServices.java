package com.hrms.modules.rmc.hiring.service;

import com.hrms.modules.rmc.hiring.models.RmcDesignations;

import java.util.List;

public interface RmcDesignationsServices {
	public String createDesignation(RmcDesignations desig);
	
	public String editDesignattion(Long id, RmcDesignations desig);
	
	public String statusOfDesig(Long id, String action);
	
	public RmcDesignations findById(Long id);
	
	public List<RmcDesignations> getAllDesignation();
	
	public String removeDesignation(Long id);
}
