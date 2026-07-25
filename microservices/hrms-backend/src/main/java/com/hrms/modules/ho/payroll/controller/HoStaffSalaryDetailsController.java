package com.hrms.modules.ho.payroll.controller;

import com.hrms.modules.dtos.*;
import com.hrms.modules.ho.payroll.modles.HoStaffSalaryDetails;
import com.hrms.modules.ho.payroll.service.HoStaffSalaryDetailsService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/ho/payroll")
public class HoStaffSalaryDetailsController {
    @Autowired
    private HoStaffSalaryDetailsService salaryService;

    @PutMapping("/details/{sslId}")
    public ResponseEntity<String> editSalaryDetails(@PathVariable Long sslId,
                                                    @RequestBody SalaryDetails_EDIT_DTO details, @RequestParam Long editedBy) {
        String result = salaryService.editSalaryDetails(sslId, details, editedBy);
        if (Result.SUCCESS.toString().equals(result)) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/details")
    public ResponseEntity<HoStaffSalaryDetails> findSalaryDetails(@RequestParam Long staffId, @RequestParam String month,
                                                                  @RequestParam String year) {
        HoStaffSalaryDetails foundSalary = salaryService.findSalaryDetails(staffId, month, year);
        if (foundSalary != null) {
            return new ResponseEntity<>(foundSalary, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifySalary(
            @RequestBody Map<String, List<Long>> requestBody,
            @RequestParam Long userId) {

        // Extract salaryDetId from the requestBody
        List<Long> salaryDetId = requestBody.get("salaryDetId");

        // Call the service method
        String result = salaryService.verifySalary(salaryDetId, userId);

        // Return success response
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/all-salary-list")
    public ResponseEntity<CountAndSalaryDetailsByZone> getAllSalaries(
            @RequestParam Long zoneId,
            @RequestParam("month") String month,
            @RequestParam("year") String year,
            @RequestParam("type") String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        CountAndSalaryDetailsByZone result = salaryService.allSalariesList(zoneId, month, year, type, page, size);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/target/all-salary-list")
    public ResponseEntity<CountAndSalaryDetailsByZone> getAllSalariesForTarget(
            @RequestParam Long zoneId,
            @RequestParam("month") String month,
            @RequestParam("year") String year,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        CountAndSalaryDetailsByZone result = salaryService.allSalariesListForTargetBased(zoneId, month, year, page, size);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/search-details")
    public ResponseEntity<CountAndSalaryDetailsByZone> getStaffDetails(@RequestParam("emp_no") String emp_no,
                                                                       @RequestParam("month") String month,
                                                                       @RequestParam("year") String year,
                                                                       @RequestParam("type") String type
    ) {
        CountAndSalaryDetailsByZone details = salaryService.findByStaffEmpNo(emp_no, month, year,type);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/update-salary-details")
    public ResponseEntity<?> updateStaffSalary(
            @RequestParam("month") String month,
            @RequestParam("year") String year
    ) {
        String details = salaryService.updateAllSalary(month, year);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/emp-adv-details")
    public ResponseEntity<StaffAdvanceInfoDTO> getStaffDetails(@RequestParam("emp_no") String emp_no

    ) {
        StaffAdvanceInfoDTO details = salaryService.findAdvDetailsOfEmp(emp_no);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/emp-prev-details")
    public ResponseEntity<?> getStaffPrevDetails(
            @RequestParam("emp_no") String emp_no,
            @RequestParam("month") String month
            , @RequestParam("year") String year

    ) {
        HoStaffSalaryDetails details = salaryService.findPrevAmt(emp_no, month, year);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/emp-salary-details")
    public ResponseEntity<List<?>> getStaffDetails(
            @RequestParam("month") String month,
            @RequestParam("year") String year, @RequestParam("type") String type,
            @RequestParam("zoneId") Long zoneId) {

        List<SalaryReportDTO> details = salaryService.getAllSalaryByDetails(month, zoneId, year,type);

        return ResponseEntity.ok(details);
    }

    @PostMapping("/emp-adv-details")
    public ResponseEntity<?> makeStaffAdvDetails(@RequestBody AdvancePaymentDTO data, @RequestParam("type") String type) {
        String result = salaryService.createAdvPaymentOfStaff(data, type);
        if (result.equals(Result.SUCCESS.toString())) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }

    @GetMapping("/emp-annual-details")
    public ResponseEntity<?> getAnnualSalary(@RequestParam("empNo") String empNo,
                                             @RequestParam("zoneId") Long zoneId,
                                             @RequestParam("year") String year) {
        List<HoStaffSalaryDetails> result = salaryService.getAnualResultOfEmp(empNo, zoneId, year);
        if (result == null || result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No data available for the given employee number and year.");
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/emp-annual-distribuction")
    public ResponseEntity<?> getAnnualDistributionSalary(@RequestParam("month") String month,
                                                         @RequestParam("year") String year,
                                                         @RequestParam("type") String type) {
        SumOfDistributionDTO result = salaryService.findTotalMoneyDistribution(month, year, type);
        if (result == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No data available for the given instruction");
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/removed-salary/all")
    public ResponseEntity<CountAndSalaryDetailsByZone> getRemovedStaffSalary(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        CountAndSalaryDetailsByZone result = salaryService.allRemovedStaffSalary(page, size);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/removed-salary")
    public ResponseEntity<CountAndSalaryDetailsByZone> getRemovedStaffSalary(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam("empNo") String empNo
    ) {

        CountAndSalaryDetailsByZone result = salaryService.removedStaffSalary(page, size, empNo);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/deduction-salary")
    public ResponseEntity<?> getDeductionStaffSalary(
            @RequestParam("month") String month,
            @RequestParam("year") String year,
            @RequestParam("type") String type,
            @RequestParam(value = "isReport",required = false)boolean isReport,
            @RequestParam(required = false, defaultValue = "1") int pageNumber,
            @RequestParam(required = false, defaultValue = "20") int pageSize
    ) {

        CountAndDetails result = salaryService.getSumOf(month, year, type,isReport, pageNumber, pageSize);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/deduction-salary-individual")
    public ResponseEntity<?> getDeductionStaffSalaryIndividual(
            @RequestParam("month") String month,
            @RequestParam("year") String year,
            @RequestParam("type") String type,
            @RequestParam("empNo") String empNo,
            @RequestParam(required = false, defaultValue = "1") int pageNumber,
            @RequestParam(required = false, defaultValue = "20") int pageSize
    ) {

        CountAndDetails result = salaryService.getSumOfIndividual(empNo, month, year, type, pageNumber, pageSize);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/emp-deduction")
    public ResponseEntity<?> makeStaffAdvDetails(@RequestBody DeductionReqDTO data) {
        String result = salaryService.createDeduction(data);
        if (result.equals(Result.SUCCESS.toString())) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }

    @GetMapping("/salary-on-type")
    public  ResponseEntity<CountAndSalaryDetailsByZone> getDataOnBasicOfAdvAndDeduction(@RequestParam("month")String month,
                                                                                        @RequestParam("year") String year,
                                                                                        @RequestParam("type") String type,
                                                                                        @RequestParam(defaultValue = "0") int page,
                                                                                        @RequestParam(defaultValue = "20") int size
    ){
        CountAndSalaryDetailsByZone result = salaryService.getDataAsPerMonthAndYear(type,month,year,page,size);
        if(result!=null){
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/hold-action")
    public ResponseEntity<?> holdAction(
            @RequestParam("month")String month,
            @RequestParam("year")String year,
            @RequestParam("type")String type,
            @RequestParam("empNo")String empNo
    ) {

        String result = salaryService.salaryOnHold(empNo,month,year,type);
        if (result.equals(Result.SALARY_UPDATED.toString())){
            return ResponseEntity.ok(result);
        } else if (result.equals( Result.NOT_FOUND.name())) {
            return ResponseEntity.status(204).body(result);
        }
        return ResponseEntity.internalServerError().body(result);

    }

    @DeleteMapping("/remove")
    public ResponseEntity<String> removeSalaryDetails(
            @RequestParam String month,
            @RequestParam String year,
            @RequestParam String empNo) {
        try {
            String message = salaryService.removeSalaryDetails(month, year, empNo);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to remove salary details: " + e.getMessage());
        }
    }

}
