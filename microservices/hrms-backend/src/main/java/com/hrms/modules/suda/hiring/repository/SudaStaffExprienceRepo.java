package com.hrms.modules.suda.hiring.repository;

import com.hrms.modules.suda.hiring.models.SudaStaffExprience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SudaStaffExprienceRepo extends JpaRepository<SudaStaffExprience, Long> {

	@Query(value = "SELECT * FROM suda.suda_staff_exprience WHERE staff_id =:staffId", nativeQuery = true)
	List<SudaStaffExprience> findByStaff(@Param("staffId") Long staffId);
}
