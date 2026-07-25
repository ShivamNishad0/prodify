package com.hrms.modules.dmc.payroll.controller;

import com.hrms.modules.dmc.payroll.modles.DmcHoliday;
import com.hrms.modules.dmc.payroll.service.DmcHolidayService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/dmc/holiday")
public class DmcHolidayController {

    @Autowired
    private DmcHolidayService holidayService;

    @PostMapping("/create")
    public ResponseEntity<String> createHoliday(@RequestBody DmcHoliday holiday) {
        String response = holidayService.createHoliday(holiday);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateHoliday(@PathVariable Long id, @RequestBody DmcHoliday holiday) {
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
    public ResponseEntity<List<DmcHoliday>> getAllHolidays() {
        return ResponseEntity.ok(holidayService.getAllHolidays());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DmcHoliday> getHolidayById(@PathVariable Long id) {
        return holidayService.getHolidayById(id)
                .map(holiday -> ResponseEntity.ok(holiday))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
