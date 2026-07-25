package com.hrms.modules.suda.payroll.repository;

import com.hrms.modules.suda.payroll.modles.SudaStaffAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SudaStaffAttendanceRepository extends JpaRepository<SudaStaffAttendance, Long> {
	@Query(value = "SELECT * FROM suda.suda_staff_attendance WHERE emp_no = :emp_no", nativeQuery = true)
    SudaStaffAttendance findByEmpNo(@Param("emp_no")String emp_no);
	
	@Query(value = "SELECT * FROM suda.suda_staff_attendance WHERE staff_id = :staff_id AND month_name = :month_name AND year = :year", nativeQuery = true)
    SudaStaffAttendance findByDetails(@Param("staff_id") Long staff_id, @Param("month_name") String month_name, @Param("year") Integer year);

	@Query(value = "SELECT * FROM suda.suda_staff_attendance WHERE emp_no = :emp_no AND month_name = :month_name AND year = :year", nativeQuery = true)
    SudaStaffAttendance findByEmpNoAndDate(@Param("emp_no")String emp_no, @Param("month_name") String month_name, @Param("year") Integer year);

    @Query(value = "SELECT * FROM suda.suda_staff_attendance WHERE emp_no = :emp_no", nativeQuery = true)
    List<SudaStaffAttendance> findStaffByEmpNo(@Param("emp_no") String emp_no);

    @Modifying
    @Query(value = "DELETE FROM suda.suda_staff_attendance WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
    void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);
}
