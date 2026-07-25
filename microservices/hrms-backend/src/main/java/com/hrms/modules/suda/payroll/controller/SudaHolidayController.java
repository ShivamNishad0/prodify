package com.hrms.modules.suda.payroll.controller;

import com.hrms.modules.suda.payroll.modles.SudaHoliday;
import com.hrms.modules.suda.payroll.service.SudaHolidayService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/suda/holiday")
public class SudaHolidayController {

    @Autowired
    private SudaHolidayService holidayService;

    @PostMapping("/create")
    public ResponseEntity<String> createHoliday(@RequestBody SudaHoliday holiday) {
        String response = holidayService.createHoliday(holiday);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateHoliday(@PathVariable Long id, @RequestBody SudaHoliday holiday) {
        String response = holidayService.updateHoliday(id, holiday);
        return response.equals(Result.SUCCESS.toString()) ? 
               ResponseEntity.ok(response) : 
               ResponseEntity.badRequest().body(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteHoliday(@PathVariable Long id) {
        holidayService.deleteHoliday(id);
        return ResponseEntity.ok().body("DELETED SUCCESSFULLY");
    }

    @GetMapping("/all")
    public ResponseEntity<List<SudaHoliday>> getAllHolidays() {
        return ResponseEntity.ok(holidayService.getAllHolidays());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SudaHoliday> getHolidayById(@PathVariable Long id) {
        return holidayService.getHolidayById(id)
                .map(holiday -> ResponseEntity.ok(holiday))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
