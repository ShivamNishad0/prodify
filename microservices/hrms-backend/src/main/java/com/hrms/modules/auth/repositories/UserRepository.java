package com.hrms.modules.auth.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hrms.modules.auth.models.Users;


public interface UserRepository extends JpaRepository<Users, Long>  {
	@Query(value = "SELECT * FROM users WHERE email =:email AND zone_id=:zone_id", nativeQuery = true)
	Users findByEmailAndZone(@Param("email")String email,@Param("zone_id")Long zone_id);
	
	Users findByEmail(String eamil);
}
