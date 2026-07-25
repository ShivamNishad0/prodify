package com.hrms.modules.bijli.hiring.serviceImpl;

import com.hrms.modules.dtos.StaffAreaDTO;
import com.hrms.modules.bijli.hiring.models.BijliStaffArea;
import com.hrms.modules.bijli.hiring.repository.BijliStaffAreaRepo;
import com.hrms.modules.bijli.hiring.service.BijliStaffAreaService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BijliStaffAreaServiceImpl implements BijliStaffAreaService {

	@Autowired
	private BijliStaffAreaRepo areaRepo;

	@Override
	public String saveStaffArea(StaffAreaDTO dto) {
		BijliStaffArea staffArea = new BijliStaffArea();
		staffArea.setArea(dto.getArea());
		staffArea.setCircle(dto.getCircle());
		staffArea.setDivision(dto.getDivision());
		staffArea.setSubDivision(dto.getSubDivision());
		BijliStaffArea saved = areaRepo.save(staffArea);
		return saved!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
	}

	
	@Override
	public String UpdateStaffArea(Long areaId , StaffAreaDTO dto) {
		BijliStaffArea staffArea = areaRepo.findById(areaId).get();
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
	public BijliStaffArea findById(Long id) {
		BijliStaffArea area = areaRepo.findById(id).get();
		return area!=null?area:null;
	}
	
	@Override
	public List<BijliStaffArea> allArea(Long zoneId){
		List<BijliStaffArea> allArea = areaRepo.areaByZone();
		return allArea!=null?allArea:null;
	}
	
	@Override
	public String removeArea(Long areaId) {
		areaRepo.deleteById(areaId);
		return Result.SUCCESS.toString();
	}
}
