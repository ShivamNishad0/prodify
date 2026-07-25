package com.hrms.modules.rmc.payroll.serviceImpl;

import com.hrms.modules.rmc.hiring.models.RmcSalaryStructure;
import com.hrms.modules.rmc.hiring.models.RmcStaff;
import com.hrms.modules.rmc.hiring.repository.RmcSalaryStructureRepo;
import com.hrms.modules.rmc.hiring.repository.RmcStaffRepo;
import com.hrms.modules.rmc.payroll.modles.RmcSalaryEarned;
import com.hrms.modules.rmc.payroll.modles.RmcStaffSalaryDetails;
import com.hrms.modules.rmc.payroll.repository.RmcSalaryEarnedRepository;
import com.hrms.modules.rmc.payroll.service.RmcSalaryEarnedService;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
public class RmcSalaryEarnedServiceImpl implements RmcSalaryEarnedService {

    @Autowired
    private RmcSalaryEarnedRepository salaryEarnedRepository;

    @Autowired
    private RmcStaffRepo staffRepo;

    @Autowired
    private RmcSalaryStructureRepo salaryStructureRepo;

    @Override
    public String finalStaffSalary(RmcStaffSalaryDetails finalSalary) {
        RmcSalaryEarned foundSalary = salaryEarnedRepository.findBydetails(finalSalary.getStaffId(), finalSalary.getMonth(), finalSalary.getYear());
        RmcStaff foundStaff = staffRepo.findById(finalSalary.getStaffId()).get();
        RmcSalaryStructure salaryStructure = salaryStructureRepo.findByStaffId(finalSalary.getStaffId());

        if (salaryStructure == null || foundStaff == null) {
            return Result.FAILED.toString();
        }
        RmcSalaryEarned newSalary = new RmcSalaryEarned();
        RmcSalaryEarned salaryEarned = (foundSalary != null) ? foundSalary : newSalary;

        populateSalaryEarned(salaryEarned, finalSalary, foundStaff, salaryStructure);
        salaryEarnedRepository.save(salaryEarned);

        return (foundSalary != null) ? Result.SALARY_UPDATED.toString() : Result.SUCCESS.toString();
    }

    private void populateSalaryEarned(RmcSalaryEarned salaryEarned, RmcStaffSalaryDetails finalSalary, RmcStaff foundStaff, RmcSalaryStructure salaryStructure) {
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
        salaryEarned.setPfStatus(salaryStructure.getPfStatus());
        salaryEarned.setPfUAN_NO(salaryStructure.getPfUAN_NO());
        salaryEarned.setEsiNo(salaryStructure.getEsiNo());
        salaryEarned.setRemarks(finalSalary.getAdvanceRemark());
        salaryEarned.setApprovBy(finalSalary.getVerifiedBy());
        salaryEarned.setMonth(finalSalary.getMonth());
        salaryEarned.setYear(finalSalary.getYear());
        salaryEarned.setStamp(new Timestamp(System.currentTimeMillis()));
        salaryEarned.setStatus(Status.APPROVED);
    }
}
