package com.hrms.modules.dmc.hiring.repository;

import com.hrms.modules.dmc.hiring.models.DmcStaff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DmcStaffRepo extends JpaRepository<DmcStaff, Long> {
	public DmcStaff findByEmailOrContactNo(String email, String contactNo);

	@Query(value = "SELECT * FROM dmc.dmc_staff WHERE account_number =:account_number AND active='ACTIVE'", nativeQuery = true)
	DmcStaff findStaffByAccount(@Param("account_number") String account_number);

	@Query(value = "SELECT * FROM dmc.dmc_staff WHERE verified ='UNVERIFIED' AND active='ACTIVE'", nativeQuery = true)
	List<DmcStaff> findStaffUnverifiedStatus();

	@Query(value = "SELECT * FROM dmc.dmc_staff WHERE contact_no =:contact_no AND active='ACTIVE'", nativeQuery = true)
	DmcStaff findStaffByContact(@Param("contact_no") String contact_no);

	@Query(value = "SELECT * FROM dmc.dmc_staff WHERE verified ='VERIFIED' AND active='ACTIVE'", nativeQuery = true)
	List<DmcStaff> findStaffVerifiedStatus();

	@Query(value = "SELECT * FROM dmc.dmc_staff WHERE emp_no = :emp_no AND active='ACTIVE'", nativeQuery = true)
	DmcStaff findByEmpId(@Param("emp_no") String emp_no);

	@Query(value = "SELECT * FROM dmc.dmc_staff WHERE active='ACTIVE' ORDER BY staff_id DESC LIMIT 1", nativeQuery = true)
	DmcStaff getLatest();

	@Query(value = "SELECT * FROM dmc.dmc_staff WHERE temp_emp =:temp_emp AND active='ACTIVE'", nativeQuery = true)
	DmcStaff findStaffByTemp_emp(@Param("temp_emp") String temp_emp);

	@Query(value = "SELECT * FROM dmc.dmc_staff WHERE active='ACTIVE' ORDER BY staff_id", countQuery = "SELECT count(*) FROM dmc.dmc_staff", nativeQuery = true)
	Page<DmcStaff> allStaffByZone(Pageable pageable);

	@Query(value = "SELECT * FROM dmc.dmc_staff WHERE (:area_id IS NOT NULL AND area_id = :area_id AND active=:active AND verified=:verified) OR (:area_id IS NULL AND active=:active AND verified=:verified) ORDER BY temp_emp",
		       countQuery = "SELECT count(*) FROM dmc.dmc_staff WHERE (:area_id IS NOT NULL AND area_id = :area_id AND active=:active AND verified=:verified) OR (:area_id IS NULL AND active=:active AND verified=:verified)",
		       nativeQuery = true)
		Page<DmcStaff> allStaffByZoneAndBySubDivision(@Param("area_id") Long area_id,@Param("active") String active, @Param("verified") String verified, Pageable pageable);

	@Query(value = "SELECT * FROM dmc.dmc_staff WHERE active=:active AND verified=:verified ORDER BY temp_emp",nativeQuery = true)
	Page<DmcStaff> allStaffByBySubDivision(@Param("active")String active, Pageable pageable, @Param("verified") String verified);

	@Query(value = "SELECT COUNT(*) FROM dmc.dmc_staff WHERE area_id IS NULL OR area_id = :area_id AND active='ACTIVE' AND verified=:verified", nativeQuery = true)
	Long countStaffByZoneAndBySubDivision( @Param("area_id") Long area_id, @Param("verified") String verified);

	@Query(value = "SELECT COUNT(*) FROM dmc.dmc_staff WHERE active='ACTIVE' AND verified=:verified", nativeQuery = true)
	Long countStaffByZoneAndBySubDivision(@Param("verified") String verified);
	
	@Query(value = "SELECT * FROM dmc.dmc_staff WHERE (temp_emp LIKE %:searchTerm% OR contact_no LIKE %:searchTerm%) AND active=:active AND verified=:verified", nativeQuery = true)
	List<DmcStaff> findStaffByTempEmp(@Param("searchTerm") String searchTerm,@Param("active") String active, @Param("verified") String verified);

	@Query(value = "SELECT COUNT(*) FROM dmc.dmc_staff WHERE temp_emp LIKE %:tempEmp% AND active=:active AND verified=:verified", nativeQuery = true)
	Long countStaffByTempEmp(@Param("tempEmp") String tempEmp,@Param("active") String active, @Param("verified") String verified);

	@Query(value = "SELECT * FROM dmc.dmc_staff WHERE active='INACTIVE'", nativeQuery = true)
	Page<DmcStaff> findAllStaffsDeactivated(Pageable pageable);

	@Query(value = "SELECT COUNT(*)  FROM dmc.dmc_staff WHERE active='INACTIVE'", nativeQuery = true)
	Long countStaffsDeactivated();
}
