package com.hrms.modules.auth.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hrms.modules.auth.models.Users;
import com.hrms.modules.auth.security.UserRequestDTO;
import com.hrms.modules.auth.service.UserServices;
import com.hrms.modules.utilsServics.Result;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@CrossOrigin
@RequestMapping("/api/v1/user")
public class UserController {

	@Autowired
	private UserServices userService;

	@PostMapping("/add-new")
	public ResponseEntity<?> newUser(@RequestBody UserRequestDTO userRequestDto) {
	    try {
	        String successMessage = userService.addNewUser(userRequestDto);
	        
	        if (successMessage.equals(Result.SUCCESS.toString())) {
	            return ResponseEntity.ok(successMessage);
	        } else {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(successMessage);
	        }
	    } catch (Exception e) {
	        e.printStackTrace(); 
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());            
	    }
	}


	@PostMapping("/{userId}/uploadImage")
	public ResponseEntity<String> addOrUpdateUserImg(@PathVariable Long userId,
			@RequestParam("file") MultipartFile file) {
		try {
			String userImg = userService.addOrUpdateUserImg(file, userId);
			if (userImg.equals(Result.WENT_WRONG.toString())) {
				return new ResponseEntity<>("Failed to update user image.", HttpStatus.INTERNAL_SERVER_ERROR);
			}
			return new ResponseEntity<>(userImg, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/{userId}/user")
	public ResponseEntity<?> editUser(@RequestBody UserRequestDTO userRequestdto, @PathVariable Long userId) {
		String successMessage = "";
		try {
			successMessage = userService.editUser(userRequestdto, userId);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<>(successMessage, HttpStatus.OK);

	}

	@GetMapping("/all-user")
	public ResponseEntity<List<Users>> getAllUsers() {
		List<Users> allUsers = userService.allUser();
		if (allUsers != null && !allUsers.isEmpty()) {
			return new ResponseEntity<>(allUsers, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
	}

	@GetMapping("/{userId}")
	public ResponseEntity<Users> getUserById(@PathVariable Long userId) {
		Users user = userService.userById(userId);
		if (user != null) {
			return new ResponseEntity<>(user, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

}
