package com.hrms.modules.rmc.hiring.repository;

import com.hrms.modules.rmc.hiring.models.RmcStaffQualification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RmcStaffQualificationRepo extends JpaRepository<RmcStaffQualification, Long> {
	@Query(value = "SELECT * FROM rmc.rmc_staff_qualification WHERE staff_id =:staffId", nativeQuery = true)
	List<RmcStaffQualification> findByStaffId(@Param("staffId") Long staffId);
}
