package com.hrms.modules.bhilai.hiring.controller;

import com.hrms.modules.bhilai.hiring.models.BhilaiRemovedStaffs;
import com.hrms.modules.dtos.*;
import com.hrms.modules.bhilai.hiring.service.BhilaiStaffServices;
import com.hrms.modules.utilsServics.Actions;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/spshrm/bhilai/staff")
@CrossOrigin
public class BhilaiStaffController {

	@Autowired
	private BhilaiStaffServices staffService;

//	@PostMapping("/new-staff")
//	public ResponseEntity<?> addStaff(@RequestBody NewStaffDTO newStaff) {
//		String result = staffService.saveStaffDetails(Actions.CREATE_NEW, null, newStaff);
//
//		if (result.contains("staffId")) {
//			return ResponseEntity.ok().body(result);
//		}
//		if (result.equals(Result.ALLREADY_EXISTS.toString())) {
//			return ResponseEntity.status(HttpStatus.CONFLICT).body("USER ALREADY EXISTS");
//		}
//		if (result.equals(Result.WENT_WRONG.toString())) {
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create new staff.");
//		}
//		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request.");
//	}
//
//	@PostMapping("/change-in/{staffId}")
//	public ResponseEntity<?> editStaff(@PathVariable String staffId, @RequestBody NewStaffDTO newStaff) {
//		String result = staffService.saveStaffDetails(Actions.EDIT_OLD, Long.parseLong(decoder(staffId)), newStaff);
//
//		if (result.equals(Result.WENT_WRONG.toString())) {
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create new staff.");
//		}
//		if (result.contains("staffId")) {
//			return ResponseEntity.ok(result);
//		}
//		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request.");
//	}

