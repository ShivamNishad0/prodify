package com.hrms.modules.ho.payroll.repository;

import com.hrms.modules.ho.payroll.modles.HoHoliday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;

public interface HoHolidayRepo extends JpaRepository<HoHoliday, Long>{

    @Query(value = "SELECT * FROM  ho.ho_holiday WHERE holiday_start=:holiday_start",nativeQuery = true)
    HoHoliday findByholidayStart(@Param("holiday_start")Date holiday_start);
}
