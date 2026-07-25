package com.hrms.modules.bijli.payroll.repository;

import com.hrms.modules.bijli.payroll.modles.BijliStaffAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BijliStaffAttendanceRepository extends JpaRepository<BijliStaffAttendance, Long> {
	@Query(value = "SELECT * FROM bijli.bijli_staff_attendance WHERE emp_no = :emp_no", nativeQuery = true)
    BijliStaffAttendance findByEmpNo(@Param("emp_no")String emp_no);
	
	@Query(value = "SELECT * FROM bijli.bijli_staff_attendance WHERE staff_id = :staff_id AND month_name = :month_name AND year = :year", nativeQuery = true)
    BijliStaffAttendance findByDetails(@Param("staff_id") Long staff_id, @Param("month_name") String month_name, @Param("year") Integer year);

    @Query(value = "SELECT * FROM bijli.bijli_staff_attendance WHERE emp_no = :emp_no", nativeQuery = true)
    List<BijliStaffAttendance> findStaffByEmpNo(@Param("emp_no")String emp_no);
    @Query(value = "SELECT * FROM bijli.bijli_staff_attendance WHERE emp_no = :empNo AND month_name = :monthName AND year = :year", nativeQuery = true)
    BijliStaffAttendance findByEmpNoAndDate(@Param("empNo") String empNo, @Param("monthName") String monthName, @Param("year") Integer year);

    @Modifying
    @Query(value = "DELETE FROM bijli.bijli_staff_attendance WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
    void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);


}
