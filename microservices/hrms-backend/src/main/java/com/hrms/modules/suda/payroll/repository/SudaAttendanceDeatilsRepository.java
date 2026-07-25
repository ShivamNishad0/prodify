package com.hrms.modules.suda.payroll.repository;

import com.hrms.modules.suda.payroll.modles.SudaAttendanceDeatils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SudaAttendanceDeatilsRepository extends JpaRepository<SudaAttendanceDeatils, Long> {
    @Query(value = "SELECT * FROM suda.suda_attendance_deatils WHERE staff_id = :staff_id AND month = :month AND year = :year", nativeQuery = true)
    SudaAttendanceDeatils findDetailsByDetails(@Param("staff_id") Long staff_id, @Param("month") String month, @Param("year") String year);
    
    @Query(value = "SELECT * FROM suda.suda_attendance_deatils WHERE staff_id = :staff_id", nativeQuery = true)
    SudaAttendanceDeatils findByStaffId(@Param("staff_id")Long staff_id);
    
    @Query(value = "SELECT * FROM suda.suda_attendance_deatils WHERE emp_no = :emp_no AND year=:year ORDER BY emp_no", nativeQuery = true)
    List<SudaAttendanceDeatils> findByEmpNo(@Param("emp_no")String emp_no, @Param("year")String year);

    @Query(value = "SELECT * FROM suda.suda_attendance_deatils WHERE emp_no = :emp_no AND month=:month AND year=:year", nativeQuery = true)
    SudaAttendanceDeatils findByEmpNo(@Param("emp_no")String emp_no,@Param("month") String month, @Param("year")String year);

    @Query(value = "SELECT * FROM suda.suda_attendance_deatils WHERE staff_id = :staff_id AND month = :month AND year = :year", nativeQuery = true)
    SudaAttendanceDeatils findByDetails(@Param("staff_id")Long staff_id, @Param("month")String month, @Param("year") String year);
    
    @Query(value = "SELECT * FROM suda.suda_attendance_deatils WHERE month = :month AND year = :year ORDER BY emp_no", nativeQuery = true)
    Page<SudaAttendanceDeatils> findDetailsByDetailsForView(@Param("month") String month, @Param("year") String year, Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM suda.suda_attendance_deatils WHERE month = :month AND year = :year", nativeQuery = true)
    Long countDetailsByDetailsForView( @Param("month") String month, @Param("year") String year);

    @Query(value = "SELECT * FROM suda.suda_attendance_deatils WHERE emp_no=:emp_no ORDER BY emp_no", nativeQuery = true)
    List<SudaAttendanceDeatils> findByEmpNo(@Param("emp_no") String emp_no);

    @Query(value = "SELECT * FROM suda.suda_attendance_deatils WHERE emp_no = :empNo AND month = :month AND year = :year", nativeQuery = true)
    SudaAttendanceDeatils findAttendanceDetails(@Param("empNo") String empNo, @Param("month") String month, @Param("year") String year);

    @Modifying
    @Query(value = "DELETE FROM suda.suda_attendance_deatils WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
    void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);
}
