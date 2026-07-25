package com.hrms.modules.ho.payroll.serviceImpl;

import com.hrms.modules.ho.hiring.models.HoSalaryStructure;
import com.hrms.modules.ho.hiring.models.HoStaff;
import com.hrms.modules.ho.hiring.repository.HoSalaryStructureRepo;
import com.hrms.modules.ho.hiring.repository.HoStaffRepo;
import com.hrms.modules.ho.payroll.modles.HoSalaryEarned;
import com.hrms.modules.ho.payroll.modles.HoStaffSalaryDetails;
import com.hrms.modules.ho.payroll.repository.HoSalaryEarnedRepository;
import com.hrms.modules.ho.payroll.service.HoSalaryEarnedService;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
public class HoSalaryEarnedServiceImpl implements HoSalaryEarnedService {

    @Autowired
    private HoSalaryEarnedRepository salaryEarnedRepository;

    @Autowired
    private HoStaffRepo staffRepo;

    @Autowired
    private HoSalaryStructureRepo salaryStructureRepo;

    @Override
    public String finalStaffSalary(HoStaffSalaryDetails finalSalary) {
        HoSalaryEarned foundSalary = salaryEarnedRepository.findBydetails(finalSalary.getStaffId(), finalSalary.getMonth(), finalSalary.getYear());
        HoStaff foundStaff = staffRepo.findById(finalSalary.getStaffId()).get();
        HoSalaryStructure salaryStructure = salaryStructureRepo.findByStaffId(finalSalary.getStaffId());

        if (salaryStructure == null || foundStaff == null) {
            return Result.FAILED.toString();
        }
        HoSalaryEarned newSalary = new HoSalaryEarned();
        HoSalaryEarned salaryEarned = (foundSalary != null) ? foundSalary : newSalary;

        populateSalaryEarned(salaryEarned, finalSalary, foundStaff, salaryStructure);
        salaryEarnedRepository.save(salaryEarned);

        return (foundSalary != null) ? Result.SALARY_UPDATED.toString() : Result.SUCCESS.toString();
    }

    private void populateSalaryEarned(HoSalaryEarned salaryEarned, HoStaffSalaryDetails finalSalary, HoStaff foundStaff, HoSalaryStructure salaryStructure) {
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
