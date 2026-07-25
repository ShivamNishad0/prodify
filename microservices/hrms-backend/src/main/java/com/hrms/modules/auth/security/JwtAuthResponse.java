package com.hrms.modules.auth.security;

import com.hrms.modules.auth.models.Users;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JwtAuthResponse {
	  private Users user;
	private String accessToken;
  
  
}