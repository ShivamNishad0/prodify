package com.hrms.modules.bhilai.hiring.service;

import com.hrms.modules.bhilai.hiring.models.BhilaiDesignations;

import java.util.List;

public interface BhilaiDesignationsServices {
	public String createDesignation(BhilaiDesignations desig);
	
	public String editDesignattion(Long id, BhilaiDesignations desig);
	
	public String statusOfDesig(Long id, String action);
	
	public BhilaiDesignations findById(Long id);
	
	public List<BhilaiDesignations> getAllDesignation();
	
	public String removeDesignation(Long id);
}
