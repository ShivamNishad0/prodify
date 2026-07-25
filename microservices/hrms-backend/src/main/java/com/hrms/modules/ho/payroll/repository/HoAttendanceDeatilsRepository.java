package com.hrms.modules.ho.payroll.repository;

import com.hrms.modules.ho.payroll.modles.HoAttendanceDeatils;
import com.hrms.modules.ho.payroll.modles.HoStaffAttendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HoAttendanceDeatilsRepository extends JpaRepository<HoAttendanceDeatils, Long> {
    @Query(value = "SELECT * FROM ho.ho_attendance_deatils WHERE staff_id = :staff_id AND month = :month AND year = :year", nativeQuery = true)
    HoAttendanceDeatils findDetailsByDetails(@Param("staff_id") Long staff_id, @Param("month") String month, @Param("year") String year);

    @Query(value = "SELECT * FROM ho.ho_attendance_deatils WHERE emp_no = :empNo AND month = :month AND year = :year", nativeQuery = true)
    HoAttendanceDeatils findByEmpNoAndMonthAndYear(
            @Param("empNo") String empNo,
            @Param("month") String month,
            @Param("year") String year
    );

    @Query(value = "SELECT * FROM ho.ho_attendance_deatils WHERE staff_id = :staff_id", nativeQuery = true)
    HoAttendanceDeatils findByStaffId(@Param("staff_id")Long staff_id);
    
    @Query(value = "SELECT * FROM ho.ho_attendance_deatils WHERE emp_no = :emp_no AND year=:year", nativeQuery = true)
    List<HoAttendanceDeatils> findByEmpNo(@Param("emp_no")String emp_no, @Param("year")String year);
    
    @Query(value = "SELECT * FROM ho.ho_attendance_deatils WHERE staff_id = :staff_id AND month = :month AND year = :year", nativeQuery = true)
    HoAttendanceDeatils findByDetails(@Param("staff_id")Long staff_id, @Param("month")String month, @Param("year") String year);
    
    @Query(value = "SELECT * FROM ho.ho_attendance_deatils WHERE month = :month AND year = :year ORDER BY emp_no", nativeQuery = true)
    Page<HoAttendanceDeatils> findDetailsByDetailsForView(@Param("month") String month, @Param("year") String year, Pageable pageable);

    @Query(value = "SELECT * FROM ho.ho_attendance_deatils WHERE month = :month AND year = :year AND emp_no LIKE CONCAT('%', :emp_no, '%') ORDER BY emp_no", nativeQuery = true)
    Page<HoAttendanceDeatils> findDetailsByDetailsForView(@Param("month") String month, @Param("year") String year, @Param("emp_no") String emp_no,Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM ho.ho_attendance_deatils WHERE month = :month AND year = :year", nativeQuery = true)
    Long countDetailsByDetailsForView( @Param("month") String month, @Param("year") String year);

    @Query(value = "SELECT COUNT(*) FROM ho.ho_attendance_deatils WHERE month = :month AND year = :year AND emp_no LIKE CONCAT('%', :emp_no, '%')", nativeQuery = true)
    Long countDetailsByDetailsForView( @Param("month") String month, @Param("year") String year,@Param("emp_no") String emp_no);

    @Query(value = "SELECT * FROM ho.ho_attendance_deatils WHERE emp_no LIKE CONCAT('%', :emp_no, '%') AND month = :month AND year = :year", nativeQuery = true)
    Page<HoAttendanceDeatils> findByLikeEmpNoAndDate(@Param("emp_no") String emp_no, @Param("month") String month, @Param("year") String year, Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM ho.ho_attendance_deatils WHERE emp_no LIKE CONCAT('%', :emp_no, '%') AND month = :month AND year = :year", nativeQuery = true)
    long countByEmpNoAndDate(@Param("emp_no") String emp_no, @Param("month") String month_name, @Param("year") String year);

    @Query(value = "SELECT * FROM ho.ho_attendance_deatils WHERE month = :month AND year=:year", nativeQuery = true)
    List<HoAttendanceDeatils> findByMonth(@Param("month")String month, @Param("year")String year);

    @Query(value = "SELECT * FROM ho.ho_attendance_deatils WHERE emp_no=:emp_no",nativeQuery = true)
    List<HoAttendanceDeatils> findByEmpNo(@Param("emp_no")String emp_no);

    @Modifying
    @Query(value = "DELETE FROM ho.ho_attendance_deatils WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
    void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);
}
