package com.hrms.modules.bijli.payroll.serviceImpl;

import com.hrms.modules.bijli.hiring.models.BijliSalaryStructure;
import com.hrms.modules.bijli.hiring.models.BijliStaff;
import com.hrms.modules.bijli.hiring.repository.BijliSalaryStructureRepo;
import com.hrms.modules.bijli.hiring.repository.BijliStaffRepo;
import com.hrms.modules.bijli.payroll.modles.BijliSalaryEarned;
import com.hrms.modules.bijli.payroll.modles.BijliStaffSalaryDetails;
import com.hrms.modules.bijli.payroll.repository.BijliSalaryEarnedRepository;
import com.hrms.modules.bijli.payroll.service.BijliSalaryEarnedService;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
public class BijliSalaryEarnedServiceImpl implements BijliSalaryEarnedService {

    @Autowired
    private BijliSalaryEarnedRepository salaryEarnedRepository;

    @Autowired
    private BijliStaffRepo staffRepo;

    @Autowired
    private BijliSalaryStructureRepo bijliSalaryStructureRepo;

    @Override
    public String finalStaffSalary(BijliStaffSalaryDetails finalSalary) {
        BijliSalaryEarned foundSalary = salaryEarnedRepository.findBydetails(finalSalary.getStaffId(), finalSalary.getMonth(), finalSalary.getYear());
        BijliStaff foundStaff = staffRepo.findById(finalSalary.getStaffId()).get();
        BijliSalaryStructure bijliSalaryStructure = bijliSalaryStructureRepo.findByStaffId(finalSalary.getStaffId());

        if (bijliSalaryStructure == null || foundStaff == null) {
            return Result.FAILED.toString();
        }
        BijliSalaryEarned newSalary = new BijliSalaryEarned();
        BijliSalaryEarned salaryEarned = (foundSalary != null) ? foundSalary : newSalary;

        populateSalaryEarned(salaryEarned, finalSalary, foundStaff, bijliSalaryStructure);
        salaryEarnedRepository.save(salaryEarned);

        return (foundSalary != null) ? Result.SALARY_UPDATED.toString() : Result.SUCCESS.toString();
    }

    private void populateSalaryEarned(BijliSalaryEarned salaryEarned, BijliStaffSalaryDetails finalSalary, BijliStaff foundStaff, BijliSalaryStructure bijliSalaryStructure) {
        salaryEarned.setStaffId(finalSalary.getStaffId());
        salaryEarned.setEmpNo(finalSalary.getEmpNo());
        salaryEarned.setStaffImg(foundStaff.getStaffImg());
        salaryEarned.setDa(finalSalary.getDa());
        salaryEarned.setBasic(finalSalary.getBasic());
        salaryEarned.setHra(finalSalary.getHra());
        salaryEarned.setConv_Oth(finalSalary.getConv_or_Other());
        salaryEarned.setGross(finalSalary.getGross());
        salaryEarned.setAdditional(finalSalary.getAdditional());
        salaryEarned.setNetPaid(finalSalary.getNetPaid());
        salaryEarned.setPf(finalSalary.getEmpPF());
        salaryEarned.setEsi(finalSalary.getEmpESI());
        salaryEarned.setTds(finalSalary.getTds());
        salaryEarned.setTotalDay(finalSalary.getTotalNoDay());
        salaryEarned.setPfStatus(bijliSalaryStructure.getPfStatus());
        salaryEarned.setPfUAN_NO(bijliSalaryStructure.getPfUAN_NO());
        salaryEarned.setEsiNo(bijliSalaryStructure.getEsiNo());
        salaryEarned.setRemarks(finalSalary.getAdvanceRemark());
        salaryEarned.setApprovBy(finalSalary.getVerifiedBy());
        salaryEarned.setMonth(finalSalary.getMonth());
        salaryEarned.setYear(finalSalary.getYear());
        salaryEarned.setStamp(new Timestamp(System.currentTimeMillis()));
        salaryEarned.setStatus(Status.APPROVED);
    }
}
