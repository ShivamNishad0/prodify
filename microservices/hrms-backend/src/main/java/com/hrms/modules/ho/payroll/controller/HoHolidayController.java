package com.hrms.modules.ho.payroll.controller;

import com.hrms.modules.ho.payroll.modles.HoHoliday;
import com.hrms.modules.ho.payroll.service.HolidayService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/ho/holiday")
public class HoHolidayController {

    @Autowired
    private HolidayService holidayService;

    @PostMapping("/create")
    public ResponseEntity<String> createHoliday(@RequestBody HoHoliday holiday) {
        String response = holidayService.createHoliday(holiday);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateHoliday(@PathVariable Long id, @RequestBody HoHoliday holiday) {
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
    public ResponseEntity<List<HoHoliday>> getAllHolidays() {
        return ResponseEntity.ok(holidayService.getAllHolidays());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HoHoliday> getHolidayById(@PathVariable Long id) {
        return holidayService.getHolidayById(id)
                .map(holiday -> ResponseEntity.ok(holiday))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
