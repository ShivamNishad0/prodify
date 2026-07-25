package com.hrms.modules.rmc.payroll.controller;

import com.hrms.modules.rmc.payroll.modles.RmcHoliday;
import com.hrms.modules.rmc.payroll.service.RmcHolidayService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/rmc/holiday")
public class RmcHolidayController {

    @Autowired
    private RmcHolidayService holidayService;

    @PostMapping("/create")
    public ResponseEntity<String> createHoliday(@RequestBody RmcHoliday holiday) {
        String response = holidayService.createHoliday(holiday);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateHoliday(@PathVariable Long id, @RequestBody RmcHoliday holiday) {
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
    public ResponseEntity<List<RmcHoliday>> getAllHolidays() {
        return ResponseEntity.ok(holidayService.getAllHolidays());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RmcHoliday> getHolidayById(@PathVariable Long id) {
        return holidayService.getHolidayById(id)
                .map(holiday -> ResponseEntity.ok(holiday))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
