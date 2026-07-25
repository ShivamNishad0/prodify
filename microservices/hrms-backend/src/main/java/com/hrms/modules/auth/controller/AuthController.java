package com.hrms.modules.auth.controller;

import lombok.AllArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hrms.modules.auth.security.AuthService;
import com.hrms.modules.auth.security.JwtAuthResponse;
import com.hrms.modules.auth.security.LoginDto;
import com.hrms.modules.auth.security.UserRequestDTO;

@AllArgsConstructor
@RestController
@CrossOrigin
@RequestMapping("/api/v1/auth")
public class AuthController {

	@Autowired
	private AuthService authService;
	
//	@Autowired
//	private StaffAndAreaService area;

	// Build Login REST API
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
		JwtAuthResponse response = authService.login(loginDto);
		if (response != null) {
			return new ResponseEntity<>(response, HttpStatus.OK);
		} else {
			return new ResponseEntity<>("Invalid Crendentals ..... ", HttpStatus.UNAUTHORIZED);
		}

	}

	// Building Post API
	@PostMapping("/signup")
	public ResponseEntity<?> signup(@RequestBody UserRequestDTO userRequestdto) {
		String successMessage = "";
		try {
			successMessage = authService.save(userRequestdto);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return new ResponseEntity<>(successMessage, HttpStatus.OK);

	}
	
	
//	@GetMapping("/copyData")
//	public ResponseEntity<?> copyData() {
//		String successMessage = area.copyStaff();
//		return new ResponseEntity<>(successMessage, HttpStatus.OK);
//
//	}

}
