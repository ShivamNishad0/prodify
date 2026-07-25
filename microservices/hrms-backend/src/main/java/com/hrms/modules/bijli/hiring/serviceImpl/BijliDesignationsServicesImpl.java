package com.hrms.modules.bijli.hiring.serviceImpl;

import com.hrms.modules.bijli.hiring.models.BijliDesignations;
import com.hrms.modules.bijli.hiring.repository.BijliDesignationsRepo;
import com.hrms.modules.bijli.hiring.service.BijliDesignationsServices;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BijliDesignationsServicesImpl implements BijliDesignationsServices {

	@Autowired
	private BijliDesignationsRepo desigRepo;
	
	@Override
	public String createDesignation(BijliDesignations desig) {
		BijliDesignations des = desigRepo.findByDesig(desig.getDesigName());
		if(des==null) {
			desig.setStatus(Status.ACTIVE);
			desigRepo.save(desig);
			return Result.SUCCESS.toString();
		}
		return Result.ALLREADY_EXISTS.toString();
	}
	
	@Override
	public String editDesignattion(Long id, BijliDesignations desig) {
		BijliDesignations des = desigRepo.findById(id).get();
		if(des!=null) {
			des.setDesigName(desig.getDesigName());
			desigRepo.save(des);
			return Result.SUCCESS.toString();
		}
		return Result.NOT_FOUND.toString();
	}
	
	@Override
	public String statusOfDesig(Long id, String action) {
		BijliDesignations des = desigRepo.findById(id).get();
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
	public BijliDesignations findById(Long id) {
		BijliDesignations des = desigRepo.findById(id).get();
		return des!=null?des:null;
	}
	
	@Override
	public List<BijliDesignations> getAllDesignation(){
		List<BijliDesignations> found = desigRepo.findAll();
		return found!=null?found:null;
	}
	
	@Override
	public String removeDesignation(Long id) {
		desigRepo.deleteById(id);
		return Result.SUCCESS.toString();
	}
}
