package com.hrms.modules.bijli.hiring.service;

import com.hrms.modules.dtos.StaffAreaDTO;
import com.hrms.modules.bijli.hiring.models.BijliStaffArea;

import java.util.List;

public interface BijliStaffAreaService {
	public String saveStaffArea(StaffAreaDTO dto);
	public String UpdateStaffArea(Long areaId , StaffAreaDTO dto);
	public BijliStaffArea findById(Long id);
	public List<BijliStaffArea> allArea(Long zoneId);
	public String removeArea(Long areaId);
}
