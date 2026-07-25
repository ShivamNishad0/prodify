package com.hrms.modules.bhilai.hiring.controller;

import com.hrms.modules.bhilai.hiring.models.BhilaiDepartments;
import com.hrms.modules.bhilai.hiring.service.BhilaiDepartmentsServices;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spshrm/bhilai/department")
@CrossOrigin
public class BhilaiDepartmentsControllers {

	 @Autowired
	    private BhilaiDepartmentsServices depService;

	    @PostMapping("/create")
	    public ResponseEntity<String> createDepartment(@RequestBody BhilaiDepartments dep) {
	        String result = depService.createDepartment(dep);
	        if (result.equals(Result.SUCCESS.toString())) {
	            return new ResponseEntity<>(result, HttpStatus.CREATED);
	        } else {
	            return new ResponseEntity<>(result, HttpStatus.CONFLICT);
	        }
	    }

	    @PutMapping("/edit/{id}")
	    public ResponseEntity<String> editDepartment(@PathVariable Long id, @RequestBody BhilaiDepartments dep) {
	        String result = depService.editDepartment(id, dep);
	        if (result.equals(Result.SUCCESS.toString())) {
	            return new ResponseEntity<>(result, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
	        }
	    }

	    @PutMapping("/action/{id}")
	    public ResponseEntity<String> deactivateDepartment(@PathVariable Long id, @RequestParam String action) {
	        String result = depService.deactive_Department(id, action);
	        if (result.equals(Result.SUCCESS.toString())) {
	            return new ResponseEntity<>(result, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
	        }
	    }

	    @GetMapping("/find/{id}")
	    public ResponseEntity<BhilaiDepartments> findById(@PathVariable Long id) {
	        BhilaiDepartments dep = depService.findById(id);
	        if (dep != null) {
	            return new ResponseEntity<>(dep, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
	        }
	    }

	    @GetMapping("/all")
	    public ResponseEntity<List<BhilaiDepartments>> allDepartment() {
	        List<BhilaiDepartments> deps = depService.allDepartment();
	        if (deps != null && !deps.isEmpty()) {
	            return new ResponseEntity<>(deps, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
	        }
	    }

	    @DeleteMapping("/remove/{id}")
	    public ResponseEntity<String> removeDepartment(@PathVariable Long id) {
	        String result = depService.removeDepartment(id);
	        return new ResponseEntity<>(result, HttpStatus.OK);
	    }
}
