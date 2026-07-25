package com.hrms.modules.bijli.payroll.repository;

import com.hrms.modules.bijli.payroll.modles.BijliHoliday;
import com.hrms.modules.ho.payroll.modles.HoHoliday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;

public interface BijliHolidayRepo extends JpaRepository<BijliHoliday, Long>{

    @Query(value = "SELECT * FROM  bijli.bijli_holiday WHERE holiday_start=:holiday_start",nativeQuery = true)
    BijliHoliday findByholidayStart(@Param("holiday_start") Date holiday_start);

}
