package com.hrms.modules.dmc.hiring.serviceImpl;

import java.util.List;

import com.hrms.modules.dmc.hiring.models.DmcDepartments;
import com.hrms.modules.dmc.hiring.repository.DmcDepartmentsRepo;
import com.hrms.modules.dmc.hiring.service.DmcDepartmentsServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;

@Service
public class DmcDepartmentsServicesImpl implements DmcDepartmentsServices {

	@Autowired
	private DmcDepartmentsRepo depRepo;
	
	@Override
	public String createDepartment(DmcDepartments dep) {
		DmcDepartments found = depRepo.findByDepName(dep.getDepName());
		if(found ==null) {
			dep.setStatus(Status.ACTIVE);
			depRepo.save(dep);
			return Result.SUCCESS.toString();
		}
		return Result.ALLREADY_EXISTS.toString();
	}
	
	@Override
	public String editDepartment(Long id, DmcDepartments dep) {
		DmcDepartments found = depRepo.findById(id).get();
		if(found!=null) {
			found.setDepName(dep.getDepName());
			depRepo.save(found);
			return Result.SUCCESS.toString();
		}
		return Result.NOT_FOUND.toString();
	}
	
	@Override
	public String deactive_Department(Long id,String action) {
		DmcDepartments found = depRepo.findById(id).get();
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
	public DmcDepartments findById(Long id) {
		DmcDepartments found = depRepo.findById(id).get();
		return found!=null?found:null;
	}
	
	@Override
	public List<DmcDepartments> allDepartment(){
		List<DmcDepartments> found = depRepo.findAll();
		return found!=null?found:null;
	}
	
	@Override
	public String removeDepartment(Long id) {
		depRepo.deleteById(id);
		return Result.SUCCESS.toString();
	}
}
