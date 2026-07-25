package com.hrms.modules.bijli.hiring.controller;

import com.hrms.modules.dtos.QualificationDTO;
import com.hrms.modules.bijli.hiring.service.BijliStaffQualificationService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/bijli/quali")
public class BijliStaffQualificationContoller {

	@Autowired
	private BijliStaffQualificationService qualiService;
	
		@PostMapping("/save")
	    public ResponseEntity<String> saveQualifications(@RequestParam Long staffId, @RequestBody QualificationDTO qualifications) {
	        String result = qualiService.saveQualifications(staffId, qualifications);
	        if (Result.SUCCESS.toString().equals(result)) {
	            return ResponseEntity.ok("Qualifications saved successfully.");
	        } else {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save qualifications.");
	        }
	    }

	    @PutMapping("/update")
	    public ResponseEntity<String> updateQualification(@RequestBody QualificationDTO qualifications) {
	        String result = qualiService.updateQualification(qualifications);
	        if (Result.SUCCESS.toString().equals(result)) {
	            return ResponseEntity.ok("Qualifications updated successfully.");
	        } else {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update qualifications.");
	        }
	    }
	    
	    @DeleteMapping("/{qualiID}")
	    public ResponseEntity<String> deleteQualification(@PathVariable Long qualiID) {
	        String result = qualiService.deleteStaffQuali(qualiID);
	        if (Result.SUCCESS.toString().equals(result)) {
	            return ResponseEntity.ok("Qualifications updated successfully.");
	        } else {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update qualifications.");
	        }
	    }
}
