package com.hrms.modules.rmc.hiring.controller;

import com.hrms.modules.rmc.hiring.models.RmcDesignations;
import com.hrms.modules.rmc.hiring.service.RmcDesignationsServices;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/rmc/designations")
public class RmcDesignationsController {
	 @Autowired
	    private RmcDesignationsServices desigService;

	    @PostMapping("/create")
	    public ResponseEntity<String> createDesignation(@RequestBody RmcDesignations desig) {
	        String result = desigService.createDesignation(desig);
	        if (result.equals(Result.SUCCESS.toString())) {
	            return new ResponseEntity<>(result, HttpStatus.CREATED);
	        } else {
	            return new ResponseEntity<>(result, HttpStatus.CONFLICT);
	        }
	    }

	    @PutMapping("/edit/{id}")
	    public ResponseEntity<String> editDesignation(@PathVariable Long id, @RequestBody RmcDesignations desig) {
	        String result = desigService.editDesignattion(id, desig);
	        if (result.equals(Result.SUCCESS.toString())) {
	            return new ResponseEntity<>(result, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
	        }
	    }

	    @PutMapping("/status/{id}")
	    public ResponseEntity<String> statusOfDesignation(@PathVariable Long id, @RequestParam String action) {
	        String result = desigService.statusOfDesig(id, action);
	        if (result.equals(Result.SUCCESS.toString())) {
	            return new ResponseEntity<>(result, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
	        }
	    }

	    @GetMapping("/find/{id}")
	    public ResponseEntity<RmcDesignations> findById(@PathVariable Long id) {
	        RmcDesignations desig = desigService.findById(id);
	        if (desig != null) {
	            return new ResponseEntity<>(desig, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
	        }
	    }

	    @GetMapping("/all")
	    public ResponseEntity<List<RmcDesignations>> getAllDesignation() {
	        List<RmcDesignations> desigs = desigService.getAllDesignation();
	        if (desigs != null && !desigs.isEmpty()) {
	            return new ResponseEntity<>(desigs, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
	        }
	    }

	    @DeleteMapping("/remove/{id}")
	    public ResponseEntity<String> removeDesignation(@PathVariable Long id) {
	        String result = desigService.removeDesignation(id);
	        return new ResponseEntity<>(result, HttpStatus.OK);
	    }
}
