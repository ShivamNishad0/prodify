package com.hrms.modules.rmc.hiring.repository;

import com.hrms.modules.rmc.hiring.models.RmcDepartments;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RmcDepartmentsRepo extends JpaRepository<RmcDepartments, Long> {

	RmcDepartments findByDepName(String depName);
}
