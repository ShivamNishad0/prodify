package com.hrms.modules.dmc.payroll.serviceImpl;

import com.hrms.modules.dmc.hiring.models.DmcSalaryStructure;
import com.hrms.modules.dmc.hiring.models.DmcStaff;
import com.hrms.modules.dmc.hiring.repository.DmcSalaryStructureRepo;
import com.hrms.modules.dmc.hiring.repository.DmcStaffRepo;
import com.hrms.modules.dmc.payroll.modles.DmcSalaryEarned;
import com.hrms.modules.dmc.payroll.modles.DmcStaffSalaryDetails;
import com.hrms.modules.dmc.payroll.repository.DmcSalaryEarnedRepository;
import com.hrms.modules.dmc.payroll.service.DmcSalaryEarnedService;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
public class DmcSalaryEarnedServiceImpl implements DmcSalaryEarnedService {

    @Autowired
    private DmcSalaryEarnedRepository salaryEarnedRepository;

    @Autowired
    private DmcStaffRepo staffRepo;

    @Autowired
    private DmcSalaryStructureRepo salaryStructureRepo;

    @Override
    public String finalStaffSalary(DmcStaffSalaryDetails finalSalary) {
        DmcSalaryEarned foundSalary = salaryEarnedRepository.findBydetails(finalSalary.getStaffId(), finalSalary.getMonth(), finalSalary.getYear());
        DmcStaff foundStaff = staffRepo.findById(finalSalary.getStaffId()).get();
        DmcSalaryStructure salaryStructure = salaryStructureRepo.findByStaffId(finalSalary.getStaffId());

        if (salaryStructure == null || foundStaff == null) {
            return Result.FAILED.toString();
        }
        DmcSalaryEarned newSalary = new DmcSalaryEarned();
        DmcSalaryEarned salaryEarned = (foundSalary != null) ? foundSalary : newSalary;

        populateSalaryEarned(salaryEarned, finalSalary, foundStaff, salaryStructure);
        salaryEarnedRepository.save(salaryEarned);

        return (foundSalary != null) ? Result.SALARY_UPDATED.toString() : Result.SUCCESS.toString();
    }

    private void populateSalaryEarned(DmcSalaryEarned salaryEarned, DmcStaffSalaryDetails finalSalary, DmcStaff foundStaff, DmcSalaryStructure salaryStructure) {
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
