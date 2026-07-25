package com.hrms.modules.auth.security;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.hrms.modules.auth.models.Role;
import com.hrms.modules.auth.models.Users;
import com.hrms.modules.auth.repositories.RoleRepository;
import com.hrms.modules.auth.repositories.UserRepository;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashSet;
import java.util.Set;

@Service
@AllArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService{

    private AuthenticationManager authenticationManager;
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired 
    private RoleRepository roleDao;
    
    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;
    
    @Override
    public JwtAuthResponse login(LoginDto loginDto) {

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDto.getEmail(),
                loginDto.getPassword()
        ));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        String token = jwtTokenProvider.generateToken(authentication);
        
        Users user = userRepository.findByEmailAndZone(loginDto.getEmail(),Long.parseLong(decoder(loginDto.getZoneId())) );
        JwtAuthResponse response = new JwtAuthResponse();
        response.setAccessToken(token);
        response.setUser(user);
        
        return (response.getUser()!=null && response.getAccessToken()!=null)?response:null;
    }

	@Override
	public String save(UserRequestDTO userRequestDto) throws Exception {
		Users user = new Users();
		if(userRequestDto.getEmail()==null || userRequestDto.getName()==null || userRequestDto.getPassword()==null ||userRequestDto.getMobile()==null)
		{
			throw new Exception("No_Records_Found");
		}
//		Optional<Role> role=roleDao.findRoleName(userRequestDto.getRole());
		
		Role setRole = roleDao.findByName("ROLE_USER");
		
		user.setEmail(userRequestDto.getEmail());
		user.setName(userRequestDto.getName());
		user.setMobile(userRequestDto.getMobile());
		user.setPassword(bCryptPasswordEncoder.encode(userRequestDto.getPassword()));
		user.setUsername(userRequestDto.getName());
		Set<Role> roles =new HashSet<>();
		roles.add(setRole);
		user.setRoles(roles);
		
		
		log.info("user ----- {}",user);
		
		
		userRepository.save(user);
		
		
		return "Resgister Successfull....";
	}
	
    public String decoder(String content) {
    	byte[] decodedBytes = Base64.getDecoder().decode(content);
    	return new String(decodedBytes, StandardCharsets.UTF_8);
    }
}
