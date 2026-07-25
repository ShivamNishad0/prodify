package com.hrms.modules.dmc.hiring.repository;

import com.hrms.modules.dmc.hiring.models.DmcStaffQualification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DmcStaffQualificationRepo extends JpaRepository<DmcStaffQualification, Long> {
	@Query(value = "SELECT * FROM dmc.dmc_staff_qualification WHERE staff_id =:staffId", nativeQuery = true)
	List<DmcStaffQualification> findByStaffId(@Param("staffId") Long staffId);
}
