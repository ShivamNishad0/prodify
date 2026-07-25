package com.hrms.modules.ho.payroll.repository;

import com.hrms.modules.ho.payroll.modles.HoStaffAttendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HoStaffAttendanceRepository extends JpaRepository<HoStaffAttendance, Long> {
	@Query(value = "SELECT * FROM ho.ho_staff_attendance WHERE emp_no = :emp_no", nativeQuery = true)
    HoStaffAttendance findByEmpNo(@Param("emp_no")String emp_no);

    @Query(value = "SELECT * FROM ho.ho_staff_attendance WHERE emp_no = :emp_no", nativeQuery = true)
    List<HoStaffAttendance> findStaffByEmpNo(@Param("emp_no")String emp_no);

	@Query(value = "SELECT * FROM ho.ho_staff_attendance WHERE staff_id = :staff_id AND month_name = :month_name AND year = :year", nativeQuery = true)
    HoStaffAttendance findByDetails(@Param("staff_id") Long staff_id, @Param("month_name") String month_name, @Param("year") Integer year);

	@Query(value = "SELECT * FROM ho.ho_staff_attendance WHERE emp_no = :emp_no AND month_name = :month_name AND year = :year", nativeQuery = true)
    HoStaffAttendance findByEmpNoAndDate(@Param("emp_no")String emp_no, @Param("month_name") String month_name, @Param("year") Integer year);

    @Query(value = "SELECT * FROM ho.ho_staff_attendance WHERE emp_no LIKE CONCAT('%', :emp_no, '%') AND month_name = :month_name AND year = :year", nativeQuery = true)
    Page<HoStaffAttendance> findByLikeEmpNoAndDate(@Param("emp_no") String emp_no, @Param("month_name") String month_name, @Param("year") Integer year, Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM ho.ho_staff_attendance WHERE emp_no LIKE CONCAT('%', :emp_no, '%') AND month_name = :month_name AND year = :year", nativeQuery = true)
    long countByEmpNoAndDate(@Param("emp_no") String emp_no, @Param("month_name") String month_name, @Param("year") Integer year);

    @Modifying
    @Query(value = "DELETE FROM ho.ho_staff_attendance WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
    void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);
}
