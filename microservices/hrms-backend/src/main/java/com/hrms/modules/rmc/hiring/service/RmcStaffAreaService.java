package com.hrms.modules.rmc.hiring.service;

import com.hrms.modules.dtos.StaffAreaDTO;
import com.hrms.modules.rmc.hiring.models.RmcStaffArea;

import java.util.List;

public interface RmcStaffAreaService {
	public String saveStaffArea(StaffAreaDTO dto);
	public String UpdateStaffArea(Long areaId , StaffAreaDTO dto);
	public RmcStaffArea findById(Long id);
	public List<RmcStaffArea> allArea(Long zoneId);
	public String removeArea(Long areaId);
}
