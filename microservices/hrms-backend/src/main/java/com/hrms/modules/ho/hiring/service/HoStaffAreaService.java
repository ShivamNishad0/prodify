package com.hrms.modules.ho.hiring.service;

import com.hrms.modules.dtos.StaffAreaDTO;
import com.hrms.modules.ho.hiring.models.HoStaffArea;

import java.util.List;

public interface HoStaffAreaService {
	public String saveStaffArea(StaffAreaDTO dto);
	public String UpdateStaffArea(Long areaId , StaffAreaDTO dto);
	public HoStaffArea findById(Long id);
	public List<HoStaffArea> allArea();
	public String removeArea(Long areaId);
}
