package com.hrms.modules.suda.payroll.serviceImpl;

import com.hrms.modules.suda.hiring.models.SudaSalaryStructure;
import com.hrms.modules.suda.hiring.models.SudaStaff;
import com.hrms.modules.suda.hiring.repository.SudaSalaryStructureRepo;
import com.hrms.modules.suda.hiring.repository.SudaStaffRepo;
import com.hrms.modules.suda.payroll.modles.SudaSalaryEarned;
import com.hrms.modules.suda.payroll.modles.SudaStaffSalaryDetails;
import com.hrms.modules.suda.payroll.repository.SudaSalaryEarnedRepository;
import com.hrms.modules.suda.payroll.service.SudaSalaryEarnedService;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
public class SudaSalaryEarnedServiceImpl implements SudaSalaryEarnedService {

    @Autowired
    private SudaSalaryEarnedRepository salaryEarnedRepository;

    @Autowired
    private SudaStaffRepo staffRepo;

    @Autowired
    private SudaSalaryStructureRepo salaryStructureRepo;

    @Override
    public String finalStaffSalary(SudaStaffSalaryDetails finalSalary) {
        SudaSalaryEarned foundSalary = salaryEarnedRepository.findBydetails(finalSalary.getStaffId(), finalSalary.getMonth(), finalSalary.getYear());
        SudaStaff foundStaff = staffRepo.findById(finalSalary.getStaffId()).get();
        SudaSalaryStructure salaryStructure = salaryStructureRepo.findByStaffId(finalSalary.getStaffId());

        if (salaryStructure == null || foundStaff == null) {
            return Result.FAILED.toString();
        }
        SudaSalaryEarned newSalary = new SudaSalaryEarned();
        SudaSalaryEarned salaryEarned = (foundSalary != null) ? foundSalary : newSalary;

        populateSalaryEarned(salaryEarned, finalSalary, foundStaff, salaryStructure);
        salaryEarnedRepository.save(salaryEarned);

        return (foundSalary != null) ? Result.SALARY_UPDATED.toString() : Result.SUCCESS.toString();
    }

    private void populateSalaryEarned(SudaSalaryEarned salaryEarned, SudaStaffSalaryDetails finalSalary, SudaStaff foundStaff, SudaSalaryStructure salaryStructure) {
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
