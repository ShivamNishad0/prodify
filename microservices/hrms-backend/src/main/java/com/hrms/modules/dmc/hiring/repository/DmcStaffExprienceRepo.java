package com.hrms.modules.dmc.hiring.repository;

import com.hrms.modules.dmc.hiring.models.DmcStaffExprience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DmcStaffExprienceRepo extends JpaRepository<DmcStaffExprience, Long> {

	@Query(value = "SELECT * FROM dmc.dmc_staff_exprience WHERE staff_id =:staffId", nativeQuery = true)
	List<DmcStaffExprience> findByStaff(@Param("staffId") Long staffId);
}
