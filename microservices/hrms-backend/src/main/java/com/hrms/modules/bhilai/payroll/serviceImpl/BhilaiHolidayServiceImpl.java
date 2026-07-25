package com.hrms.modules.bhilai.payroll.serviceImpl;

import com.hrms.modules.bhilai.payroll.modles.BhilaiHoliday;
import com.hrms.modules.bhilai.payroll.repository.BhilaiHolidayRepo;
import com.hrms.modules.bhilai.payroll.service.BhilaiHolidayService;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BhilaiHolidayServiceImpl implements BhilaiHolidayService {

    @Autowired
    private BhilaiHolidayRepo holiRepo;

    @Override
    public String createHoliday(BhilaiHoliday bhilaiHoliday) {
    	bhilaiHoliday.setStatus(Status.ACTIVE);
        holiRepo.save(bhilaiHoliday);
        return "Holiday created successfully!";
    }

    @Override
    public String updateHoliday(Long id, BhilaiHoliday bhilaiHoliday) {
    	BhilaiHoliday existingBhilaiHoliday =holiRepo.findById(id).get();
         existingBhilaiHoliday.setHolidayName(bhilaiHoliday.getHolidayName());
         existingBhilaiHoliday.setHolidayStart(bhilaiHoliday.getHolidayStart());
         existingBhilaiHoliday.setHolidayEnd(bhilaiHoliday.getHolidayEnd());
         existingBhilaiHoliday.setTotalHoliday(bhilaiHoliday.getTotalHoliday());
         existingBhilaiHoliday.setStatus(bhilaiHoliday.getStatus());
         BhilaiHoliday saved = holiRepo.save(existingBhilaiHoliday);
         return saved!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
    }

    @Override
    public void deleteHoliday(Long id) {
        holiRepo.deleteById(id);
    }

    @Override
    public List<BhilaiHoliday> getAllHolidays() {
        return holiRepo.findAll();
    }

    @Override
    public Optional<BhilaiHoliday> getHolidayById(Long id) {
        return holiRepo.findById(id);
    }
}
