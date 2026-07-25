package com.hrms.modules.bhilai.hiring.repository;

import com.hrms.modules.bhilai.hiring.models.BhilaiDepartments;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BhilaiDepartmentsRepo extends JpaRepository<BhilaiDepartments, Long> {

	BhilaiDepartments findByDepName(String depName);
}
