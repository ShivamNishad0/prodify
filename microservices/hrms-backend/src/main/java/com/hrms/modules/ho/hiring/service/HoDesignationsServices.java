package com.hrms.modules.ho.hiring.service;

import com.hrms.modules.ho.hiring.models.HoDesignations;

import java.util.List;

public interface HoDesignationsServices {
	public String createDesignation(HoDesignations desig);
	
	public String editDesignattion(Long id, HoDesignations desig);
	
	public String statusOfDesig(Long id, String action);
	
	public HoDesignations findById(Long id);
	
	public List<HoDesignations> getAllDesignation();
	
	public String removeDesignation(Long id);
}
