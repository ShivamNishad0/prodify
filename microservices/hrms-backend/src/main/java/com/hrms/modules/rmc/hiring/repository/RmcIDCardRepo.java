package com.hrms.modules.rmc.hiring.repository;

import com.hrms.modules.rmc.hiring.models.RmcIDCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RmcIDCardRepo extends JpaRepository<RmcIDCard, Long> {
	@Query(value = "SELECT * FROM rmc.rmcidcard WHERE status ='ACTIVE'", nativeQuery = true)
	List<RmcIDCard> findAllActiveCard();

	@Query(value = "SELECT * FROM rmc.rmcidcard WHERE emp_no =:emp_no AND status ='ACTIVE'", nativeQuery = true)
    RmcIDCard findByEmpNo(@Param("emp_no") String emp_no);
	
	@Query(value = "SELECT * FROM rmc.rmcidcard WHERE status ='INACTIVE'", nativeQuery = true)
	List<RmcIDCard> findDeactiveCards();
	
	@Query(value = "SELECT * FROM rmc.rmcidcard WHERE staff_id =:staff_id", nativeQuery = true)
	Optional<RmcIDCard> findBystaff_id(@Param("staff_id") Long staff_id);
	
	@Query(value = "SELECT * FROM rmc.rmcidcard WHERE staff_id IN (:staff_id)", nativeQuery = true)
	List<RmcIDCard> findByStaffIds(@Param("staff_id") List<Long> staff_id);
	
	@Query(value = "SELECT COUNT(*) > 0 FROM rmc.rmcidcard WHERE staff_id = :staff_id", nativeQuery = true)
	boolean existsByStaffId(@Param("staff_id") Long staff_id);

}
