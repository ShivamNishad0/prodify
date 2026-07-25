package com.hrms.modules.bhilai.payroll.service;


import com.hrms.modules.bhilai.payroll.modles.BhilaiHoliday;

import java.util.List;
import java.util.Optional;

public interface BhilaiHolidayService {
	  String createHoliday(BhilaiHoliday bhilaiHoliday);
	   String updateHoliday(Long id, BhilaiHoliday bhilaiHoliday);
	    void deleteHoliday(Long id);
	    List<BhilaiHoliday> getAllHolidays();
	    Optional<BhilaiHoliday> getHolidayById(Long id);
}
