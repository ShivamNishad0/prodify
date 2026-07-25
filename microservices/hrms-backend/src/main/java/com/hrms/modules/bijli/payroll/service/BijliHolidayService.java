package com.hrms.modules.bijli.payroll.service;


import com.hrms.modules.bijli.payroll.modles.BijliHoliday;

import java.util.List;
import java.util.Optional;

public interface BijliHolidayService {
	  String createHoliday(BijliHoliday holiday);
	   String updateHoliday(Long id, BijliHoliday holiday);
	    void deleteHoliday(Long id);
	    List<BijliHoliday> getAllHolidays();
	    Optional<BijliHoliday> getHolidayById(Long id);
}
