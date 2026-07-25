package com.hrms.modules.ho.hiring.repository;

import com.hrms.modules.ho.hiring.models.HoStaffExprience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HoStaffExprienceRepo extends JpaRepository<HoStaffExprience, Long> {

	@Query(value = "SELECT * FROM ho.ho_staff_exprience WHERE staff_id =:staffId", nativeQuery = true)
	List<HoStaffExprience> findByStaff(@Param("staffId") Long staffId);
}
