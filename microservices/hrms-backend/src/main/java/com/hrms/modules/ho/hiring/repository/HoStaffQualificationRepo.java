package com.hrms.modules.ho.hiring.repository;

import com.hrms.modules.ho.hiring.models.HoStaffQualification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HoStaffQualificationRepo extends JpaRepository<HoStaffQualification, Long> {
	@Query(value = "SELECT * FROM ho.ho_staff_qualification WHERE staff_id =:staffId", nativeQuery = true)
	List<HoStaffQualification> findByStaffId(@Param("staffId") Long staffId);
}
