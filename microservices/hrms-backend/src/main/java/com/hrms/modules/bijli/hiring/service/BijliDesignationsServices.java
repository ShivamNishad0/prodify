package com.hrms.modules.bijli.hiring.service;

import com.hrms.modules.bijli.hiring.models.BijliDesignations;

import java.util.List;

public interface BijliDesignationsServices {
	public String createDesignation(BijliDesignations desig);
	
	public String editDesignattion(Long id, BijliDesignations desig);
	
	public String statusOfDesig(Long id, String action);
	
	public BijliDesignations findById(Long id);
	
	public List<BijliDesignations> getAllDesignation();
	
	public String removeDesignation(Long id);
}
