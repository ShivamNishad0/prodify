package com.hrms.modules.suda.hiring.controller;

import com.hrms.modules.dtos.StaffAreaDTO;
import com.hrms.modules.suda.hiring.models.SudaStaffArea;
import com.hrms.modules.suda.hiring.service.SudaStaffAreaService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/spshrm/suda/area")
public class SudaStaffAreaController {
	
	 @Autowired
	    private SudaStaffAreaService staffAreaService;

	    @PostMapping("/save")
	    public ResponseEntity<String> saveStaffArea(@RequestBody StaffAreaDTO dto) {
	        String result = staffAreaService.saveStaffArea(dto);
	        if (Result.SUCCESS.toString().equals(result)) {
	            return new ResponseEntity<>(result, HttpStatus.CREATED);
	        } else {
	            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }

	    @PutMapping("/update/{areaId}")
	    public ResponseEntity<String> updateStaffArea(@PathVariable Long areaId, @RequestBody StaffAreaDTO dto) {
	        String result = staffAreaService.UpdateStaffArea(areaId, dto);
	        if (Result.SUCCESS.toString().equals(result)) {
	            return new ResponseEntity<>(result, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }

	    @GetMapping("/{id}")
	    public ResponseEntity<SudaStaffArea> findById(@PathVariable Long id) {
	        SudaStaffArea staffArea = staffAreaService.findById(id);
	        if (staffArea != null) {
	            return new ResponseEntity<>(staffArea, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	        }
	    }

	    @GetMapping("/all")
	    public ResponseEntity<List<SudaStaffArea>> getAllAreas(@RequestParam("zoneId")Long zoneId) {
	        List<SudaStaffArea> allAreas = staffAreaService.allArea(zoneId);
	        if (allAreas != null && !allAreas.isEmpty()) {
	            return new ResponseEntity<>(allAreas, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	        }
	    }

	    @DeleteMapping("/remove/{areaId}")
	    public ResponseEntity<String> removeArea(@PathVariable Long areaId) {
	        String result = staffAreaService.removeArea(areaId);
	        if (Result.SUCCESS.toString().equals(result)) {
	            return new ResponseEntity<>(result, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }
}
