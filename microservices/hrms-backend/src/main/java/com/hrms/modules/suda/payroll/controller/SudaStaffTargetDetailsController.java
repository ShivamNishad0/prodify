package com.hrms.modules.suda.payroll.controller;

import com.hrms.modules.dtos.NewTargetDTO;
import com.hrms.modules.dtos.TargetRequestDTO;
import com.hrms.modules.dtos.TargetResponseDTO;
import com.hrms.modules.suda.payroll.serviceImpl.SudaStaffTargetDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/suda/targets")
public class SudaStaffTargetDetailsController {
    @Autowired
    private SudaStaffTargetDetailsServiceImpl staffTargetDetailsService;

    @PostMapping("/create")
    public ResponseEntity<String> createTargetDetails(@RequestBody NewTargetDTO data) {
        String response = staffTargetDetailsService.createTargetDetails(data);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-fixed")
    public ResponseEntity<String> createFixedDetails(@RequestBody NewTargetDTO data) {
        String response = staffTargetDetailsService.createFixedDetails(data);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/details")
    public ResponseEntity<TargetResponseDTO> getStaffTargetDetails(
            @RequestParam( value = "areaId", required = false) String[] areaId,
            @RequestParam("month") String month,
            @RequestParam( "year") String year,
            @RequestParam( value = "emp_no")String emp_no,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {

            TargetResponseDTO staffDetailsPage = staffTargetDetailsService.staffStaffDetails( areaId,  month,  year,  emp_no,  page,  size);

            if (staffDetailsPage==null) {
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
