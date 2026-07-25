package com.hrms.modules.bhilai.hiring.repository;

import com.hrms.modules.bhilai.hiring.models.BhilaiIDCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface BhilaiIDCardRepo extends JpaRepository<BhilaiIDCard, Long> {
	@Query(value = "SELECT * FROM bhilai.bhilaiidcard WHERE status ='ACTIVE'", nativeQuery = true)
	List<BhilaiIDCard> findAllActiveCard();

	@Query(value = "SELECT * FROM bhilai.bhilaiidcard WHERE emp_no =:emp_no AND status ='ACTIVE'", nativeQuery = true)
    BhilaiIDCard findByEmpNo(@Param("emp_no") String emp_no);
	
	@Query(value = "SELECT * FROM bhilai.bhilaiidcard WHERE status ='INACTIVE'", nativeQuery = true)
	List<BhilaiIDCard> findDeactiveCards();
	
	@Query(value = "SELECT * FROM bhilai.bhilaiidcard WHERE staff_id =:staff_id", nativeQuery = true)
	Optional<BhilaiIDCard> findBystaff_id(@Param("staff_id") Long staff_id);
	
	@Query(value = "SELECT * FROM bhilai.bhilaiidcard WHERE staff_id IN (:staff_id)", nativeQuery = true)
	List<BhilaiIDCard> findByStaffIds(@Param("staff_id") List<Long> staff_id);
	
	@Query(value = "SELECT COUNT(*) > 0 FROM bhilai.bhilaiidcard WHERE staff_id = :staff_id", nativeQuery = true)
	boolean existsByStaffId(@Param("staff_id") Long staff_id);

}
