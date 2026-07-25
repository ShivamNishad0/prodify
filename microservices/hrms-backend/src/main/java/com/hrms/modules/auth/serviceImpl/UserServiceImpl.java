package com.hrms.modules.auth.serviceImpl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hrms.modules.auth.models.Role;
import com.hrms.modules.auth.models.Users;
import com.hrms.modules.auth.repositories.RoleRepository;
import com.hrms.modules.auth.repositories.UserRepository;
import com.hrms.modules.auth.security.UserRequestDTO;
import com.hrms.modules.auth.service.UserServices;
import com.hrms.modules.utilsServics.ImageToLocalStorage;
import com.hrms.modules.utilsServics.Result;

@Service
public class UserServiceImpl implements UserServices{

    @Autowired
    private UserRepository userRepository;
    
    @Autowired 
    private RoleRepository roleDao;
    
    @Autowired
    private PasswordEncoder bCryptPasswordEncoder;
    
	@Autowired
	private ImageToLocalStorage fileService;
	
	@Override
	public String addNewUser(UserRequestDTO userRequestDto) throws Exception {
		
		if(userRequestDto.getEmail()==null || userRequestDto.getName()==null || userRequestDto.getPassword()==null ||userRequestDto.getMobile()==null)
		{
			throw new Exception("No_Records_Found");
		}
		Users savedUser =null;
		Users foundUser =userRepository.findByEmail(userRequestDto.getEmail());
		if(foundUser==null) {
			Role setRole = roleDao.findByName(userRequestDto.getRoleName());
			Users user = new Users();
			user.setEmail(userRequestDto.getEmail());
			user.setName(userRequestDto.getName());
			user.setZoneId(userRequestDto.getZoneId());
			user.setMobile(userRequestDto.getMobile());
			user.setPassword(bCryptPasswordEncoder.encode(userRequestDto.getPassword()));
			user.setUsername(userRequestDto.getName());
			Set<Role> roles =new HashSet<>();
			roles.add(setRole);
			user.setRoles(roles);
			
			
			savedUser= userRepository.save(user);
		}
	
		
		
		return savedUser!=null?Result.SUCCESS.toString():Result.ALLREADY_EXISTS.toString();
	}
	
	@Override
	public String addOrUpdateUserImg(MultipartFile file,Long userId) {
		Users foundUser = userRepository.findById(userId).get();
		if(foundUser!=null) {
			UUID uuid = UUID.randomUUID();
			foundUser.setUserImg(fileService.saveImage(file, uuid.toString(),"USER_IMG"));
			userRepository.save(foundUser);
			return foundUser.getUserImg();
		}
		return Result.WENT_WRONG.toString();
	}
	
	
	@Override
	public String editUser(UserRequestDTO userRequestDto, Long userId) {
		Users user = userRepository.findById(userId).get();
		if(user!=null) {
			Role setRole = roleDao.findByName(userRequestDto.getRoleName());
			user.setEmail(userRequestDto.getEmail());
			user.setName(userRequestDto.getName());
			user.setZoneId(userRequestDto.getZoneId());
			user.setMobile(userRequestDto.getMobile());
			user.setPassword(bCryptPasswordEncoder.encode(userRequestDto.getPassword()));
			user.setUsername(userRequestDto.getName());
			Set<Role> roles =new HashSet<>();
			roles.add(setRole);
			user.setRoles(roles);
			userRepository.save(user);
			return Result.SUCCESS.toString();
		}
		return Result.WENT_WRONG.toString();
	}
	
	@Override
	public List<Users> allUser(){
		List<Users> allUser = userRepository.findAll();
		return !allUser.isEmpty()?allUser:null;
	}
	
	@Override
	public Users userById(Long userId) {
		Users foundUser = userRepository.findById(userId).get();
		return foundUser!=null?foundUser:null;
	}
}
