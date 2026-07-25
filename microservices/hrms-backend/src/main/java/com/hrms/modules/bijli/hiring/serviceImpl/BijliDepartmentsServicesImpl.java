package com.hrms.modules.bijli.hiring.serviceImpl;

import java.util.List;

import com.hrms.modules.bijli.hiring.models.BijliDepartments;
import com.hrms.modules.bijli.hiring.repository.BijliDepartmentsRepo;
import com.hrms.modules.bijli.hiring.service.BijliDepartmentsServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;

@Service
public class BijliDepartmentsServicesImpl implements BijliDepartmentsServices {

	@Autowired
	private BijliDepartmentsRepo depRepo;
	
	@Override
	public String createDepartment(BijliDepartments dep) {
		BijliDepartments found = depRepo.findByDepName(dep.getDepName());
		if(found ==null) {
			dep.setStatus(Status.ACTIVE);
			depRepo.save(dep);
			return Result.SUCCESS.toString();
		}
		return Result.ALLREADY_EXISTS.toString();
	}
	
	@Override
	public String editDepartment(Long id, BijliDepartments dep) {
		BijliDepartments found = depRepo.findById(id).get();
		if(found!=null) {
			found.setDepName(dep.getDepName());
			depRepo.save(found);
			return Result.SUCCESS.toString();
		}
		return Result.NOT_FOUND.toString();
	}
	
	@Override
	public String deactive_Department(Long id,String action) {
		BijliDepartments found = depRepo.findById(id).get();
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
	public BijliDepartments findById(Long id) {
		BijliDepartments found = depRepo.findById(id).get();
		return found!=null?found:null;
	}
	
	@Override
	public List<BijliDepartments> allDepartment(){
		List<BijliDepartments> found = depRepo.findAll();
		return found!=null?found:null;
	}
	
	@Override
	public String removeDepartment(Long id) {
		depRepo.deleteById(id);
		return Result.SUCCESS.toString();
	}
}
