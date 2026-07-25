package com.hrms.modules.rmc.payroll.controller;


import com.hrms.modules.dtos.TargetRequestDTO;
import com.hrms.modules.dtos.TargetResponseDTO;
import com.hrms.modules.rmc.payroll.service.RmcStaffTargetDetailsService;
import com.hrms.modules.rmc.payroll.serviceImpl.RmcStaffTargetDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/rmc/targets")
public class RmcStaffTargetDetailsController {
    @Autowired
    private RmcStaffTargetDetailsService staffTargetDetailsService;

    @PostMapping("/create")
    public ResponseEntity<String> createTargetDetails(@RequestBody TargetRequestDTO data) {
        String response = staffTargetDetailsService.createTargetDetails(data);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/create-fixed")
    public ResponseEntity<String> createFixedDetails(@RequestBody TargetRequestDTO data) {
        String response = staffTargetDetailsService.createFixedDetails(data);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/details")
    public ResponseEntity<TargetResponseDTO> getStaffTargetDetails(
            @RequestParam( "areaId") String[] areaId,
            @RequestParam(value = "month") String month,
            @RequestParam(value = "year") String year,
            @RequestParam( value = "emp_no" ,required = false)String emp_no,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {

        TargetResponseDTO staffDetailsPage = staffTargetDetailsService.staffStaffDetails( areaId, month, year,emp_no, page, size);

        if (staffDetailsPage == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(staffDetailsPage, HttpStatus.OK);
        }

    }
    @GetMapping("/details-fixed")
    public ResponseEntity<TargetResponseDTO> getStaffFixedDetails(
            @RequestParam( "areaId") String[] areaId,
            @RequestParam("month") String month,
            @RequestParam( "year") String year,
            @RequestParam( value = "emp_no" ,required = false)String emp_no,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {

        TargetResponseDTO staffDetailsPage = staffTargetDetailsService.staffStaffFixedDetails( areaId,  month,  year,  emp_no,  page,  size);

        if (staffDetailsPage==null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(staffDetailsPage, HttpStatus.OK);
        }

    }
}
