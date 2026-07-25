package com.hrms.modules.dmc.hiring.controller;

import com.hrms.modules.dmc.hiring.models.DmcDesignations;
import com.hrms.modules.dmc.hiring.service.DmcDesignationsServices;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/dmc/designations")
public class DmcDesignationsController {
	 @Autowired
	    private DmcDesignationsServices desigService;

	    @PostMapping("/create")
	    public ResponseEntity<String> createDesignation(@RequestBody DmcDesignations desig) {
	        String result = desigService.createDesignation(desig);
	        if (result.equals(Result.SUCCESS.toString())) {
	            return new ResponseEntity<>(result, HttpStatus.CREATED);
	        } else {
	            return new ResponseEntity<>(result, HttpStatus.CONFLICT);
	        }
	    }

	    @PutMapping("/edit/{id}")
	    public ResponseEntity<String> editDesignation(@PathVariable Long id, @RequestBody DmcDesignations desig) {
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
	    public ResponseEntity<DmcDesignations> findById(@PathVariable Long id) {
	        DmcDesignations desig = desigService.findById(id);
	        if (desig != null) {
	            return new ResponseEntity<>(desig, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
	        }
	    }

	    @GetMapping("/all")
	    public ResponseEntity<List<DmcDesignations>> getAllDesignation() {
	        List<DmcDesignations> desigs = desigService.getAllDesignation();
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
