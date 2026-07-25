package com.hrms.modules.rmc.hiring.serviceImpl;

import com.hrms.modules.dtos.StaffAreaDTO;
import com.hrms.modules.rmc.hiring.models.RmcStaffArea;
import com.hrms.modules.rmc.hiring.repository.RmcStaffAreaRepo;
import com.hrms.modules.rmc.hiring.service.RmcStaffAreaService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RmcStaffAreaServiceImpl implements RmcStaffAreaService {

	@Autowired
	private RmcStaffAreaRepo areaRepo;

	@Override
	public String saveStaffArea(StaffAreaDTO dto) {
		RmcStaffArea staffArea = new RmcStaffArea();
		staffArea.setArea(dto.getArea());
		staffArea.setCircle(dto.getCircle());
		staffArea.setDivision(dto.getDivision());
		staffArea.setSubDivision(dto.getSubDivision());
		RmcStaffArea saved = areaRepo.save(staffArea);
		return saved!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
	}

	
	@Override
	public String UpdateStaffArea(Long areaId , StaffAreaDTO dto) {
		RmcStaffArea staffArea = areaRepo.findById(areaId).get();
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
	public RmcStaffArea findById(Long id) {
		RmcStaffArea area = areaRepo.findById(id).get();
		return area!=null?area:null;
	}
	
	@Override
	public List<RmcStaffArea> allArea(Long zoneId){
		List<RmcStaffArea> allArea = areaRepo.areaByZone(zoneId);
		return allArea!=null?allArea:null;
	}
	
	@Override
	public String removeArea(Long areaId) {
		areaRepo.deleteById(areaId);
		return Result.SUCCESS.toString();
	}
}
