package com.hrms.modules.ho.payroll.serviceImpl;

import com.hrms.modules.dtos.TargetReqToTakeTargetDTO;
import com.hrms.modules.dtos.TargetRequestDTO;
import com.hrms.modules.dtos.TargetResponseDTO;
import com.hrms.modules.ho.hiring.models.HoSalaryStructure;
import com.hrms.modules.ho.hiring.models.HoStaff;
import com.hrms.modules.ho.hiring.repository.HoSalaryStructureRepo;
import com.hrms.modules.ho.hiring.repository.HoStaffRepo;
import com.hrms.modules.ho.payroll.modles.HoStaffTargetDetails;
import com.hrms.modules.ho.payroll.repository.HoStaffTargetDetailsRepository;
import com.hrms.modules.ho.payroll.service.HoStaffTargetDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class HoStaffTargetDetailsServiceImpl implements HoStaffTargetDetailsService {

    @Autowired
    private HoStaffTargetDetailsRepository targetRepo;
    @Autowired
    private HoSalaryStructureRepo salaryRepo;
    @Autowired
    private HoStaffSalaryServicesForRMC detailsService;
    @Autowired
    private HoStaffRepo staffRepo;

    @Override
    public String createTargetDetails(TargetRequestDTO data) {
        StringBuilder response = new StringBuilder();
        Map<Long, BigDecimal> targets = data.getTargets();
        String year = data.getYear();
        String month = data.getMonth();

        targets.forEach((salaryStructureId, target) -> {
            salaryRepo.findById(salaryStructureId).ifPresent(salaryStructure -> {
                HoStaffTargetDetails foundTarget = targetRepo.findByDetails( month, year, salaryStructure.getEmpNo());
                if (foundTarget == null) {
                    // Create a new target record
                    HoStaffTargetDetails details = new HoStaffTargetDetails();
                    details.setTarget(target);
                    details.setMonth(month);
                    details.setYear(year);
                    details.setStaffId(salaryStructure.getStaffId());
                    details.setSsid(salaryStructure.getSsId());
                    details.setGross(salaryStructure.getGross());
                    details.setEmpNo(salaryStructure.getEmpNo());
                    HoStaff staff = staffRepo.findById(salaryStructure.getStaffId()).get();
                    details.setName(staff.getName());
                    HoStaffTargetDetails saved = targetRepo.save(details);
                    if (saved != null) {
                        String result = detailsService.generateSalaryForTargetBased(saved.getStaffId(),Integer.parseInt(year),month,target,saved.getSsid());
                        response.append("Salary generated = ").append(saved.getStaffId()).append("\n");
                    } else {
                        response.append("Failed To Generate = ").append(salaryStructure.getEmpNo()).append("\n");
                    }
                } else {
                    // Update existing target record
                    foundTarget.setTarget(target);
                    foundTarget.setMonth(month);
                    foundTarget.setYear(year);
                    foundTarget.setGross(salaryStructure.getGross());
                    HoStaff staff = staffRepo.findById(salaryStructure.getStaffId()).get();
                    foundTarget.setName(staff.getName());
                    HoStaffTargetDetails updated = targetRepo.save(foundTarget);
                    if (updated != null) {
                        String result = detailsService.generateSalaryForTargetBased(updated.getStaffId(),Integer.parseInt(year),month,target,updated.getSsid());
                        response.append("Salary updated = ").append(updated.getStaffId()).append("\n");
                    } else {
                        response.append("Failed To Update = ").append(salaryStructure.getEmpNo()).append("\n");
                    }
                }
            });
        });

        return response.toString();
    }


    @Override
    public TargetResponseDTO staffStaffDetails(Long zoneId, int page, int size) {
        // Fetch the SalaryStructure page from the repository
        Pageable pageable = PageRequest.of(page, size);
        Page<HoSalaryStructure> resultPage = salaryRepo.staffOnTarget( pageable);
        List<TargetReqToTakeTargetDTO> targetReqList = new ArrayList<>();

        // Loop through the SalaryStructure list and map it to TargetReqToTakeTargetDTO
        for (HoSalaryStructure found : resultPage.getContent()) {
            Optional<HoStaff> optionalStaff = staffRepo.findById(found.getStaffId());

            // If the staff exists, populate the TargetReqToTakeTargetDTO object
            if (optionalStaff.isPresent()) {
                HoStaff foundStaff = optionalStaff.get();
                TargetReqToTakeTargetDTO newResult = new TargetReqToTakeTargetDTO();

                // Map SalaryStructure and Staff data to TargetReqToTakeTargetDTO
                newResult.setSsId(found.getSsId());  // Salary Structure ID
                newResult.setStaffName(foundStaff.getName()); // Staff Name
                newResult.setStructureGross(found.getGross()); // Gross Salary
                newResult.setEmpNo(found.getEmpNo()); // Employee Number

                targetReqList.add(newResult);
            }
        }

        // Prepare the TargetResponseDTO object to hold the final results
        TargetResponseDTO responseDto = new TargetResponseDTO();
        responseDto.setResults(targetReqList); // Set list of target requests
        responseDto.setCount(salaryRepo.countByZoneIdAndIsTargetBasedTrue()); // Set the count based on the zone
        return  responseDto;
    }

}
