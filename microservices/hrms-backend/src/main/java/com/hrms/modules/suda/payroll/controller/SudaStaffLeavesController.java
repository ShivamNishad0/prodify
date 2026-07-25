package com.hrms.modules.suda.payroll.controller;

import com.hrms.modules.suda.payroll.modles.SudaStaffLeaves;
import com.hrms.modules.suda.payroll.service.SudaStaffLeavesService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/suda/leave")
public class SudaStaffLeavesController {

	@Autowired
	private SudaStaffLeavesService leaveService;

	@PostMapping("/apply")
	public ResponseEntity<String> createLeave(@RequestBody SudaStaffLeaves leave) {
		String result = leaveService.createLeave(leave);
		if (result.equals(Result.SUCCESS.toString())) {
			return ResponseEntity.status(HttpStatus.CREATED).body("Leave Applied Successfully.");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create leave.");
		}
	}

	@PostMapping("/action")
	public ResponseEntity<String> actionOnLeave(@RequestParam String action, @RequestParam Long leaveId,
			@RequestParam Long userId) {

		String result = leaveService.actionOnLeave(action, leaveId, userId);
		if (result.equals(Result.SUCCESS.toString())) {
			return ResponseEntity.status(HttpStatus.OK).body("Leave action successful.");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Leave action failed.");
		}
	}

	@GetMapping("/staff/{staffId}")
	public ResponseEntity<List<SudaStaffLeaves>> getStaffLeaves(@PathVariable Long staffId) {
		List<SudaStaffLeaves> leaves = leaveService.staffLeaves(staffId);
		if (leaves != null && !leaves.isEmpty()) {
			return ResponseEntity.status(HttpStatus.OK).body(leaves);
		} else {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		}
	}

	@DeleteMapping("/{leaveId}")
	public ResponseEntity<String> deleteLeave(@PathVariable Long leaveId) {

		String result = leaveService.deleteLeave(leaveId);
		if (result.equals(Result.SUCCESS.toString())) {
			return ResponseEntity.status(HttpStatus.OK).body("Leave deleted successfully.");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Leave deletion failed.");
		}
	}
}
