package com.hrms.modules.bhilai.hiring.serviceImpl;

import com.hrms.modules.dtos.StaffAreaDTO;
import com.hrms.modules.bhilai.hiring.models.BhilaiStaffArea;
import com.hrms.modules.bhilai.hiring.repository.BhilaiStaffAreaRepo;
import com.hrms.modules.bhilai.hiring.service.BhilaiStaffAreaService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BhilaiStaffAreaServiceImpl implements BhilaiStaffAreaService {

	@Autowired
	private BhilaiStaffAreaRepo areaRepo;

	@Override
	public String saveStaffArea(StaffAreaDTO dto) {
		BhilaiStaffArea bhilaiStaffArea = new BhilaiStaffArea();
		bhilaiStaffArea.setArea(dto.getArea());
		bhilaiStaffArea.setCircle(dto.getCircle());
		bhilaiStaffArea.setDivision(dto.getDivision());
		bhilaiStaffArea.setSubDivision(dto.getSubDivision());
		BhilaiStaffArea saved = areaRepo.save(bhilaiStaffArea);
		return saved!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
	}

	
	@Override
	public String UpdateStaffArea(Long areaId , StaffAreaDTO dto) {
		BhilaiStaffArea bhilaiStaffArea = areaRepo.findById(areaId).get();
		if(bhilaiStaffArea !=null) {
			bhilaiStaffArea.setArea(dto.getArea());
			bhilaiStaffArea.setCircle(dto.getCircle());
			bhilaiStaffArea.setDivision(dto.getDivision());
			bhilaiStaffArea.setSubDivision(dto.getSubDivision());
			 areaRepo.save(bhilaiStaffArea);
			return Result.SUCCESS.toString();
		}
		
		return Result.WENT_WRONG.toString();
	}
	
	@Override
	public BhilaiStaffArea findById(Long id) {
		BhilaiStaffArea area = areaRepo.findById(id).get();
		return area!=null?area:null;
	}
	
	@Override
	public List<BhilaiStaffArea> allArea(){
		List<BhilaiStaffArea> allArea = areaRepo.areaByZone();
		return allArea!=null?allArea:null;
	}
	
	@Override
	public String removeArea(Long areaId) {
		areaRepo.deleteById(areaId);
		return Result.SUCCESS.toString();
	}
}
