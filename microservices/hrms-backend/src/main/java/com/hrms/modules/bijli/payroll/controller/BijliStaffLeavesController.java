package com.hrms.modules.bijli.payroll.controller;

import com.hrms.modules.bijli.payroll.modles.BijliStaffLeaves;
import com.hrms.modules.bijli.payroll.service.BijliStaffLeavesService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/bijli/leave")
public class BijliStaffLeavesController {

	@Autowired
	private BijliStaffLeavesService leaveService;

	@PostMapping("/apply")
	public ResponseEntity<String> createLeave(@RequestBody BijliStaffLeaves leave) {
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
	public ResponseEntity<List<BijliStaffLeaves>> getStaffLeaves(@PathVariable Long staffId) {
		List<BijliStaffLeaves> leaves = leaveService.staffLeaves(staffId);
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
