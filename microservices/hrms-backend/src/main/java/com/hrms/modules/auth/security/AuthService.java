package com.hrms.modules.auth.security;

public interface AuthService {
	JwtAuthResponse login(LoginDto loginDto);
    String save(UserRequestDTO userRequestDto) throws Exception;
}
