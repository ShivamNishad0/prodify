package com.hrms.modules.suda.hiring.serviceImpl;

import com.hrms.modules.dtos.StaffAreaDTO;
import com.hrms.modules.suda.hiring.models.SudaStaffArea;
import com.hrms.modules.suda.hiring.repository.SudaStaffAreaRepo;
import com.hrms.modules.suda.hiring.service.SudaStaffAreaService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SudaStaffAreaServiceImpl implements SudaStaffAreaService {

	@Autowired
	private SudaStaffAreaRepo areaRepo;

	@Override
	public String saveStaffArea(StaffAreaDTO dto) {
		SudaStaffArea staffArea = new SudaStaffArea();
		staffArea.setArea(dto.getArea());
		staffArea.setCircle(dto.getCircle());
		staffArea.setDivision(dto.getDivision());
		staffArea.setSubDivision(dto.getSubDivision());
		SudaStaffArea saved = areaRepo.save(staffArea);
		return saved!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
	}

	
	@Override
	public String UpdateStaffArea(Long areaId , StaffAreaDTO dto) {
		SudaStaffArea staffArea = areaRepo.findById(areaId).get();
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
	public SudaStaffArea findById(Long id) {
		SudaStaffArea area = areaRepo.findById(id).get();
		return area!=null?area:null;
	}
	
	@Override
	public List<SudaStaffArea> allArea(Long zoneId){
		List<SudaStaffArea> allArea = areaRepo.areaByZone(zoneId);
		return allArea!=null?allArea:null;
	}
	
	@Override
	public String removeArea(Long areaId) {
		areaRepo.deleteById(areaId);
		return Result.SUCCESS.toString();
	}
}
