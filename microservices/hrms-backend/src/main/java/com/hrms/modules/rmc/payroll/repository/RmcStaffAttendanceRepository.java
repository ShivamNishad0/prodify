package com.hrms.modules.rmc.payroll.repository;

import com.hrms.modules.rmc.payroll.modles.RmcStaffAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RmcStaffAttendanceRepository extends JpaRepository<RmcStaffAttendance, Long> {
	@Query(value = "SELECT * FROM rmc.rmc_staff_attendance WHERE emp_no = :emp_no", nativeQuery = true)
    RmcStaffAttendance findByEmpNo(@Param("emp_no")String emp_no);
	
	@Query(value = "SELECT * FROM rmc.rmc_staff_attendance WHERE staff_id = :staff_id AND month_name = :month_name AND year = :year", nativeQuery = true)
    RmcStaffAttendance findByDetails(@Param("staff_id") Long staff_id, @Param("month_name") String month_name, @Param("year") Integer year);

	@Query(value = "SELECT * FROM rmc.rmc_staff_attendance WHERE emp_no = :emp_no AND month_name = :month_name AND year = :year", nativeQuery = true)
    RmcStaffAttendance findByEmpNoAndDate(@Param("emp_no")String emp_no, @Param("month_name") String month_name, @Param("year") Integer year);

    @Query(value = "SELECT * FROM rmc.rmc_staff_attendance WHERE emp_no = :emp_no", nativeQuery = true)
    List<RmcStaffAttendance> findStaffByEmpNo(@Param("emp_no") String emp_no);

    @Modifying
    @Query(value = "DELETE FROM rmc.rmc_staff_attendance WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
    void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);
}
