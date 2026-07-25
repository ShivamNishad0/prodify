package com.hrms.modules.bijli.hiring.repository;

import com.hrms.modules.bijli.hiring.models.BijliStaffExprience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BijliStaffExprienceRepo extends JpaRepository<BijliStaffExprience, Long> {

	@Query(value = "SELECT * FROM bijli.bijli_staff_exprience WHERE staff_id =:staffId", nativeQuery = true)
	List<BijliStaffExprience> findByStaff(@Param("staffId") Long staffId);
}
