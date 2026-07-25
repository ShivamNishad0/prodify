package com.hrms.modules.ho.hiring.serviceImpl;

import com.hrms.modules.ho.hiring.models.HoDesignations;
import com.hrms.modules.ho.hiring.repository.HoDesignationsRepo;
import com.hrms.modules.ho.hiring.service.HoDesignationsServices;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HoDesignationsServicesImpl implements HoDesignationsServices {

	@Autowired
	private HoDesignationsRepo desigRepo;
	
	@Override
	public String createDesignation(HoDesignations desig) {
		HoDesignations des = desigRepo.findByDesig(desig.getDesigName());
		if(des==null) {
			desig.setStatus(Status.ACTIVE);
			desigRepo.save(desig);
			return Result.SUCCESS.toString();
		}
		return Result.ALLREADY_EXISTS.toString();
	}
	
	@Override
	public String editDesignattion(Long id, HoDesignations desig) {
		HoDesignations des = desigRepo.findById(id).get();
		if(des!=null) {
			des.setDesigName(desig.getDesigName());
			desigRepo.save(des);
			return Result.SUCCESS.toString();
		}
		return Result.NOT_FOUND.toString();
	}
	
	@Override
	public String statusOfDesig(Long id, String action) {
		HoDesignations des = desigRepo.findById(id).get();
		if(des!=null) {
			if(action.equals("TRUE")) {
				des.setStatus(Status.ACTIVE);
				desigRepo.save(des);
			}
			if(action.equals("FALSE")) {
				des.setStatus(Status.INACTIVE);
				desigRepo.save(des);
			}
			return Result.SUCCESS.toString();
		}
		return Result.NOT_FOUND.toString();
	}
	
	@Override
	public HoDesignations findById(Long id) {
		HoDesignations des = desigRepo.findById(id).get();
		return des!=null?des:null;
	}
	
	@Override
	public List<HoDesignations> getAllDesignation(){
		List<HoDesignations> found = desigRepo.findAll();
		return found!=null?found:null;
	}
	
	@Override
	public String removeDesignation(Long id) {
		desigRepo.deleteById(id);
		return Result.SUCCESS.toString();
	}
}
