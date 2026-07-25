package com.hrms.modules.bijli.hiring.repository;

import com.hrms.modules.bijli.hiring.models.BijliStaffQualification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BijliStaffQualificationRepo extends JpaRepository<BijliStaffQualification, Long> {
	@Query(value = "SELECT * FROM bijli.bijli_staff_qualification WHERE staff_id =:staffId", nativeQuery = true)
	List<BijliStaffQualification> findByStaffId(@Param("staffId") Long staffId);
}
