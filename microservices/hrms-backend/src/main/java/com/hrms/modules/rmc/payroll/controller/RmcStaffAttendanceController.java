package com.hrms.modules.rmc.payroll.controller;

import com.hrms.modules.dtos.AttendanceDTO;
import com.hrms.modules.dtos.CountAndStaffDetails;
import com.hrms.modules.dtos.StaffAttendanceDTO;
import com.hrms.modules.rmc.payroll.modles.RmcAttendanceDeatils;
import com.hrms.modules.rmc.payroll.modles.RmcStaffAttendance;
import com.hrms.modules.rmc.payroll.service.RmcAttendanceDeatilsService;
import com.hrms.modules.rmc.payroll.service.RmcStaffAttendanceService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/rmc/attendance")
public class RmcStaffAttendanceController {
	@Autowired
	private RmcStaffAttendanceService attendanceService;

	@Autowired
	private RmcAttendanceDeatilsService attendaceDetails;

	@PostMapping("/add")
	public ResponseEntity<?> addAttendance(@RequestBody List<StaffAttendanceDTO> attendanceList) {
		String result = attendanceService.staffNewAddtendance(attendanceList);
		if (!result.isEmpty()) {
			if (result.contains("EmpNo=")) {
				// Split the result to get individual messages
				String[] messages = Arrays.stream(result.split(", ")).map(s -> s.replace("EmpNo=", ""))
						.toArray(String[]::new);
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(messages);
			} else if (Result.SUCCESS.toString().equals(result)) {
				return ResponseEntity.status(HttpStatus.CREATED).body("Attendance added successfully.");
			}else if (Result.INVALID_EMP.toString().equals(result)) {
					return ResponseEntity.status(HttpStatus.FORBIDDEN).body("INVAILD EMPLOYEE");
			} else {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
			}
		} else {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No employees provided in the request.");
		}
	}

	@GetMapping("/employee/{empNo}")
	public ResponseEntity<RmcStaffAttendance> getAttendanceByEmpNo(@PathVariable String empNo, @RequestParam String month, @RequestParam int year) {
		RmcStaffAttendance attendance = attendanceService.findByempNo(empNo,month,year);
		if (attendance != null) {
			return new ResponseEntity<>(attendance, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
	}

	@PutMapping("/edit/{attendanceId}")
	public ResponseEntity<String> editAttendance(@PathVariable Long attendanceId,
			@RequestBody AttendanceDTO editedAttendance) {
		String result = attendanceService.editAttendace(attendanceId, editedAttendance);
		if (Result.SUCCESS.toString().equals(result)) {
			return new ResponseEntity<>(result, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/delete/{attendanceId}")
	public ResponseEntity<String> deleteAttendance(@PathVariable Long attendanceId) {
		String result = attendanceService.deleteStaffAttendance(attendanceId);
		if (Result.SUCCESS.toString().equals(result)) {
			return new ResponseEntity<>(result, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/details/{empNo}/{year}")
	public ResponseEntity<?> getAttendanceDetailsByEmpNo(@PathVariable String empNo,@PathVariable String year) {
		List<RmcAttendanceDeatils> details = attendaceDetails.findAttendanceDetailsByEnpNo(empNo,year);
		if (details != null) {
			return new ResponseEntity<>(details, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
	}
	
	@GetMapping("/details-all")
    public ResponseEntity<CountAndStaffDetails> getDetailsOfStudent(
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam String month,
            @RequestParam String year) {
		CountAndStaffDetails data = attendaceDetails.getDetailsOfStudent(size, page, month, year);
        if(data!=null) {
        	
        	return ResponseEntity.ok(data);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
