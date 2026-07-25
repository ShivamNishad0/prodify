package com.hrms.modules.bijli.payroll.repository;

import com.hrms.modules.bijli.payroll.modles.BijliAttendanceDeatils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BijliAttendanceDeatilsRepository extends JpaRepository<BijliAttendanceDeatils, Long> {
    @Query(value = "SELECT * FROM bijli.bijli_attendance_deatils WHERE staff_id = :staff_id AND month = :month AND year = :year", nativeQuery = true)
    BijliAttendanceDeatils findDetailsByDetails(@Param("staff_id") Long staff_id, @Param("month") String month, @Param("year") String year);
    
    @Query(value = "SELECT * FROM bijli.bijli_attendance_deatils WHERE staff_id = :staff_id", nativeQuery = true)
    BijliAttendanceDeatils findByStaffId(@Param("staff_id")Long staff_id);
    
    @Query(value = "SELECT * FROM bijli.bijli_attendance_deatils WHERE emp_no = :emp_no AND year=:year", nativeQuery = true)
    List<BijliAttendanceDeatils> findByEmpNo(@Param("emp_no")String emp_no, @Param("year")String year);
    
    @Query(value = "SELECT * FROM bijli.bijli_attendance_deatils WHERE staff_id = :staff_id AND month = :month AND year = :year", nativeQuery = true)
    BijliAttendanceDeatils findByDetails(@Param("staff_id")Long staff_id, @Param("month")String month, @Param("year") String year);
    
    @Query(value = "SELECT * FROM bijli.bijli_attendance_deatils WHERE month = :month AND year = :year ORDER BY emp_no", nativeQuery = true)
    Page<BijliAttendanceDeatils> findDetailsByDetailsForView(@Param("month") String month, @Param("year") String year, Pageable pageable);

    @Query(value = "SELECT * FROM bijli.bijli_attendance_deatils WHERE month = :month AND year = :year AND emp_no LIKE %:emp_no% ORDER BY emp_no", nativeQuery = true)
    Page<BijliAttendanceDeatils> findDetailsByEmpDetailsForView(@Param("month") String month, @Param("year") String year, @Param("emp_no") String emp_no, Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM bijli.bijli_attendance_deatils WHERE month = :month AND year = :year", nativeQuery = true)
    Long countDetailsByDetailsForView( @Param("month") String month, @Param("year") String year);

//    @Query(value = "SELECT * FROM bijli.bijli_attendance_deatils WHERE emp_no = :emp_no AND month = :month AND year = :year", nativeQuery = true)
//    BijliAttendanceDeatils findDetailsByDetails(@Param("emp_no") String emp_no, @Param("month") String month, @Param("year") String year);

    @Query(value = "SELECT * FROM bijli.bijli_attendance_deatils WHERE emp_no =:emp_no AND month =:month AND year =:year", nativeQuery = true)
    BijliAttendanceDeatils findDetailsByDetails(@Param("emp_no") String empNo,
                                                @Param("month") String month,
                                                @Param("year") String year);

    @Query(value = "SELECT * FROM bijli.bijli_attendance_deatils WHERE emp_no = :empNo AND month = :month AND year = :year", nativeQuery = true)
    BijliAttendanceDeatils findAttendanceDetails(@Param("empNo") String empNo, @Param("month") String month, @Param("year") String year);

    @Query(value = "SELECT * FROM bijli.bijli_attendance_deatils WHERE emp_no=:emp_no", nativeQuery = true)
    List<BijliAttendanceDeatils> findByEmpNo(@Param("emp_no") String emp_no);

    @Modifying
    @Query(value = "DELETE FROM bijli.bijli_attendance_deatils WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
    void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);
}
