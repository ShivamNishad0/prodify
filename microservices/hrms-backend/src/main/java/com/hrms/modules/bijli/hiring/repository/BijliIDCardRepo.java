package com.hrms.modules.bijli.hiring.repository;

import com.hrms.modules.bijli.hiring.models.BijliIDCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BijliIDCardRepo extends JpaRepository<BijliIDCard, Long> {
	@Query(value = "SELECT * FROM bijli.bijliidcard WHERE status ='ACTIVE'", nativeQuery = true)
	List<BijliIDCard> findAllActiveCard();

	@Query(value = "SELECT * FROM bijli.bijliidcard WHERE emp_no =:emp_no AND status ='ACTIVE'", nativeQuery = true)
    BijliIDCard findByEmpNo(@Param("emp_no") String emp_no);
	
	@Query(value = "SELECT * FROM bijli.bijliidcard WHERE status ='INACTIVE'", nativeQuery = true)
	List<BijliIDCard> findDeactiveCards();
	
	@Query(value = "SELECT * FROM bijli.bijliidcard WHERE staff_id =:staff_id", nativeQuery = true)
	BijliIDCard findBystaff_id(@Param("staff_id") Long staff_id);
	
	@Query(value = "SELECT * FROM bijli.bijliidcard WHERE staff_id IN (:staff_id)", nativeQuery = true)
	List<BijliIDCard> findByStaffIds(@Param("staff_id") List<Long> staff_id);
	
	@Query(value = "SELECT COUNT(*) > 0 FROM bijli.bijliidcard WHERE staff_id = :staff_id", nativeQuery = true)
	boolean existsByStaffId(@Param("staff_id") Long staff_id);

}
