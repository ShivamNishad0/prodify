package com.hrms.modules.suda.hiring.controller;

import com.hrms.modules.suda.hiring.models.SudaIDCard;
import com.hrms.modules.suda.hiring.service.SudaIDCardServices;
import com.hrms.modules.utilsServics.IDCardStatusUpdater;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/spshrm/suda/id")
@CrossOrigin
public class SudaIDController {

	@Autowired
	private SudaIDCardServices idService;
	@Autowired
	private IDCardStatusUpdater status;

	@PostMapping("/approveAndGenerateId")
	public ResponseEntity<String> approveAndGenerateId(@RequestParam Long staffId, @RequestParam Long userId) {
		String result = idService.approveAndGenerateId(staffId, userId);
		if (result.equals("SUCCESS")) {
			return ResponseEntity.ok(result);
		} else {
			return ResponseEntity.status(500).body(result);
		}
	}

	@PostMapping("/generateIdOnly/{staffId}/{userId}")
	public ResponseEntity<String> generateIdOnly(@PathVariable String staffId, @PathVariable String userId) {
		String result = idService.generateIdOnly(Long.parseLong(decoder(staffId)), Long.parseLong(decoder(userId)));

		if (Result.SUCCESS.toString().equals(result)) {
			return ResponseEntity.ok(result);
		} else if (Result.INVALID_ACTION.toString().equals(result)) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
		} else if (Result.NOT_FOUND.toString().equals(result)) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
		} else if (Result.ALLREADY_EXISTS.toString().equals(result)) {
			return ResponseEntity.status(HttpStatus.ALREADY_REPORTED).body(result);
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error occurred");
		}
	}

	@GetMapping("/id-active")
	public List<SudaIDCard> getAllActiveCards() {
		return idService.allActiveCards();
	}

	@GetMapping("/emp-idcard/{empNo}")
	public ResponseEntity<?> getIDCardByEmpNo(@PathVariable String empNo) {

		SudaIDCard idCard = idService.findByEmpNo(decoder(empNo));
		if (idCard != null) {
			return new ResponseEntity<>(idCard, HttpStatus.OK);
		} else {
			String result = "NO ACTIVE ID-CARD FOUND";
			return new ResponseEntity<>(result, HttpStatus.NO_CONTENT);
		}
	}

	@GetMapping("/id-inactive")
	public List<SudaIDCard> getAllInActiveCards() {
		return idService.getAllUnActiveIDCard();
	}

	@PostMapping("/increase-count")
	public ResponseEntity<String> increaseCount(@RequestBody List<Long> cardIds) {
		String result = idService.increaseCount(cardIds);
		return result.equals(Result.SUCCESS.toString()) ? ResponseEntity.ok(result)
				: ResponseEntity.internalServerError().build();
	}

	@GetMapping("/update-status")
    public ResponseEntity<?> updateStatusNow() {
		String result = status.updateIDCardStatus();
		if(result=="SUCCESS") {
			return ResponseEntity.ok(result);
		}
		return ResponseEntity.status(500).body("Failed to update ID Card status");
    }
	
	
	@PutMapping("/updateIdDetails/{staffId}/{cardId}")
    public ResponseEntity<String> updateIdDetails(@PathVariable String staffId, @PathVariable String cardId) {
        String result = idService.updateIdDetails(Long.parseLong(decoder(staffId))  , Long.parseLong(decoder(cardId)));
        
        if (result.equals(Result.SUCCESS.toString())) {
            return ResponseEntity.ok(result); 
        }
        if (result.equals(Result.ALLREADY_EXISTS.toString())) {
        	return ResponseEntity.status(209).body(result); 
        }
        else {
            return ResponseEntity.status(500).body(result); 
        }
    }

	
	
	@GetMapping("/emp-idcards/{staffid}")
	public ResponseEntity<?> getIDCardByEmpNo(@PathVariable List<Long> staffid) {

		List<SudaIDCard> idCard = idService.idByStaffsIds(staffid);
		if (idCard != null) {
			return new ResponseEntity<>(idCard, HttpStatus.OK);
		} else {
			String result = "NO ACTIVE ID-CARD FOUND";
			return new ResponseEntity<>(result, HttpStatus.NO_CONTENT);
		}
	}
	
	public String decoder(String content) {
		byte[] decodedBytes = Base64.getDecoder().decode(content);
		return new String(decodedBytes, StandardCharsets.UTF_8);
	}
}
