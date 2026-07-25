package com.hrms.modules.suda.hiring.repository;

import com.hrms.modules.suda.hiring.models.SudaStaffQualification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SudaStaffQualificationRepo extends JpaRepository<SudaStaffQualification, Long> {
	@Query(value = "SELECT * FROM suda.suda_staff_qualification WHERE staff_id =:staffId", nativeQuery = true)
	List<SudaStaffQualification> findByStaffId(@Param("staffId") Long staffId);
}
