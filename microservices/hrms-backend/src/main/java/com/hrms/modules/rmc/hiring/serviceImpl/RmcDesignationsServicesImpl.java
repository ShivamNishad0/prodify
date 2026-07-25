package com.hrms.modules.rmc.hiring.serviceImpl;

import com.hrms.modules.rmc.hiring.models.RmcDesignations;
import com.hrms.modules.rmc.hiring.repository.RmcDesignationsRepo;
import com.hrms.modules.rmc.hiring.service.RmcDesignationsServices;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RmcDesignationsServicesImpl implements RmcDesignationsServices {

	@Autowired
	private RmcDesignationsRepo desigRepo;
	
	@Override
	public String createDesignation(RmcDesignations desig) {
		RmcDesignations des = desigRepo.findByDesig(desig.getDesigName());
		if(des==null) {
			desig.setStatus(Status.ACTIVE);
			desigRepo.save(desig);
			return Result.SUCCESS.toString();
		}
		return Result.ALLREADY_EXISTS.toString();
	}
	
	@Override
	public String editDesignattion(Long id, RmcDesignations desig) {
		RmcDesignations des = desigRepo.findById(id).get();
		if(des!=null) {
			des.setDesigName(desig.getDesigName());
			desigRepo.save(des);
			return Result.SUCCESS.toString();
		}
		return Result.NOT_FOUND.toString();
	}
	
	@Override
	public String statusOfDesig(Long id, String action) {
		RmcDesignations des = desigRepo.findById(id).get();
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
	public RmcDesignations findById(Long id) {
		RmcDesignations des = desigRepo.findById(id).get();
		return des!=null?des:null;
	}
	
	@Override
	public List<RmcDesignations> getAllDesignation(){
		List<RmcDesignations> found = desigRepo.findAll();
		return found!=null?found:null;
	}
	
	@Override
	public String removeDesignation(Long id) {
		desigRepo.deleteById(id);
		return Result.SUCCESS.toString();
	}
}
