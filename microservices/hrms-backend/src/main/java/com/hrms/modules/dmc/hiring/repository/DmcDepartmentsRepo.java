package com.hrms.modules.dmc.hiring.repository;

import com.hrms.modules.dmc.hiring.models.DmcDepartments;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DmcDepartmentsRepo extends JpaRepository<DmcDepartments, Long> {

	DmcDepartments findByDepName(String depName);
}
