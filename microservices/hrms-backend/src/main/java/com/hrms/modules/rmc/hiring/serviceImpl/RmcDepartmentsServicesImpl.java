package com.hrms.modules.rmc.hiring.serviceImpl;

import java.util.List;

import com.hrms.modules.rmc.hiring.models.RmcDepartments;
import com.hrms.modules.rmc.hiring.repository.RmcDepartmentsRepo;
import com.hrms.modules.rmc.hiring.service.RmcDepartmentsServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;

@Service
public class RmcDepartmentsServicesImpl implements RmcDepartmentsServices {

	@Autowired
	private RmcDepartmentsRepo depRepo;
	
	@Override
	public String createDepartment(RmcDepartments dep) {
		RmcDepartments found = depRepo.findByDepName(dep.getDepName());
		if(found ==null) {
			dep.setStatus(Status.ACTIVE);
			depRepo.save(dep);
			return Result.SUCCESS.toString();
		}
		return Result.ALLREADY_EXISTS.toString();
	}
	
	@Override
	public String editDepartment(Long id, RmcDepartments dep) {
		RmcDepartments found = depRepo.findById(id).get();
		if(found!=null) {
			found.setDepName(dep.getDepName());
			depRepo.save(found);
			return Result.SUCCESS.toString();
		}
		return Result.NOT_FOUND.toString();
	}
	
	@Override
	public String deactive_Department(Long id,String action) {
		RmcDepartments found = depRepo.findById(id).get();
		if(found!=null) {
			if(action.equals("TRUE")) {
				found.setStatus(Status.ACTIVE);
				depRepo.save(found);
			}
			if(action.equals("FALSE")) {
				found.setStatus(Status.INACTIVE);
				depRepo.save(found);
			}
			return Result.SUCCESS.toString();
		}
		return Result.NOT_FOUND.toString();
	}
	
	@Override
	public RmcDepartments findById(Long id) {
		RmcDepartments found = depRepo.findById(id).get();
		return found!=null?found:null;
	}
	
	@Override
	public List<RmcDepartments> allDepartment(){
		List<RmcDepartments> found = depRepo.findAll();
		return found!=null?found:null;
	}
	
	@Override
	public String removeDepartment(Long id) {
		depRepo.deleteById(id);
		return Result.SUCCESS.toString();
	}
}
