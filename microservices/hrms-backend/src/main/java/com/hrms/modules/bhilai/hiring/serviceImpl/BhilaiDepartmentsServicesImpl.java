package com.hrms.modules.bhilai.hiring.serviceImpl;

import java.util.List;

import com.hrms.modules.bhilai.hiring.models.BhilaiDepartments;
import com.hrms.modules.bhilai.hiring.repository.BhilaiDepartmentsRepo;
import com.hrms.modules.bhilai.hiring.service.BhilaiDepartmentsServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;

@Service
public class BhilaiDepartmentsServicesImpl implements BhilaiDepartmentsServices {

	@Autowired
	private BhilaiDepartmentsRepo depRepo;
	
	@Override
	public String createDepartment(BhilaiDepartments dep) {
		BhilaiDepartments found = depRepo.findByDepName(dep.getDepName());
		if(found ==null) {
			dep.setStatus(Status.ACTIVE);
			depRepo.save(dep);
			return Result.SUCCESS.toString();
		}
		return Result.ALLREADY_EXISTS.toString();
	}
	
	@Override
	public String editDepartment(Long id, BhilaiDepartments dep) {
		BhilaiDepartments found = depRepo.findById(id).get();
		if(found!=null) {
			found.setDepName(dep.getDepName());
			depRepo.save(found);
			return Result.SUCCESS.toString();
		}
		return Result.NOT_FOUND.toString();
	}
	
	@Override
	public String deactive_Department(Long id,String action) {
		BhilaiDepartments found = depRepo.findById(id).get();
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
	public BhilaiDepartments findById(Long id) {
		BhilaiDepartments found = depRepo.findById(id).get();
		return found!=null?found:null;
	}
	
	@Override
	public List<BhilaiDepartments> allDepartment(){
		List<BhilaiDepartments> found = depRepo.findAll();
		return found!=null?found:null;
	}
	
	@Override
	public String removeDepartment(Long id) {
		depRepo.deleteById(id);
		return Result.SUCCESS.toString();
	}
}
