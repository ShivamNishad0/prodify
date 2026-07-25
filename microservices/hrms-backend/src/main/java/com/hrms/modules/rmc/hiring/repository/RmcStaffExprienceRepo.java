package com.hrms.modules.rmc.hiring.repository;

import com.hrms.modules.rmc.hiring.models.RmcStaffExprience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RmcStaffExprienceRepo extends JpaRepository<RmcStaffExprience, Long> {

	@Query(value = "SELECT * FROM rmc.rmc_staff_exprience WHERE staff_id =:staffId", nativeQuery = true)
	List<RmcStaffExprience> findByStaff(@Param("staffId") Long staffId);
}
