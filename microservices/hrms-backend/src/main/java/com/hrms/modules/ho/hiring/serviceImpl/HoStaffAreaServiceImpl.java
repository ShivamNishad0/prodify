package com.hrms.modules.ho.hiring.serviceImpl;

import com.hrms.modules.dtos.StaffAreaDTO;
import com.hrms.modules.ho.hiring.models.HoStaffArea;
import com.hrms.modules.ho.hiring.repository.HoStaffAreaRepo;
import com.hrms.modules.ho.hiring.service.HoStaffAreaService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HoStaffAreaServiceImpl implements HoStaffAreaService {

	@Autowired
	private HoStaffAreaRepo areaRepo;

	@Override
	public String saveStaffArea(StaffAreaDTO dto) {
		HoStaffArea staffArea = new HoStaffArea();
		staffArea.setArea(dto.getArea());
		staffArea.setCircle(dto.getCircle());
		staffArea.setDivision(dto.getDivision());
		staffArea.setSubDivision(dto.getSubDivision());
		HoStaffArea saved = areaRepo.save(staffArea);
		return saved!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
	}

	
	@Override
	public String UpdateStaffArea(Long areaId , StaffAreaDTO dto) {
		HoStaffArea staffArea = areaRepo.findById(areaId).get();
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
	public HoStaffArea findById(Long id) {
		HoStaffArea area = areaRepo.findById(id).get();
		return area!=null?area:null;
	}
	
	@Override
	public List<HoStaffArea> allArea(){
		List<HoStaffArea> allArea = areaRepo.areaByZone();
		return allArea!=null?allArea:null;
	}
	
	@Override
	public String removeArea(Long areaId) {
		areaRepo.deleteById(areaId);
		return Result.SUCCESS.toString();
	}
}
