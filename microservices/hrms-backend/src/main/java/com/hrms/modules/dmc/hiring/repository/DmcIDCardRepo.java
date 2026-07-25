package com.hrms.modules.dmc.hiring.repository;

import com.hrms.modules.dmc.hiring.models.DmcIDCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DmcIDCardRepo extends JpaRepository<DmcIDCard, Long> {
	@Query(value = "SELECT * FROM dmc.dmcidcard WHERE status ='ACTIVE'", nativeQuery = true)
	List<DmcIDCard> findAllActiveCard();

	@Query(value = "SELECT * FROM dmc.dmcidcard WHERE emp_no =:emp_no AND status ='ACTIVE'", nativeQuery = true)
    DmcIDCard findByEmpNo(@Param("emp_no") String emp_no);
	
	@Query(value = "SELECT * FROM dmc.dmcidcard WHERE status ='INACTIVE'", nativeQuery = true)
	List<DmcIDCard> findDeactiveCards();
	
	@Query(value = "SELECT * FROM dmc.dmcidcard WHERE staff_id =:staff_id", nativeQuery = true)
	Optional<DmcIDCard> findBystaff_id(@Param("staff_id") Long staff_id);
	
	@Query(value = "SELECT * FROM dmc.dmcidcard WHERE staff_id IN (:staff_id)", nativeQuery = true)
	List<DmcIDCard> findByStaffIds(@Param("staff_id") List<Long> staff_id);
	
	@Query(value = "SELECT COUNT(*) > 0 FROM dmc.dmcidcard WHERE staff_id = :staff_id", nativeQuery = true)
	boolean existsByStaffId(@Param("staff_id") Long staff_id);

}
