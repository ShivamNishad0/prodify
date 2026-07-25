package com.hrms.modules.bhilai.hiring.repository;

import com.hrms.modules.bhilai.hiring.models.BhilaiStaff;
import com.hrms.modules.bijli.hiring.models.BijliStaff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BhilaiStaffRepo extends JpaRepository<BhilaiStaff, Long> {
	@Query(value = "SELECT * FROM bhilai.bhilai_staff WHERE verified ='UNVERIFIED' AND active='ACTIVE'", nativeQuery = true)
	List<BhilaiStaff> findStaffUnverifiedStatus();

	@Query(value = "SELECT * FROM bhilai.bhilai_staff WHERE account_number =:account_number AND active='ACTIVE'", nativeQuery = true)
	BhilaiStaff findStaffByAccount(@Param("account_number") String account_number);

	@Query(value = "SELECT * FROM bhilai.bhilai_staff WHERE contact_no =:contact_no AND active='ACTIVE'", nativeQuery = true)
	BhilaiStaff findStaffByContact(@Param("contact_no") String contact_no);

	@Query(value = "SELECT * FROM bhilai.bhilai_staff WHERE verified ='VERIFIED' active='ACTIVE'", nativeQuery = true)
	List<BhilaiStaff> findStaffVerifiedStatus();

	@Query(value = "SELECT * FROM bhilai.bhilai_staff WHERE active='ACTIVE' ORDER BY staff_id DESC LIMIT 1", nativeQuery = true)
	BhilaiStaff getLatest();

	@Query(value = "SELECT * FROM bhilai.bhilai_staff WHERE temp_emp =:temp_emp AND active='ACTIVE'", nativeQuery = true)
	BhilaiStaff findStaffByTemp_emp(@Param("temp_emp") String temp_emp);

	@Query(value = "SELECT * FROM bhilai.bhilai_staff WHERE  active='ACTIVE' ORDER BY staff_id", countQuery = "SELECT count(*) FROM bhilai.bhilai_staff WHERE  active='ACTIVE'", nativeQuery = true)
	Page<BhilaiStaff> allStaffByZone(Pageable pageable);

	@Query(value = "SELECT * FROM bhilai.bhilai_staff WHERE (:area_id IS NOT NULL AND area_id = :area_id AND active=:active AND verified=:verified ) OR (:area_id IS NULL AND active=:active AND verified=:verified) ORDER BY temp_emp",
			countQuery = "SELECT count(*) FROM bhilai.bhilai_staff WHERE (:area_id IS NOT NULL AND area_id = :area_id AND active=:active AND verified=:verified) OR (:area_id IS NULL AND active=:active AND verified=:verified)",
			nativeQuery = true)
		Page<BhilaiStaff> allStaffByZoneAndBySubDivision(@Param("area_id") Long area_id,@Param("active")String active, @Param("verified") String verified, Pageable pageable);

	@Query(value = "SELECT * FROM bhilai.bhilai_staff WHERE active=:active AND verified=:verified ORDER BY temp_emp", nativeQuery = true)
	Page<BhilaiStaff> allStaffByBySubDivision(@Param("active")String active,Pageable pageable, @Param("verified") String verified);

	@Query(value = "SELECT COUNT(*) FROM bhilai.bhilai_staff WHERE (area_id IS NULL OR area_id = :area_id) AND active = :active AND verified = :verified", nativeQuery = true)
	Long countStaffByZoneAndBySubDivision(@Param("area_id") Long area_id, @Param("active") String active, @Param("verified") String verified);

	@Query(value = "SELECT COUNT(*) FROM bhilai.bhilai_staff WHERE active=:active AND verified=:verified", nativeQuery = true)
	Long countStaffByZoneAndBySubDivision(@Param("active")String active,@Param("verified") String verified );

	@Query(value = "SELECT * FROM bhilai.bhilai_staff WHERE active='ACTIVE'",nativeQuery = true)
	Page<BhilaiStaff> findAllStaffs(Pageable pageable);
	
	@Query(value = "SELECT * FROM bhilai.bhilai_staff WHERE (temp_emp LIKE %:searchTerm% OR contact_no LIKE %:searchTerm%) AND active=:active AND verified=:verified", nativeQuery = true)
	List<BhilaiStaff> findStaffByTempEmp(@Param("searchTerm") String searchTerm,@Param("active")String active, @Param("verified") String verified);

	@Query(value = "SELECT COUNT(*) FROM bhilai.bhilai_staff WHERE temp_emp LIKE %:tempEmp% AND active=:active AND verified=:verified", nativeQuery = true)
	Long countStaffByTempEmp(@Param("tempEmp") String tempEmp,@Param("active")String active, @Param("verified") String verified);

	@Query(value = "SELECT * FROM bhilai.bhilai_staff WHERE active='INACTIVE'", nativeQuery = true)
	Page<BhilaiStaff> findAllStaffsDeactivated(Pageable pageable);

	@Query(value = "SELECT COUNT(*)  FROM bhilai.bhilai_staff WHERE active='INACTIVE'", nativeQuery = true)
	Long countStaffsDeactivated();
}
