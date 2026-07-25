package com.hrms.modules.suda.hiring.serviceImpl;

import com.hrms.modules.suda.hiring.models.SudaDesignations;
import com.hrms.modules.suda.hiring.repository.SudaDesignationsRepo;
import com.hrms.modules.suda.hiring.service.SudaDesignationsServices;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SudaDesignationsServicesImpl implements SudaDesignationsServices {

	@Autowired
	private SudaDesignationsRepo desigRepo;
	
	@Override
	public String createDesignation(SudaDesignations desig) {
		SudaDesignations des = desigRepo.findByDesig(desig.getDesigName());
		if(des==null) {
			desig.setStatus(Status.ACTIVE);
			desigRepo.save(desig);
			return Result.SUCCESS.toString();
		}
		return Result.ALLREADY_EXISTS.toString();
	}
	
	@Override
	public String editDesignattion(Long id, SudaDesignations desig) {
		SudaDesignations des = desigRepo.findById(id).get();
		if(des!=null) {
			des.setDesigName(desig.getDesigName());
			desigRepo.save(des);
			return Result.SUCCESS.toString();
		}
		return Result.NOT_FOUND.toString();
	}
	
	@Override
	public String statusOfDesig(Long id, String action) {
		SudaDesignations des = desigRepo.findById(id).get();
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
	public SudaDesignations findById(Long id) {
		SudaDesignations des = desigRepo.findById(id).get();
		return des!=null?des:null;
	}
	
	@Override
	public List<SudaDesignations> getAllDesignation(){
		List<SudaDesignations> found = desigRepo.findAll();
		return found!=null?found:null;
	}
	
	@Override
	public String removeDesignation(Long id) {
		desigRepo.deleteById(id);
		return Result.SUCCESS.toString();
	}
}
