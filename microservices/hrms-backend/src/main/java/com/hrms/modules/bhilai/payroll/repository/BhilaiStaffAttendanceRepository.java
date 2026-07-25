package com.hrms.modules.bhilai.payroll.repository;

import com.hrms.modules.bhilai.payroll.modles.BhilaiStaffAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BhilaiStaffAttendanceRepository extends JpaRepository<BhilaiStaffAttendance, Long> {
	@Query(value = "SELECT * FROM bhilai.bhilai_staff_attendance WHERE emp_no = :emp_no", nativeQuery = true)
    BhilaiStaffAttendance findByEmpNo(@Param("emp_no")String emp_no);
	
	@Query(value = "SELECT * FROM bhilai.bhilai_staff_attendance WHERE staff_id = :staff_id AND month_name = :month_name AND year = :year", nativeQuery = true)
    BhilaiStaffAttendance findByDetails(@Param("staff_id") Long staff_id, @Param("month_name") String month_name, @Param("year") Integer year);

	@Query(value = "SELECT * FROM bhilai.bhilai_staff_attendance WHERE emp_no = :emp_no AND month_name = :month_name AND year = :year", nativeQuery = true)
    BhilaiStaffAttendance findByEmpNoAndDate(@Param("emp_no")String emp_no, @Param("month_name") String month_name, @Param("year") Integer year);

    @Query(value = "SELECT * FROM bhilai.bhilai_staff_attendance WHERE emp_no = :emp_no", nativeQuery = true)
    List<BhilaiStaffAttendance> findStaffByEmpNo(@Param("emp_no")String emp_no);

    @Modifying
    @Query(value = "DELETE FROM bhilai.bhilai_staff_attendance WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
    void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);
}
