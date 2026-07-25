package com.hrms.modules.suda.hiring.service;

import com.hrms.modules.dtos.StaffAreaDTO;
import com.hrms.modules.suda.hiring.models.SudaStaffArea;

import java.util.List;

public interface SudaStaffAreaService {
	public String saveStaffArea(StaffAreaDTO dto);
	public String UpdateStaffArea(Long areaId , StaffAreaDTO dto);
	public SudaStaffArea findById(Long id);
	public List<SudaStaffArea> allArea(Long zoneId);
	public String removeArea(Long areaId);
}