	@PostMapping("/new-staff")
	public ResponseEntity<?> addStaff(@RequestBody NewStaffDTO newStaff) {
		String result = staffService.saveStaffDetails(Actions.CREATE_NEW, null, newStaff);

		if (result.contains("staffId")) {
			return ResponseEntity.ok().body(result);
		}
		if (result.equals(Result.CONTACT_NO_ALREADY_EXIST.toString()) || result.equals(Result.EMP_NO_ALREADY_EXIST.toString())) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(result);
		}
		if (result.equals(Result.WENT_WRONG.toString())) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create new staff.");
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request.");
	}

	@PostMapping("/change-in/{staffId}")
	public ResponseEntity<?> editStaff(@PathVariable String staffId, @RequestBody NewStaffDTO newStaff) {
		String result = staffService.saveStaffDetails(Actions.EDIT_OLD, Long.parseLong(decoder(staffId)), newStaff);

		if (result.equals(Result.WENT_WRONG.toString())
				|| result.equals(Result.EMP_NO_UPDATE_FAILED.toString())
				|| result.equals(Result.ACCOUNT_NO_ALREADY_EXIST.toString())
				|| result.equals(Result.TEMP_EMP_ALREADY_EXIST.toString())) {

			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
		}
		if (result.contains("staffId")) {
			return ResponseEntity.ok(result);
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request.");
	}

	@PostMapping("/charater-verify/{staffId}")
	public ResponseEntity<?> verifyCharacter(@PathVariable String staffId) {
		Long id = Long.parseLong(decoder(staffId));
		return ResponseEntity.ok(staffService.verifyCharacter(id));
	}

//	@GetMapping("/staff-list/all")
//	public ResponseEntity<?> getAllStaff(@RequestParam(defaultValue = "0") int page,
//			@RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id,asc") String[] sort) {
//
//		Pageable pageable = PageRequest.of(page, size);
//		List<ResponseStaffDTO> staffList = staffService.allStaffs(pageable);
//		return ResponseEntity.ok(staffList);
//	}

	@GetMapping("/staff-list/all")
	public ResponseEntity<?> getAllStaff(
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
		List<ResponseStaffDTO> staffList = staffService.allStaffsByZone(size, page);
		return ResponseEntity.ok(staffList);
	}

	@GetMapping("/staff-list-area/all")
	public ResponseEntity<?> getAllStaffBySubDivision(
			@RequestParam("areaId") String areaId,@RequestParam("type") String type, @RequestParam String verified, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size) {
		GetStaffAndStaffCountDTO staffs = staffService.allStaffsByZoneAndAreaSubDivision(size, page, areaId, type, verified);
		if (staffs != null) {

			return ResponseEntity.ok(staffs);
		}
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@GetMapping("/temp-api/all")
	public ResponseEntity<List<ResponseStaffDTO>> getAllStaff() {
		try {
			List<ResponseStaffDTO> staffList = staffService.tempForGetAllStaff();
			if (staffList.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(staffList, HttpStatus.OK);
		} catch (Exception e) {
			// Log the exception
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/{staffId}")
	public ResponseEntity<?> getStaff(@PathVariable String staffId) {
		Long id = Long.parseLong(decoder(staffId));
		ResponseStaffDTO staffList = staffService.staffByID(id);
		return ResponseEntity.ok(staffList);
	}

	@GetMapping("/unverified/staff-list")
	public ResponseEntity<?> getStaffByUnVerifiedStatus() {
		List<ResponseStaffDTO> staffList = staffService.staffByVerifiedStatus();
		return ResponseEntity.ok(staffList);
	}

	@GetMapping("/verified/staff-list")
	public ResponseEntity<?> getStaffByVerifiedStatus() {
		List<ResponseStaffDTO> staffList = staffService.staffVerifiedStatus();
		return ResponseEntity.ok(staffList);
	}

	@PostMapping("/generateOfferLetter/{staffId}/{userId}")
	public ResponseEntity<String> generateOfferLetter(@PathVariable String staffId, @PathVariable String userId) {
		String result = staffService.generateOfferLetter(Long.parseLong(decoder(staffId)),
				Long.parseLong(decoder(userId)));
		if (Result.SUCCESS.toString().equals(result)) {
			return ResponseEntity.ok(result);
		} else if (Result.INVALID_ACTION.toString().equals(result)) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error occurred");
		}
	}

	@PostMapping("/approve-candidate/{staffId}/{userId}")
	public ResponseEntity<String> approveCandidate(@PathVariable String staffId, @PathVariable String userId) {
		String result = staffService.approveCandidate(Long.parseLong(decoder(staffId)),
				Long.parseLong(decoder(userId)));
		if (Result.SUCCESS.toString().equals(result)) {
			return ResponseEntity.ok(result);
		} else if (Result.INVALID_ACTION.toString().equals(result)) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error occurred");
		}
	}

	@PostMapping("/reject-candidate/{staffId}/{userId}")
	public ResponseEntity<String> rejectCandidate(@PathVariable String staffId, @PathVariable String userId) {
		String result = staffService.rejectCandidate(Long.parseLong(decoder(staffId)), Long.parseLong(decoder(userId)));
		if (Result.SUCCESS.toString().equals(result)) {
			return ResponseEntity.ok(result);
		} else if (Result.INVALID_ACTION.toString().equals(result)) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error occurred");
		}
	}

	@PostMapping("/upload/file")
	public ResponseEntity<String> uploadFile(@RequestParam("empNo") String empNo, @RequestParam("fileOf") String fileOf,
			@RequestParam("file") MultipartFile file) {
		try {
			String fileName = staffService.fileUpload(empNo, fileOf, file);
			if ("WENT_WRONG".equals(fileName)) {
				return new ResponseEntity<>("File upload failed: Document already exists or invalid type.",
						HttpStatus.BAD_REQUEST);
			} else if (Result.WENT_WRONG.toString().equals(fileName)) {
				return new ResponseEntity<>("File upload failed: Something went wrong.",
						HttpStatus.INTERNAL_SERVER_ERROR);
			} else {
				return new ResponseEntity<>(fileName, HttpStatus.OK);
			}
		} catch (Exception e) {
			return new ResponseEntity<>("File upload failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/remove/staff")
	public ResponseEntity<String> deleteStaff(@RequestBody RemoveStaffDTO data) {
		String result = staffService.deleteStaff(data);
		if(result.equals("SUCCESS")){
			return new ResponseEntity<>(result, HttpStatus.OK);
		} else if (result.equals("ALREADY_DISABLED")) {
			return new ResponseEntity<>(result, HttpStatus.CONFLICT);
		}
		return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@GetMapping("/search/staff")
    public ResponseEntity<?> getStaffByTempEmp(@RequestParam String tempEmp,@RequestParam String type, @RequestParam String verified ) {
         GetStaffAndStaffCountDTO staffList = staffService.findByTempEmp(tempEmp,type, verified);
        if (staffList==null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(staffList, HttpStatus.OK);
    }

	@GetMapping("/all/deactivated-staff")
	public ResponseEntity<?> getAllDeactivatedStaff(@RequestParam(defaultValue = "0") int page,
													@RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id,asc") String[] sort) {
		Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.by(sort[0])));
		CountAndStaffDetails result = staffService.findAllDeactivatedEmp(pageable);
		return ResponseEntity.ok(result);
	}


	@GetMapping("/deactivated-details/staff")
	public ResponseEntity<?> getdeactivatedStaffByEmpNo(@RequestParam String empNo) {
		BhilaiRemovedStaffs details = staffService.deactivationDetails(empNo);
		if (details==null) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<>(details, HttpStatus.OK);
	}

	public String decoder(String content) {
		byte[] decodedBytes = Base64.getDecoder().decode(content);
		return new String(decodedBytes, StandardCharsets.UTF_8);
	}
}
