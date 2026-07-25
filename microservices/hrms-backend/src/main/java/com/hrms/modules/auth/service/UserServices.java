package com.hrms.modules.auth.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.hrms.modules.auth.models.Users;
import com.hrms.modules.auth.security.UserRequestDTO;

public interface UserServices {
	public String addNewUser(UserRequestDTO userRequestDto) throws Exception;
	
	public String addOrUpdateUserImg(MultipartFile file,Long userId);
	
	public String editUser(UserRequestDTO userRequestDto, Long userId);
	
	public List<Users> allUser();
	
	public Users userById(Long userId);
}
