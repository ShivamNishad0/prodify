package com.hrms.modules.bijli.hiring.repository;

import com.hrms.modules.bijli.hiring.models.BijliDepartments;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BijliDepartmentsRepo extends JpaRepository<BijliDepartments, Long> {

	BijliDepartments findByDepName(String depName);
}
