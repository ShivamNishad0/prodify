package com.hrms.modules.auth.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hrms.modules.auth.models.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Role findByName(String name);
    
    @Query("select r from Role r where r.name =?1")
    Optional<Role> findRoleName(@Param("roleName") String roleName);
}