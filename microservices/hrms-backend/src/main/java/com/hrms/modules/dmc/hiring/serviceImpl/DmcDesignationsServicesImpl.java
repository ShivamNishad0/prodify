package com.hrms.modules.dmc.hiring.serviceImpl;

import com.hrms.modules.dmc.hiring.models.DmcDesignations;
import com.hrms.modules.dmc.hiring.repository.DmcDesignationsRepo;
import com.hrms.modules.dmc.hiring.service.DmcDesignationsServices;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DmcDesignationsServicesImpl implements DmcDesignationsServices {

	@Autowired
	private DmcDesignationsRepo desigRepo;
	
	@Override
	public String createDesignation(DmcDesignations desig) {
		DmcDesignations des = desigRepo.findByDesig(desig.getDesigName());
		if(des==null) {
			desig.setStatus(Status.ACTIVE);
			desigRepo.save(desig);
			return Result.SUCCESS.toString();
		}
		return Result.ALLREADY_EXISTS.toString();
	}
	
	@Override
	public String editDesignattion(Long id, DmcDesignations desig) {
		DmcDesignations des = desigRepo.findById(id).get();
		if(des!=null) {
			des.setDesigName(desig.getDesigName());
			desigRepo.save(des);
			return Result.SUCCESS.toString();
		}
		return Result.NOT_FOUND.toString();
	}
	
	@Override
	public String statusOfDesig(Long id, String action) {
		DmcDesignations des = desigRepo.findById(id).get();
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
	public DmcDesignations findById(Long id) {
		DmcDesignations des = desigRepo.findById(id).get();
		return des!=null?des:null;
	}
	
	@Override
	public List<DmcDesignations> getAllDesignation(){
		List<DmcDesignations> found = desigRepo.findAll();
		return found!=null?found:null;
	}
	
	@Override
	public String removeDesignation(Long id) {
		desigRepo.deleteById(id);
		return Result.SUCCESS.toString();
	}
}
