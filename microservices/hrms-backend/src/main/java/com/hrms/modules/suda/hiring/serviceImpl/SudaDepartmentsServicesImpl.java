package com.hrms.modules.suda.hiring.serviceImpl;

import java.util.List;

import com.hrms.modules.suda.hiring.models.SudaDepartments;
import com.hrms.modules.suda.hiring.repository.SudaDepartmentsRepo;
import com.hrms.modules.suda.hiring.service.SudaDepartmentsServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;

@Service
public class SudaDepartmentsServicesImpl implements SudaDepartmentsServices {

	@Autowired
	private SudaDepartmentsRepo depRepo;
	
	@Override
	public String createDepartment(SudaDepartments dep) {
		SudaDepartments found = depRepo.findByDepName(dep.getDepName());
		if(found ==null) {
			dep.setStatus(Status.ACTIVE);
			depRepo.save(dep);
			return Result.SUCCESS.toString();
		}
		return Result.ALLREADY_EXISTS.toString();
	}
	
	@Override
	public String editDepartment(Long id, SudaDepartments dep) {
		SudaDepartments found = depRepo.findById(id).get();
		if(found!=null) {
			found.setDepName(dep.getDepName());
			depRepo.save(found);
			return Result.SUCCESS.toString();
		}
		return Result.NOT_FOUND.toString();
	}
	
	@Override
	public String deactive_Department(Long id,String action) {
		SudaDepartments found = depRepo.findById(id).get();
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
	public SudaDepartments findById(Long id) {
		SudaDepartments found = depRepo.findById(id).get();
		return found!=null?found:null;
	}
	
	@Override
	public List<SudaDepartments> allDepartment(){
		List<SudaDepartments> found = depRepo.findAll();
		return found!=null?found:null;
	}
	
	@Override
	public String removeDepartment(Long id) {
		depRepo.deleteById(id);
		return Result.SUCCESS.toString();
	}
}
