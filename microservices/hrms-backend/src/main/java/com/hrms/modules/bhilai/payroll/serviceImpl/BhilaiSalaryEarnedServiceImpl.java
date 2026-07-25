package com.hrms.modules.bhilai.payroll.serviceImpl;

import com.hrms.modules.bhilai.hiring.models.BhilaiSalaryStructure;
import com.hrms.modules.bhilai.hiring.models.BhilaiStaff;
import com.hrms.modules.bhilai.hiring.repository.BhilaiSalaryStructureRepo;
import com.hrms.modules.bhilai.hiring.repository.BhilaiStaffRepo;
import com.hrms.modules.bhilai.payroll.modles.BhilaiSalaryEarned;
import com.hrms.modules.bhilai.payroll.modles.BhilaiStaffSalaryDetails;
import com.hrms.modules.bhilai.payroll.repository.BhilaiSalaryEarnedRepository;
import com.hrms.modules.bhilai.payroll.service.BhilaiSalaryEarnedService;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
public class BhilaiSalaryEarnedServiceImpl implements BhilaiSalaryEarnedService {

    @Autowired
    private BhilaiSalaryEarnedRepository bhilaiSalaryEarnedRepository;

    @Autowired
    private BhilaiStaffRepo bhilaiStaffRepo;

    @Autowired
    private BhilaiSalaryStructureRepo bhilaiSalaryStructureRepo;

    @Override
    public String finalStaffSalary(BhilaiStaffSalaryDetails finalSalary) {
        BhilaiSalaryEarned foundSalary = bhilaiSalaryEarnedRepository.findBydetails(finalSalary.getStaffId(), finalSalary.getMonth(), finalSalary.getYear());
        BhilaiStaff foundBhilaiStaff = bhilaiStaffRepo.findById(finalSalary.getStaffId()).get();
        BhilaiSalaryStructure bhilaiSalaryStructure = bhilaiSalaryStructureRepo.findByStaffId(finalSalary.getStaffId());

        if (bhilaiSalaryStructure == null || foundBhilaiStaff == null) {
            return Result.FAILED.toString();
        }
        BhilaiSalaryEarned newSalary = new BhilaiSalaryEarned();
        BhilaiSalaryEarned bhilaiSalaryEarned = (foundSalary != null) ? foundSalary : newSalary;

        populateSalaryEarned(bhilaiSalaryEarned, finalSalary, foundBhilaiStaff, bhilaiSalaryStructure);
        bhilaiSalaryEarnedRepository.save(bhilaiSalaryEarned);

        return (foundSalary != null) ? Result.SALARY_UPDATED.toString() : Result.SUCCESS.toString();
    }

    private void populateSalaryEarned(BhilaiSalaryEarned bhilaiSalaryEarned, BhilaiStaffSalaryDetails finalSalary, BhilaiStaff foundBhilaiStaff, BhilaiSalaryStructure bhilaiSalaryStructure) {
        bhilaiSalaryEarned.setStaffId(finalSalary.getStaffId());
        bhilaiSalaryEarned.setEmpNo(finalSalary.getEmpNo());
        bhilaiSalaryEarned.setStaffImg(foundBhilaiStaff.getStaffImg());
        bhilaiSalaryEarned.setDa(finalSalary.getDa());
        bhilaiSalaryEarned.setBasic(finalSalary.getBasic());
        bhilaiSalaryEarned.setHra(finalSalary.getHra());
        bhilaiSalaryEarned.setConv_Oth(finalSalary.getConv_or_Other());
        bhilaiSalaryEarned.setGross(finalSalary.getGross());
        bhilaiSalaryEarned.setAdditional(finalSalary.getAdditional());
        bhilaiSalaryEarned.setNetPaid(finalSalary.getNetPaid());
        bhilaiSalaryEarned.setPf(finalSalary.getEmpPF());
        bhilaiSalaryEarned.setEsi(finalSalary.getEmpESI());
        bhilaiSalaryEarned.setTds(finalSalary.getTds());
        bhilaiSalaryEarned.setTotalDay(finalSalary.getTotalNoDay());
        bhilaiSalaryEarned.setPfStatus(bhilaiSalaryStructure.getPfStatus());
        bhilaiSalaryEarned.setPfUAN_NO(bhilaiSalaryStructure.getPfUAN_NO());
        bhilaiSalaryEarned.setEsiNo(bhilaiSalaryStructure.getEsiNo());
        bhilaiSalaryEarned.setRemarks(finalSalary.getAdvanceRemark());
        bhilaiSalaryEarned.setApprovBy(finalSalary.getVerifiedBy());
        bhilaiSalaryEarned.setMonth(finalSalary.getMonth());
        bhilaiSalaryEarned.setYear(finalSalary.getYear());
        bhilaiSalaryEarned.setStamp(new Timestamp(System.currentTimeMillis()));
        bhilaiSalaryEarned.setStatus(Status.APPROVED);
    }
}
