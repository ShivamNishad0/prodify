package com.hrms.modules.bijli.hiring.repository;

import com.hrms.modules.bijli.hiring.models.BijliStaff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface BijliStaffRepo extends JpaRepository<BijliStaff, Long> {
    public BijliStaff findByEmailOrContactNo(String email, String contactNo);

    @Query(value = "SELECT * FROM bijli.bijli_staff WHERE verified ='UNVERIFIED' AND active='ACTIVE'", nativeQuery = true)
    List<BijliStaff> findStaffUnverifiedStatus();

    @Query(value = "SELECT * FROM bijli.bijli_staff WHERE contact_no =:contact_no AND active='ACTIVE'", nativeQuery = true)
    BijliStaff findStaffByContact(@Param("contact_no") String contact_no);

    @Query(value = "SELECT * FROM bijli.bijli_staff WHERE verified ='VERIFIED' AND active='ACTIVE'", nativeQuery = true)
    List<BijliStaff> findStaffVerifiedStatus();

    @Query(value = "SELECT * FROM bijli.bijli_staff WHERE emp_no = :emp_no AND active='ACTIVE'", nativeQuery = true)
    BijliStaff findByEmpId(@Param("emp_no") String emp_no);

    @Query(value = "SELECT * FROM bijli.bijli_staff WHERE active='ACTIVE' ORDER BY staff_id DESC LIMIT 1", nativeQuery = true)
    BijliStaff getLatest();

    @Query(value = "SELECT * FROM bijli.bijli_staff WHERE temp_emp =:temp_emp AND active='ACTIVE'", nativeQuery = true)
    BijliStaff findStaffByTemp_emp(@Param("temp_emp") String temp_emp);

    @Query(value = "SELECT * FROM bijli.bijli_staff WHERE active='ACTIVE' ORDER BY staff_id", countQuery = "SELECT count(*) FROM bijli.bijli_staff WHERE active='ACTIVE'", nativeQuery = true)
    Page<BijliStaff> allStaffByZone(Pageable pageable);

    @Query(value = "SELECT * FROM bijli.bijli_staff WHERE (:area_id IS NOT NULL AND area_id IN :area_id AND active=:active AND verified =:verified) OR (:area_id IS NULL AND active=:active AND verified =:verified) ORDER BY temp_emp",
            countQuery = "SELECT count(*) FROM bijli.bijli_staff WHERE (:area_id IS NOT NULL AND area_id IN :area_id AND active=:active AND verified =:verified) OR (:area_id IS NULL AND active=:active AND verified =:verified)",
            nativeQuery = true)
    Page<BijliStaff> allStaffByZoneAndBySubDivision(@Param("area_id") List<Long> area_id, @Param("active") String active , @Param("verified") String verified, Pageable pageable);

//    @Query(value = "SELECT * FROM bijli.bijli_staff WHERE (:area_id IS NOT NULL AND area_id IN :area_id AND active=:active) OR (:area_id IS NULL AND active=:active) ORDER BY temp_emp",
//            countQuery = "SELECT count(*) FROM bijli.bijli_staff WHERE (:area_id IS NOT NULL AND area_id IN :area_id AND active=:active) OR (:area_id IS NULL AND active=:active)",
//            nativeQuery = true)
//    List<BijliStaff> allStaffByZoneAndBySubDivision(@Param("area_id") List<Long> area_id,@Param("active") String active);

    @Query(value = "SELECT * FROM bijli.bijli_staff WHERE ((:area_id IS NOT NULL AND (0 IN (:area_id) OR area_id IN (:area_id))) AND active = :active AND verified=:verified) OR (:area_id IS NULL AND active = :active AND verified=:verified) ORDER BY temp_emp",
            countQuery = "SELECT count(*) FROM bijli.bijli_staff WHERE ((:area_id IS NOT NULL AND (0 IN (:area_id) OR area_id IN (:area_id))) AND active = :active AND verified=:verified) OR (:area_id IS NULL AND active = :active AND verified=:verified)",
            nativeQuery = true)
    List<BijliStaff> allStaffByZoneAndBySubDivision(@Param("area_id") List<Long> area_id,@Param("verified") String verified, @Param("active") String active);


    @Query(value = "SELECT * FROM bijli.bijli_staff WHERE active=:active AND verified=:verified ORDER BY temp_emp", nativeQuery = true)
    Page<BijliStaff> allStaffByBySubDivision(@Param("active")String active, @Param("verified") String verified, Pageable pageable);

    @Query(value = "SELECT * FROM bijli.bijli_staff WHERE active='ACTIVE'", nativeQuery = true)
    Page<BijliStaff> findAllStaffs(Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM bijli.bijli_staff WHERE area_id IS NULL OR area_id IN :area_id AND active='ACTIVE' AND verified=:verified", nativeQuery = true)
    Long countStaffByZoneAndBySubDivision(@Param("area_id") List<Long> area_id, @Param("verified") String verified);

    @Query(value = "SELECT COUNT(*) FROM bijli.bijli_staff WHERE active='ACTIVE' AND verified=:verified", nativeQuery = true)
    Long countStaffByZoneAndBySubDivision( @Param("verified") String verified);

//    @Query(value = "SELECT * FROM bijli.bijli_staff WHERE (temp_emp LIKE %:searchTerm% OR contact_no LIKE %:searchTerm%) AND active=:active", nativeQuery = true)
//    List<BijliStaff> findStaffByTempEmp(@Param("searchTerm") String searchTerm,@Param("active") String active);

    @Query(value = "SELECT * FROM bijli.bijli_staff WHERE (temp_emp LIKE %:searchTerm% OR contact_no LIKE %:searchTerm% OR temp_emp IN ( SELECT emp_no FROM bijli.bijli_salary_structure WHERE pfuan_no LIKE %:searchTerm%)) AND active = :active AND verified =:verified", nativeQuery = true)
    List<BijliStaff> findStaffByTempEmp(@Param("searchTerm") String searchTerm,@Param("active") String active,@Param("verified") String verified);

//    @Query(value = "SELECT COUNT(*) FROM bijli.bijli_staff WHERE temp_emp LIKE %:tempEmp% AND active=:active", nativeQuery = true)
//    Long countStaffByTempEmp(@Param("tempEmp") String tempEmp,@Param("active") String active);

    @Query(value = "SELECT COUNT(*) FROM bijli.bijli_staff WHERE (temp_emp LIKE %:searchTerm% OR contact_no LIKE %:searchTerm% OR temp_emp IN (SELECT emp_no FROM bijli.bijli_salary_structure WHERE pfuan_no LIKE %:searchTerm%)) AND active = :active AND verified =:verified", nativeQuery = true)
    Long countStaffByTempEmp(@Param("searchTerm") String searchTerm, @Param("active") String active,@Param("verified") String verified);


    @Query(value = "SELECT * FROM bijli.bijli_staff WHERE active='INACTIVE'", nativeQuery = true)
    Page<BijliStaff> findAllStaffsDeactivated(Pageable pageable);

    @Query(value = "SELECT COUNT(*)  FROM bijli.bijli_staff WHERE active='INACTIVE'", nativeQuery = true)
    Long countStaffsDeactivated();

    @Query(value = "SELECT * FROM bijli.bijli_staff WHERE account_number =:account_number AND active='ACTIVE'", nativeQuery = true)
    BijliStaff findStaffByAccount(@Param("account_number") String account_number);
}
