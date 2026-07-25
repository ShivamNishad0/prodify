package com.hrms.modules.bhilai.payroll.controller;

import com.hrms.modules.bhilai.payroll.modles.BhilaiHoliday;
import com.hrms.modules.bhilai.payroll.service.BhilaiHolidayService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/bhilai/holiday")
public class BhilaiHolidayController {

    @Autowired
    private BhilaiHolidayService bhilaiHolidayService;

    @PostMapping("/create")
    public ResponseEntity<String> createHoliday(@RequestBody BhilaiHoliday bhilaiHoliday) {
        String response = bhilaiHolidayService.createHoliday(bhilaiHoliday);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateHoliday(@PathVariable Long id, @RequestBody BhilaiHoliday bhilaiHoliday) {
        String response = bhilaiHolidayService.updateHoliday(id, bhilaiHoliday);
        return response.equals(Result.SUCCESS.toString()) ? 
               ResponseEntity.ok(response) : 
               ResponseEntity.badRequest().body(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteHoliday(@PathVariable Long id) {
        bhilaiHolidayService.deleteHoliday(id);
        return ResponseEntity.ok().body("DELETED SUCCESSFULLY");
    }

    @GetMapping("/all")
    public ResponseEntity<List<BhilaiHoliday>> getAllHolidays() {
        return ResponseEntity.ok(bhilaiHolidayService.getAllHolidays());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BhilaiHoliday> getHolidayById(@PathVariable Long id) {
        return bhilaiHolidayService.getHolidayById(id)
                .map(bhilaiHoliday -> ResponseEntity.ok(bhilaiHoliday))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
