package com.hrms.modules.auth.security;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class UserRequestDTO {

	private String email;
	private String name;
	private String password;
	private String username;
	private String mobile;
	private Long zoneId;
	private String roleName;
	
	
}
