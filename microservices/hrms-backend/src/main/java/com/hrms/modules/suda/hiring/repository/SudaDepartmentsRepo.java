package com.hrms.modules.suda.hiring.repository;

import com.hrms.modules.suda.hiring.models.SudaDepartments;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SudaDepartmentsRepo extends JpaRepository<SudaDepartments, Long> {

	SudaDepartments findByDepName(String depName);
}
