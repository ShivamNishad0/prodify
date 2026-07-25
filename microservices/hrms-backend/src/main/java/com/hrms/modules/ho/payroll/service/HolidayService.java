package com.hrms.modules.ho.payroll.service;


import com.hrms.modules.ho.payroll.modles.HoHoliday;

import java.util.List;
import java.util.Optional;

public interface HolidayService {
	  String createHoliday(HoHoliday holiday);
	   String updateHoliday(Long id, HoHoliday holiday);
	    void deleteHoliday(Long id);
	    List<HoHoliday> getAllHolidays();
	    Optional<HoHoliday> getHolidayById(Long id);
}
