package com.hrms.modules.bhilai.hiring.controller;

import com.hrms.modules.dtos.StaffAreaDTO;
import com.hrms.modules.bhilai.hiring.models.BhilaiStaffArea;
import com.hrms.modules.bhilai.hiring.service.BhilaiStaffAreaService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/spshrm/bhilai/area")
public class BhilaiStaffAreaController {
	
	 @Autowired
	    private BhilaiStaffAreaService bhilaiStaffAreaService;

	    @PostMapping("/save")
	    public ResponseEntity<String> saveStaffArea(@RequestBody StaffAreaDTO dto) {
	        String result = bhilaiStaffAreaService.saveStaffArea(dto);
	        if (Result.SUCCESS.toString().equals(result)) {
	            return new ResponseEntity<>(result, HttpStatus.CREATED);
	        } else {
	            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }

	    @PutMapping("/update/{areaId}")
	    public ResponseEntity<String> updateStaffArea(@PathVariable Long areaId, @RequestBody StaffAreaDTO dto) {
	        String result = bhilaiStaffAreaService.UpdateStaffArea(areaId, dto);
	        if (Result.SUCCESS.toString().equals(result)) {
	            return new ResponseEntity<>(result, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }

	    @GetMapping("/{id}")
	    public ResponseEntity<BhilaiStaffArea> findById(@PathVariable Long id) {
	        BhilaiStaffArea bhilaiStaffArea = bhilaiStaffAreaService.findById(id);
	        if (bhilaiStaffArea != null) {
	            return new ResponseEntity<>(bhilaiStaffArea, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	        }
	    }

	    @GetMapping("/all")
	    public ResponseEntity<List<BhilaiStaffArea>> getAllAreas() {
	        List<BhilaiStaffArea> allAreas = bhilaiStaffAreaService.allArea();
	        if (allAreas != null && !allAreas.isEmpty()) {
	            return new ResponseEntity<>(allAreas, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	        }
	    }

	    @DeleteMapping("/remove/{areaId}")
	    public ResponseEntity<String> removeArea(@PathVariable Long areaId) {
	        String result = bhilaiStaffAreaService.removeArea(areaId);
	        if (Result.SUCCESS.toString().equals(result)) {
	            return new ResponseEntity<>(result, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }
}
