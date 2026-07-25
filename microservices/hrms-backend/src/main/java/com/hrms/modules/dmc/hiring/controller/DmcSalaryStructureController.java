package com.hrms.modules.dmc.hiring.controller;

import com.hrms.modules.dmc.hiring.models.DmcSalaryStructure;
import com.hrms.modules.dmc.hiring.service.DmcSalaryStructureService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/dmc/salary")
public class DmcSalaryStructureController {

    @Autowired
    private DmcSalaryStructureService salaryService;

    @PostMapping("/new")
    public ResponseEntity<String> newSalaryStructure(@RequestBody DmcSalaryStructure salary) {
        String result = salaryService.newSalaryStructure(salary);
        if (result.equals(Result.SUCCESS.toString())) {
            return ResponseEntity.ok(result);
        } else if (result.equals(Result.ALLREADY_EXISTS.toString())) {
            return new ResponseEntity<>(result, HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PutMapping("/update/{salaryId}")
    public ResponseEntity<String> updateSalary(@PathVariable Long salaryId, @RequestBody DmcSalaryStructure salary) {
        String result = salaryService.updateSalary(salaryId, salary);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/by-staff/{salaryId}")
    public ResponseEntity<DmcSalaryStructure> findByStaffId(@PathVariable Long salaryId) {
        DmcSalaryStructure salary = salaryService.findByStaffId(salaryId);
        return ResponseEntity.ok(salary);
    }

    @GetMapping("/by-staff-data/{staffId}")
    public ResponseEntity<DmcSalaryStructure> findBySatffId(@PathVariable Long staffId) {
        DmcSalaryStructure salary = salaryService.findByStaffId(staffId);
        if (salary != null) {
            return ResponseEntity.ok(salary);
        }
        return new ResponseEntity<>(salary, HttpStatus.NO_CONTENT);
    }

    @GetMapping("/all")
    public ResponseEntity<List<DmcSalaryStructure>> getAllSalary() {
        List<DmcSalaryStructure> salaries = salaryService.getAllSalary();
        return ResponseEntity.ok(salaries);
    }

    @DeleteMapping("/delete/{salaryId}")
    public ResponseEntity<String> deleteSalaryById(@PathVariable Long salaryId) {
        String result = salaryService.deleteSalaryById(salaryId);
        return ResponseEntity.ok(result);
    }

}
