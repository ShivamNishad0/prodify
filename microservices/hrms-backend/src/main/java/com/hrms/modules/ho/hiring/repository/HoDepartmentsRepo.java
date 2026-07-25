package com.hrms.modules.ho.hiring.repository;

import com.hrms.modules.ho.hiring.models.HoDepartments;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HoDepartmentsRepo extends JpaRepository<HoDepartments, Long> {

	HoDepartments findByDepName(String depName);
}
