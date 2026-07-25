package com.hrms.modules.suda.hiring.repository;

import com.hrms.modules.suda.hiring.models.SudaIDCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SudaIDCardRepo extends JpaRepository<SudaIDCard, Long> {
	@Query(value = "SELECT * FROM suda.sudaidcard WHERE status ='ACTIVE'", nativeQuery = true)
	List<SudaIDCard> findAllActiveCard();

	@Query(value = "SELECT * FROM suda.sudaidcard WHERE emp_no =:emp_no AND status ='ACTIVE'", nativeQuery = true)
	SudaIDCard findByEmpNo(@Param("emp_no") String emp_no);
	
	@Query(value = "SELECT * FROM suda.sudaidcard WHERE status ='INACTIVE'", nativeQuery = true)
	List<SudaIDCard> findDeactiveCards();
	
	@Query(value = "SELECT * FROM suda.sudaidcard WHERE staff_id =:staff_id", nativeQuery = true)
	Optional<SudaIDCard> findBystaff_id(@Param("staff_id") Long staff_id);
	
	@Query(value = "SELECT * FROM suda.sudaidcard WHERE staff_id IN (:staff_id)", nativeQuery = true)
	List<SudaIDCard> findByStaffIds(@Param("staff_id") List<Long> staff_id);
	
	@Query(value = "SELECT COUNT(*) > 0 FROM suda.sudaidcard WHERE staff_id = :staff_id", nativeQuery = true)
	boolean existsByStaffId(@Param("staff_id") Long staff_id);

}
