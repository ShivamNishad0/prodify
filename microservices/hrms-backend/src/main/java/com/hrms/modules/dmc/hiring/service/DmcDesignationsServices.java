package com.hrms.modules.dmc.hiring.service;

import com.hrms.modules.dmc.hiring.models.DmcDesignations;

import java.util.List;

public interface DmcDesignationsServices {
	public String createDesignation(DmcDesignations desig);
	
	public String editDesignattion(Long id, DmcDesignations desig);
	
	public String statusOfDesig(Long id, String action);
	
	public DmcDesignations findById(Long id);
	
	public List<DmcDesignations> getAllDesignation();
	
	public String removeDesignation(Long id);
}
