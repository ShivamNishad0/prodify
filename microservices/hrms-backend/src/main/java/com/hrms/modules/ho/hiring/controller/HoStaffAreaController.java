package com.hrms.modules.ho.hiring.controller;

import com.hrms.modules.dtos.StaffAreaDTO;
import com.hrms.modules.ho.hiring.models.HoStaffArea;
import com.hrms.modules.ho.hiring.service.HoStaffAreaService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/spshrm/ho/area")
public class HoStaffAreaController {
	
	 @Autowired
	    private HoStaffAreaService staffAreaService;

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
	    public ResponseEntity<HoStaffArea> findById(@PathVariable Long id) {
	        HoStaffArea staffArea = staffAreaService.findById(id);
	        if (staffArea != null) {
	            return new ResponseEntity<>(staffArea, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	        }
	    }

	    @GetMapping("/all")
	    public ResponseEntity<List<HoStaffArea>> getAllAreas() {
	        List<HoStaffArea> allAreas = staffAreaService.allArea();
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
