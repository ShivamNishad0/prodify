package com.hrms.modules.dmc.hiring.service;

import com.hrms.modules.dtos.StaffAreaDTO;
import com.hrms.modules.dmc.hiring.models.DmcStaffArea;

import java.util.List;

public interface DmcStaffAreaService {
	public String saveStaffArea(StaffAreaDTO dto);
	public String UpdateStaffArea(Long areaId , StaffAreaDTO dto);
	public DmcStaffArea findById(Long id);
	public List<DmcStaffArea> allArea(Long zoneId);
	public String removeArea(Long areaId);
}
