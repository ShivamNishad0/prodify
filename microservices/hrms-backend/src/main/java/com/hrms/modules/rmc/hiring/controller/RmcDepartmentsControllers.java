package com.hrms.modules.rmc.hiring.controller;

import com.hrms.modules.rmc.hiring.models.RmcDepartments;
import com.hrms.modules.rmc.hiring.service.RmcDepartmentsServices;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spshrm/rmc/department")
@CrossOrigin
public class RmcDepartmentsControllers {

	 @Autowired
	    private RmcDepartmentsServices depService;

	    @PostMapping("/create")
	    public ResponseEntity<String> createDepartment(@RequestBody RmcDepartments dep) {
	        String result = depService.createDepartment(dep);
	        if (result.equals(Result.SUCCESS.toString())) {
	            return new ResponseEntity<>(result, HttpStatus.CREATED);
	        } else {
	            return new ResponseEntity<>(result, HttpStatus.CONFLICT);
	        }
	    }

	    @PutMapping("/edit/{id}")
	    public ResponseEntity<String> editDepartment(@PathVariable Long id, @RequestBody RmcDepartments dep) {
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
	    public ResponseEntity<RmcDepartments> findById(@PathVariable Long id) {
	        RmcDepartments dep = depService.findById(id);
	        if (dep != null) {
	            return new ResponseEntity<>(dep, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
	        }
	    }

	    @GetMapping("/all")
	    public ResponseEntity<List<RmcDepartments>> allDepartment() {
	        List<RmcDepartments> deps = depService.allDepartment();
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
