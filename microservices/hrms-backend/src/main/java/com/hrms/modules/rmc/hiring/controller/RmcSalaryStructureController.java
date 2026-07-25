package com.hrms.modules.rmc.hiring.controller;

import com.hrms.modules.dtos.CountAndDetails;
import com.hrms.modules.rmc.hiring.models.RmcSalaryStructure;
import com.hrms.modules.rmc.hiring.service.RmcSalaryStructureService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/rmc/salary")
public class RmcSalaryStructureController {

    @Autowired
    private RmcSalaryStructureService salaryService;

    @PostMapping("/new")
    public ResponseEntity<String> newSalaryStructure(@RequestBody RmcSalaryStructure salary) {
        String result = salaryService.newSalaryStructure(salary);
        if (result.equals(Result.SUCCESS.toString())) {
            return ResponseEntity.ok(result);
        } else if (result.equals(Result.ALLREADY_EXISTS.toString())) {
            return new ResponseEntity<>(result, HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PutMapping("/update/{salaryId}")
    public ResponseEntity<String> updateSalary(@PathVariable Long salaryId, @RequestBody RmcSalaryStructure salary) {
        String result = salaryService.updateSalary(salaryId, salary);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/by-staff/{salaryId}")
    public ResponseEntity<RmcSalaryStructure> findByStaffId(@PathVariable Long salaryId) {
        RmcSalaryStructure salary = salaryService.findByStaffId(salaryId);
        return ResponseEntity.ok(salary);
    }

    @GetMapping("/by-staff-data/{staffId}")
    public ResponseEntity<RmcSalaryStructure> findBySatffId(@PathVariable Long staffId) {
        RmcSalaryStructure salary = salaryService.findByStaffId(staffId);
        if (salary != null) {
            return ResponseEntity.ok(salary);
        }
        return new ResponseEntity<>(salary, HttpStatus.NO_CONTENT);
    }

    @GetMapping("/all")
    public ResponseEntity<List<RmcSalaryStructure>> getAllSalary() {
        List<RmcSalaryStructure> salaries = salaryService.getAllSalary();
        return ResponseEntity.ok(salaries);
    }

    @GetMapping("/all-result/{searchTerm}")
    public ResponseEntity<?> getAllSalary(@PathVariable("searchTerm") String searchTerm) {
        CountAndDetails salaries = salaryService.searchSalaryStructure(searchTerm);
        return ResponseEntity.ok(salaries);
    }

    @DeleteMapping("/delete/{salaryId}")
    public ResponseEntity<String> deleteSalaryById(@PathVariable Long salaryId) {
        String result = salaryService.deleteSalaryById(salaryId);
        return ResponseEntity.ok(result);
    }

}
