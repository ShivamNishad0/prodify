package com.hrms.modules.suda.hiring.repository;

import com.hrms.modules.suda.hiring.models.SudaStaff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface SudaStaffRepo extends JpaRepository<SudaStaff, Long> {
	public SudaStaff findByEmailOrContactNo(String email, String contactNo);

	@Query(value = "SELECT * FROM suda.suda_staff WHERE account_number =:account_number AND active='ACTIVE'", nativeQuery = true)
	SudaStaff findStaffByAccount(@Param("account_number") String account_number);


	@Query(value = "SELECT * FROM suda.suda_staff WHERE verified ='UNVERIFIED'", nativeQuery = true)
	List<SudaStaff> findStaffUnverifiedStatus();

	@Query(value = "SELECT * FROM suda.suda_staff WHERE contact_no =:contact_no", nativeQuery = true)
	SudaStaff findStaffByContact(@Param("contact_no") String contact_no);

	@Query(value = "SELECT * FROM suda.suda_staff WHERE verified ='VERIFIED'", nativeQuery = true)
	List<SudaStaff> findStaffVerifiedStatus();

	@Query(value = "SELECT * FROM suda.suda_staff WHERE emp_no = :emp_no", nativeQuery = true)
	SudaStaff findByEmpId(@Param("emp_no") String emp_no);

	@Query(value = "SELECT * FROM suda.suda_staff ORDER BY staff_id DESC LIMIT 1", nativeQuery = true)
	SudaStaff getLatest();

	@Query(value = "SELECT * FROM suda.suda_staff WHERE temp_emp =:temp_emp", nativeQuery = true)
	SudaStaff findStaffByTemp_emp(@Param("temp_emp") String temp_emp);

	@Query(value = "SELECT * FROM suda.suda_staff WHERE active='ACTIVE' ORDER BY staff_id", countQuery = "SELECT count(*) FROM suda.suda_staff WHERE active='ACTIVE' ", nativeQuery = true)
	Page<SudaStaff> allStaffByZone(Pageable pageable);

	@Query(value = "SELECT * FROM suda.suda_staff WHERE (:area_id IS NULL OR area_id = :area_id) AND active = :active AND verified = :verified ORDER BY temp_emp",
			countQuery = "SELECT COUNT(*) FROM suda.suda_staff WHERE (:area_id IS NULL OR area_id = :area_id) AND active = :active AND verified = :verified", nativeQuery = true)
	Page<SudaStaff> allStaffByZoneAndBySubDivision(@Param("area_id") Long area_id, @Param("active") String active, @Param("verified") String verified, Pageable pageable);


	@Query(value = "SELECT * FROM suda.suda_staff WHERE active=:active AND verified =:verified ORDER BY temp_emp", nativeQuery = true)
	Page<SudaStaff> allStaff(@Param("active")String active, Pageable pageable,@Param("verified")String verified);

	@Query(value = "SELECT * FROM suda.suda_staff WHERE active='ACTIVE'", nativeQuery = true)
	Page<SudaStaff> findAllStaffs(Pageable pageable);

	@Query(value = "SELECT * FROM suda.suda_staff WHERE active='INACTIVE'", nativeQuery = true)
	Page<SudaStaff> findAllStaffsDeactivated(Pageable pageable);

	@Query(value = "SELECT COUNT(*)  FROM suda.suda_staff WHERE active='INACTIVE'", nativeQuery = true)
	Long countStaffsDeactivated();

	@Query(value = "SELECT COUNT(*) FROM suda.suda_staff WHERE area_id IS NULL OR area_id = :area_id AND active='ACTIVE' AND verified =:verified", nativeQuery = true)
	Long countStaffByZoneAndBySubDivision( @Param("area_id") Long area_id,@Param("verified") String verified);

	@Query(value = "SELECT COUNT(*) FROM suda.suda_staff WHERE verified =:verified", nativeQuery = true)
	Long countStaffByZoneAndBySubDivision(@Param("verified") String verified);

	@Query(value = "SELECT * FROM suda.suda_staff WHERE (temp_emp LIKE %:searchTerm% OR contact_no LIKE %:searchTerm% OR temp_emp IN ( SELECT emp_no FROM suda.suda_salary_structure WHERE pfuan_no LIKE %:searchTerm%)) AND active = :active AND verified = :verified", nativeQuery = true)
	List<SudaStaff> findStaffByTempEmp(@Param("searchTerm") String searchTerm, @Param("active") String active, @Param("verified") String verified);


//	@Query(value = "SELECT COUNT(*) FROM suda.suda_staff WHERE temp_emp LIKE %:tempEmp% AND active=:active", nativeQuery = true)
//	Long countStaffByTempEmp(@Param("tempEmp") String tempEmp,@Param("active")String active);
	@Query(value = "SELECT COUNT(*) FROM suda.suda_staff WHERE (temp_emp LIKE %:searchTerm% OR contact_no LIKE %:searchTerm% OR temp_emp IN (SELECT emp_no FROM suda.suda_salary_structure WHERE pfuan_no LIKE %:searchTerm%)) AND active = :active", nativeQuery = true)
	Long countStaffByTempEmp(@Param("searchTerm") String searchTerm, @Param("active") String active);



}
