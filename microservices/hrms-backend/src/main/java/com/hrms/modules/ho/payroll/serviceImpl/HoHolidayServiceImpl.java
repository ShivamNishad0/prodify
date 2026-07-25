package com.hrms.modules.ho.payroll.serviceImpl;

import com.hrms.modules.ho.payroll.modles.HoHoliday;
import com.hrms.modules.ho.payroll.repository.HoHolidayRepo;
import com.hrms.modules.ho.payroll.service.HolidayService;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HoHolidayServiceImpl implements HolidayService {

    @Autowired
    private HoHolidayRepo holiRepo;

    @Override
    public String createHoliday(HoHoliday holiday) {
    	holiday.setStatus(Status.ACTIVE);
        holiRepo.save(holiday);
        return "Holiday created successfully!";
    }

    @Override
    public String updateHoliday(Long id, HoHoliday holiday) {
    	HoHoliday existingHoliday =holiRepo.findById(id).get();
         existingHoliday.setHolidayName(holiday.getHolidayName());
         existingHoliday.setHolidayStart(holiday.getHolidayStart());
         existingHoliday.setHolidayEnd(holiday.getHolidayEnd());
         existingHoliday.setTotalHoliday(holiday.getTotalHoliday());
         existingHoliday.setStatus(holiday.getStatus());
         HoHoliday saved = holiRepo.save(existingHoliday);
         return saved!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
    }

    @Override
    public void deleteHoliday(Long id) {
        holiRepo.deleteById(id);
    }

    @Override
    public List<HoHoliday> getAllHolidays() {
        return holiRepo.findAll();
    }

    @Override
    public Optional<HoHoliday> getHolidayById(Long id) {
        return holiRepo.findById(id);
    }
}
