package com.hrms.modules.bhilai.hiring.controller;


import com.hrms.modules.dtos.StaffExprienceDTOS;
import com.hrms.modules.bhilai.hiring.service.BhilaiStaffExprienceService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/bhilai/exp")
public class BhilaiStaffExprienceController {

	@Autowired
	private BhilaiStaffExprienceService expService;
	
	@PostMapping("/staff/{staffId}/save-exp")
    public ResponseEntity<String> saveOrUpdateExperience(@PathVariable("staffId") Long staffId,@RequestBody StaffExprienceDTOS experienceDTOList) {
        String result = expService.saveExp(staffId, experienceDTOList);
        if (result.equals(Result.SUCCESS.toString())) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save or update experiences.");
        }
    }
	
	@PutMapping("/staff/update")
    public ResponseEntity<String> updateExperience(@RequestBody StaffExprienceDTOS experienceDTOList) {
        String result = expService.updateExp(experienceDTOList);
        if (result.equals(Result.SUCCESS.toString())) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save or update experiences.");
        }
    }
	
	@DeleteMapping("/{expId}")
    public ResponseEntity<String> deleteExperience(@PathVariable Long expId) {
        try {
            String result = expService.deleteExp(expId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting experience");
        }
    }
}
