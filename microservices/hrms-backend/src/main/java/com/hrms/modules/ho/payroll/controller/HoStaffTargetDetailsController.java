package com.hrms.modules.ho.payroll.controller;

import com.hrms.modules.dtos.TargetRequestDTO;
import com.hrms.modules.dtos.TargetResponseDTO;
import com.hrms.modules.ho.payroll.serviceImpl.HoStaffTargetDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/ho/targets")
public class HoStaffTargetDetailsController {
    @Autowired
    private HoStaffTargetDetailsServiceImpl staffTargetDetailsService;

    @PostMapping("/create")
    public ResponseEntity<String> createTargetDetails(@RequestBody TargetRequestDTO data) {
            String response = staffTargetDetailsService.createTargetDetails(data);
            return ResponseEntity.ok(response);

    }

    @GetMapping("/details")
    public ResponseEntity<TargetResponseDTO> getStaffTargetDetails(
            @RequestParam(value = "zoneId") Long zoneId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {

            TargetResponseDTO staffDetailsPage = staffTargetDetailsService.staffStaffDetails(zoneId, page,size);

            if (staffDetailsPage==null) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(staffDetailsPage, HttpStatus.OK);
            }

    }

}
