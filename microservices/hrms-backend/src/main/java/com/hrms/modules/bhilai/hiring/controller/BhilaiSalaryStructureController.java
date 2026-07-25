package com.hrms.modules.bhilai.hiring.controller;

import com.hrms.modules.bhilai.hiring.models.BhilaiSalaryStructure;
import com.hrms.modules.bhilai.hiring.service.BhilaiSalaryStructureService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/bhilai/salary")
public class BhilaiSalaryStructureController {

	  @Autowired
	    private BhilaiSalaryStructureService salaryService;
	  
	  @PostMapping("/new")
	    public ResponseEntity<String> newSalaryStructure(@RequestBody BhilaiSalaryStructure salary) {
	        String result = salaryService.newSalaryStructure(salary);
	        if(result.equals(Result.SUCCESS.toString())) {	        	
	        	return ResponseEntity.ok(result);
	        }
	        else if(result.equals(Result.ALLREADY_EXISTS.toString())) {
	        	return new ResponseEntity<>(result, HttpStatus.CONFLICT);
	        }
	        return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
	    }

	    @PutMapping("/update/{salaryId}")
	    public ResponseEntity<String> updateSalary(@PathVariable Long salaryId, @RequestBody BhilaiSalaryStructure salary) {
	        String result = salaryService.updateSalary(salaryId, salary);
	        return ResponseEntity.ok(result);
	    }

	    @GetMapping("/by-staff/{salaryId}")
	    public ResponseEntity<BhilaiSalaryStructure> findByStaffId(@PathVariable Long salaryId) {
	        BhilaiSalaryStructure salary = salaryService.findByStaffId(salaryId);
	        return ResponseEntity.ok(salary);
	    }
	    
	    @GetMapping("/by-staff-data/{staffId}")
	    public ResponseEntity<BhilaiSalaryStructure> findBySatffId(@PathVariable Long staffId) {
	        BhilaiSalaryStructure salary = salaryService.findByStaffId(staffId);
	        if(salary!=null) {	        	
	        	return ResponseEntity.ok(salary);
	        }
	        return new ResponseEntity<>(salary, HttpStatus.NO_CONTENT);
	    }

	    @GetMapping("/all")
	    public ResponseEntity<List<BhilaiSalaryStructure>> getAllSalary() {
	        List<BhilaiSalaryStructure> salaries = salaryService.getAllSalary();
	        return ResponseEntity.ok(salaries);
	    }

	    @DeleteMapping("/delete/{salaryId}")
	    public ResponseEntity<String> deleteSalaryById(@PathVariable Long salaryId) {
	        String result = salaryService.deleteSalaryById(salaryId);
	        return ResponseEntity.ok(result);
	    }

//		@PostMapping("/month-target")
//		public ResponseEntity<?> targetOfMonth(@RequestBody TargetRequestDTO request) {
//			Map<Long, BigDecimal> targets = request.getTargets();
//			String result = salaryService.saveTarget(targets,request.getYear(),request.getMonth());
//			// Return an appropriate response
//			if (result.contains("Failed")) {
//				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(result);
//			} else {
//				return ResponseEntity.status(HttpStatus.OK).body(result);
//			}
//		}

}
