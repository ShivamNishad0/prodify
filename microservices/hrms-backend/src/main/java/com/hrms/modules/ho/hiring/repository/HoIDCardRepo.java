package com.hrms.modules.ho.hiring.repository;

import com.hrms.modules.ho.hiring.models.HoIDCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HoIDCardRepo extends JpaRepository<HoIDCard, Long> {
	@Query(value = "SELECT * FROM ho.hoidcard WHERE status ='ACTIVE'", nativeQuery = true)
	List<HoIDCard> findAllActiveCard();

	@Query(value = "SELECT * FROM ho.hoidcard WHERE emp_no =:emp_no AND status ='ACTIVE'", nativeQuery = true)
    HoIDCard findByEmpNo(@Param("emp_no") String emp_no);
	
	@Query(value = "SELECT * FROM ho.hoidcard WHERE status ='INACTIVE'", nativeQuery = true)
	List<HoIDCard> findDeactiveCards();
	
	@Query(value = "SELECT * FROM ho.hoidcard WHERE staff_id =:staff_id", nativeQuery = true)
	HoIDCard findBystaff_id(@Param("staff_id") Long staff_id);
	
	@Query(value = "SELECT * FROM ho.hoidcard WHERE staff_id IN (:staff_id)", nativeQuery = true)
	List<HoIDCard> findByStaffIds(@Param("staff_id") List<Long> staff_id);
	
	@Query(value = "SELECT COUNT(*) > 0 FROM ho.hoidcard WHERE staff_id = :staff_id", nativeQuery = true)
	boolean existsByStaffId(@Param("staff_id") Long staff_id);

}
