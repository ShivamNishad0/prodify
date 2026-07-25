package com.hrms.modules.dmc.payroll.controller;


import com.hrms.modules.dmc.payroll.modles.DmcStaffSalaryDetails;
import com.hrms.modules.dmc.payroll.service.DmcStaffSalaryDetailsService;
import com.hrms.modules.dtos.*;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/dmc/payroll")
public class DmcStaffSalaryDetailsController {
	@Autowired
	private DmcStaffSalaryDetailsService salaryService;

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
	public ResponseEntity<DmcStaffSalaryDetails> findSalaryDetails(@RequestParam Long staffId, @RequestParam String month,
																   @RequestParam String year) {
		DmcStaffSalaryDetails foundSalary = salaryService.findSalaryDetails(staffId, month, year);
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
	        @RequestParam("month")String month,
	        @RequestParam("year")String year,
	        @RequestParam(defaultValue = "0") int page,
	        @RequestParam(defaultValue = "20") int size) {
	    CountAndSalaryDetailsByZone result = salaryService.allSalariesList(zoneId,month,year, page, size);
	    return new ResponseEntity<>(result, HttpStatus.OK);
	}

	@GetMapping("/target/all-salary-list")
	public ResponseEntity<CountAndSalaryDetailsByZone> getAllSalariesForTarget(
			@RequestParam Long zoneId,
			@RequestParam("month")String month,
			@RequestParam("year")String year,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size) {
		CountAndSalaryDetailsByZone result = salaryService.allSalariesListForTargetBased(zoneId,month,year, page, size);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	@GetMapping("/search-details")
    public ResponseEntity<CountAndSalaryDetailsByZone> getStaffDetails(@RequestParam("emp_no") String emp_no,
                                                                       @RequestParam("month") String month,
                                                                       @RequestParam("year") String year,
																	   @RequestParam("type") String type
	) {
        CountAndSalaryDetailsByZone details = salaryService.findByStaffEmpNo(emp_no,month,year,type);
        return ResponseEntity.ok(details);
    }
	
	@GetMapping("/emp-adv-details")
    public ResponseEntity<StaffAdvanceInfoDTO> getStaffDetails(@RequestParam("emp_no") String emp_no,
															   @RequestParam("zone_id") Long zone_id
    		) {
		StaffAdvanceInfoDTO details = salaryService.findAdvDetailsOfEmp(emp_no,zone_id);
        return ResponseEntity.ok(details);
    }
	
	@GetMapping("/emp-salary-details")
	public ResponseEntity<List<?>> getStaffDetails(
	        @RequestParam("month") String month,
	        @RequestParam("year") String year,
	        @RequestParam("zoneId") Long zoneId) {

	    List<SalaryReportDTO> details = salaryService.getAllSalaryByDetails(month, zoneId, year);

	    return ResponseEntity.ok(details);
	}

	@PostMapping("/emp-adv-details")
	public  ResponseEntity<?> makeStaffAdvDetails(@RequestBody AdvancePaymentDTO data, @RequestParam("type")String type){
		String result = salaryService.createAdvPaymentOfStaff(data,type);
		if(result.equals(Result.SUCCESS.toString())){
			return ResponseEntity.ok(result);
		}
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
	}

	@GetMapping("/emp-annual-details")
	public  ResponseEntity<?> getAnnualSalary(@RequestParam("empNo")String empNo,
											  @RequestParam("zoneId")Long zoneId,
											  @RequestParam("year")String year){
		List<DmcStaffSalaryDetails> result = salaryService.getAnualResultOfEmp(empNo,zoneId,year);
		if (result == null || result.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No data available for the given employee number and year.");
		}

		return ResponseEntity.ok(result);
	}

	@GetMapping("/emp-annual-distribuction")
	public  ResponseEntity<?> getAnnualDistributionSalary(@RequestParam("month")String month,
														  @RequestParam("year")String year,
														  @RequestParam("type")String type){
		SumOfDistributionDTO result = salaryService.findTotalMoneyDistribution(month,year,type);
		if (result == null ) {
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
			@RequestParam("empNo")String empNo
	) {

		CountAndSalaryDetailsByZone result = salaryService.removedStaffSalary(page, size,empNo);
		return ResponseEntity.ok(result);
	}

	@GetMapping("/deduction-salary")
	public ResponseEntity<?> getDeductionStaffSalary(
			@RequestParam("month")String month,
			@RequestParam("year")String year,
			@RequestParam("type")String type,
			@RequestParam(required = false, defaultValue = "1") int pageNumber,
			@RequestParam(required = false, defaultValue = "20") int pageSize
	) {

		CountAndDetails result = salaryService.getSumOf(month,year,type,pageNumber,pageSize);
		return ResponseEntity.ok(result);
	}

	@GetMapping("/deduction-salary-individual")
	public ResponseEntity<?> getDeductionStaffSalaryIndividual(
			@RequestParam("month")String month,
			@RequestParam("year")String year,
			@RequestParam("type")String type,
			@RequestParam("empNo")String empNo,
			@RequestParam(required = false, defaultValue = "1") int pageNumber,
			@RequestParam(required = false, defaultValue = "20") int pageSize
	) {

		CountAndDetails result = salaryService.getSumOfIndividual(empNo,month,year,type,pageNumber,pageSize);
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

	@GetMapping("/complete/emp-salary-details")
	public ResponseEntity<CountAndSalaryDetailsByZone> allSalariesListForComplete(
			@RequestParam("month")String month,
			@RequestParam("year")String year,
			@RequestParam("area_id")String[] area_id
	) {
		CountAndSalaryDetailsByZone result = salaryService.allSalariesListForComplete(month,year,area_id);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	@GetMapping("/group/all-salary-list")
	public ResponseEntity<CountAndSalaryDetailsByZone> allSalariesListForAll(
			@RequestParam Long zoneId,
			@RequestParam("month")String month,
			@RequestParam("year")String year,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam("area_id")String[] area_id,
			@RequestParam(defaultValue = "20") int size) {
		CountAndSalaryDetailsByZone result = salaryService.allSalariesListForAll(zoneId,month,year,area_id, page, size);
		return new ResponseEntity<>(result, HttpStatus.OK);
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

	@GetMapping("/emp-prev-details")
	public ResponseEntity<?> getStaffPrevDetails(
			@RequestParam("emp_no") String emp_no,
			@RequestParam("month") String month
			, @RequestParam("year") String year

	) {
		DmcStaffSalaryDetails details = salaryService.findPrevAmt(emp_no, month, year);
		return ResponseEntity.ok(details);
	}
}
