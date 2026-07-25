package com.hrms.modules.dmc.payroll.serviceImpl;

import com.hrms.modules.dmc.payroll.modles.DmcHoliday;
import com.hrms.modules.dmc.payroll.repository.DmcHolidayRepo;
import com.hrms.modules.dmc.payroll.service.DmcHolidayService;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DmcHolidayServiceImpl implements DmcHolidayService {

    @Autowired
    private DmcHolidayRepo holiRepo;

    @Override
    public String createHoliday(DmcHoliday holiday) {
    	holiday.setStatus(Status.ACTIVE);
        holiRepo.save(holiday);
        return "Holiday created successfully!";
    }

    @Override
    public String updateHoliday(Long id, DmcHoliday holiday) {
    	DmcHoliday existingHoliday =holiRepo.findById(id).get();
         existingHoliday.setHolidayName(holiday.getHolidayName());
         existingHoliday.setHolidayStart(holiday.getHolidayStart());
         existingHoliday.setHolidayEnd(holiday.getHolidayEnd());
         existingHoliday.setTotalHoliday(holiday.getTotalHoliday());
         existingHoliday.setStatus(holiday.getStatus());
         DmcHoliday saved = holiRepo.save(existingHoliday);
         return saved!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
    }

    @Override
    public void deleteHoliday(Long id) {
        holiRepo.deleteById(id);
    }

    @Override
    public List<DmcHoliday> getAllHolidays() {
        return holiRepo.findAll();
    }

    @Override
    public Optional<DmcHoliday> getHolidayById(Long id) {
        return holiRepo.findById(id);
    }
}
