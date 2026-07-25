package com.hrms.modules.dmc.hiring.serviceImpl;

import com.hrms.modules.dtos.StaffAreaDTO;
import com.hrms.modules.dmc.hiring.models.DmcStaffArea;
import com.hrms.modules.dmc.hiring.repository.DmcStaffAreaRepo;
import com.hrms.modules.dmc.hiring.service.DmcStaffAreaService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DmcStaffAreaServiceImpl implements DmcStaffAreaService {

	@Autowired
	private DmcStaffAreaRepo areaRepo;

	@Override
	public String saveStaffArea(StaffAreaDTO dto) {
		DmcStaffArea staffArea = new DmcStaffArea();
		staffArea.setArea(dto.getArea());
		staffArea.setCircle(dto.getCircle());
		staffArea.setDivision(dto.getDivision());
		staffArea.setSubDivision(dto.getSubDivision());
		DmcStaffArea saved = areaRepo.save(staffArea);
		return saved!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
	}

	
	@Override
	public String UpdateStaffArea(Long areaId , StaffAreaDTO dto) {
		DmcStaffArea staffArea = areaRepo.findById(areaId).get();
		if(staffArea!=null) {
			staffArea.setArea(dto.getArea());
			staffArea.setCircle(dto.getCircle());
			staffArea.setDivision(dto.getDivision());
			staffArea.setSubDivision(dto.getSubDivision());
			 areaRepo.save(staffArea);
			return Result.SUCCESS.toString();
		}
		
		return Result.WENT_WRONG.toString();
	}
	
	@Override
	public DmcStaffArea findById(Long id) {
		DmcStaffArea area = areaRepo.findById(id).get();
		return area!=null?area:null;
	}
	
	@Override
	public List<DmcStaffArea> allArea(Long zoneId){
		List<DmcStaffArea> allArea = areaRepo.areaByZone(zoneId);
		return allArea!=null?allArea:null;
	}
	
	@Override
	public String removeArea(Long areaId) {
		areaRepo.deleteById(areaId);
		return Result.SUCCESS.toString();
	}
}
