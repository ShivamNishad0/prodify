package com.hrms.modules.dmc.payroll.repository;

import com.hrms.modules.dmc.payroll.modles.DmcAttendanceDeatils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DmcAttendanceDeatilsRepository extends JpaRepository<DmcAttendanceDeatils, Long> {
    @Query(value = "SELECT * FROM dmc.dmc_attendance_deatils WHERE staff_id = :staff_id AND month = :month AND year = :year", nativeQuery = true)
    DmcAttendanceDeatils findDetailsByDetails(@Param("staff_id") Long staff_id, @Param("month") String month, @Param("year") String year);
    
    @Query(value = "SELECT * FROM dmc.dmc_attendance_deatils WHERE staff_id = :staff_id", nativeQuery = true)
    DmcAttendanceDeatils findByStaffId(@Param("staff_id")Long staff_id);
    
    @Query(value = "SELECT * FROM dmc.dmc_attendance_deatils WHERE emp_no = :emp_no AND year=:year", nativeQuery = true)
    List<DmcAttendanceDeatils> findByEmpNo(@Param("emp_no")String emp_no, @Param("year")String year);
    
    @Query(value = "SELECT * FROM dmc.dmc_attendance_deatils WHERE staff_id = :staff_id AND month = :month AND year = :year", nativeQuery = true)
    DmcAttendanceDeatils findByDetails(@Param("staff_id")Long staff_id, @Param("month")String month, @Param("year") String year);
    
    @Query(value = "SELECT * FROM dmc.dmc_attendance_deatils WHERE month = :month AND year = :year ORDER BY emp_no", nativeQuery = true)
    Page<DmcAttendanceDeatils> findDetailsByDetailsForView(@Param("month") String month, @Param("year") String year, Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM dmc.dmc_attendance_deatils WHERE month = :month AND year = :year", nativeQuery = true)
    Long countDetailsByDetailsForView( @Param("month") String month, @Param("year") String year);

    @Query(value = "SELECT * FROM dmc.dmc_attendance_deatils WHERE emp_no = :empNo AND month = :month AND year = :year ORDER BY emp_no", nativeQuery = true)
    DmcAttendanceDeatils findAttendanceDetails(@Param("empNo") String empNo, @Param("month") String month, @Param("year") String year);

    @Query(value = "SELECT * FROM dmc.dmc_attendance_deatils WHERE emp_no=:emp_no", nativeQuery = true)
    List<DmcAttendanceDeatils> findByEmpNo(@Param("emp_no") String emp_no);

    @Modifying
    @Query(value = "DELETE FROM dmc.dmc_attendance_deatils WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
    void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);
}
