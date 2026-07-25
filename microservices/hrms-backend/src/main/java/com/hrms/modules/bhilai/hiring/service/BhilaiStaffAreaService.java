package com.hrms.modules.bhilai.hiring.service;

import com.hrms.modules.dtos.StaffAreaDTO;
import com.hrms.modules.bhilai.hiring.models.BhilaiStaffArea;

import java.util.List;

public interface BhilaiStaffAreaService {
	public String saveStaffArea(StaffAreaDTO dto);
	public String UpdateStaffArea(Long areaId , StaffAreaDTO dto);
	public BhilaiStaffArea findById(Long id);
	public List<BhilaiStaffArea> allArea( );
	public String removeArea(Long areaId);
}
