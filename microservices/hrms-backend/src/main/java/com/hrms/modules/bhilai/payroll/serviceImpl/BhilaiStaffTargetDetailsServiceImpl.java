package com.hrms.modules.bhilai.payroll.serviceImpl;


import com.hrms.modules.bhilai.hiring.models.BhilaiSalaryStructure;
import com.hrms.modules.bhilai.hiring.models.BhilaiStaff;
import com.hrms.modules.bhilai.hiring.repository.BhilaiSalaryStructureRepo;
import com.hrms.modules.bhilai.hiring.repository.BhilaiStaffRepo;
import com.hrms.modules.bhilai.payroll.modles.BhilaiStaffTargetDetails;
import com.hrms.modules.bhilai.payroll.repository.BhilaiStaffTargetDetailsRepository;
import com.hrms.modules.bhilai.payroll.service.BhilaiStaffTargetDetailsService;
import com.hrms.modules.dtos.TargetReqToTakeTargetDTO;
import com.hrms.modules.dtos.TargetRequestDTO;
import com.hrms.modules.dtos.TargetResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class BhilaiStaffTargetDetailsServiceImpl implements BhilaiStaffTargetDetailsService {

    @Autowired
    private BhilaiStaffTargetDetailsRepository targetRepo;
    @Autowired
    private BhilaiSalaryStructureRepo salaryRepo;
    @Autowired
    private BhilaiStaffSalaryServicesForRMC detailsService;
    @Autowired
    private BhilaiStaffRepo bhilaiStaffRepo;

    @Override
    public String createTargetDetails(TargetRequestDTO data) {
        StringBuilder response = new StringBuilder();
        Map<Long, BigDecimal> targets = data.getTargets();
        String year = data.getYear();
        String month = data.getMonth();

        targets.forEach((salaryStructureId, target) -> {
            salaryRepo.findById(salaryStructureId).ifPresent(salaryStructure -> {
                BhilaiStaffTargetDetails foundTarget = targetRepo.findByDetails( month, year, salaryStructure.getEmpNo());
                if (foundTarget == null) {
                    // Create a new target record
                    BhilaiStaffTargetDetails details = new BhilaiStaffTargetDetails();
                    details.setTarget(target);
                    details.setMonth(month);
                    details.setYear(year);
                    details.setStaffId(salaryStructure.getStaffId());
                    details.setSsid(salaryStructure.getSsId());
                    details.setGross(salaryStructure.getGross());
                    details.setEmpNo(salaryStructure.getEmpNo());
                    BhilaiStaff bhilaiStaff = bhilaiStaffRepo.findById(salaryStructure.getStaffId()).get();
                    details.setName(bhilaiStaff.getName());
                    BhilaiStaffTargetDetails saved = targetRepo.save(details);
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
                    BhilaiStaff bhilaiStaff = bhilaiStaffRepo.findById(salaryStructure.getStaffId()).get();
                    foundTarget.setName(bhilaiStaff.getName());
                    BhilaiStaffTargetDetails updated = targetRepo.save(foundTarget);
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


//    @Override
//    public TargetResponseDTO staffStaffDetails(Long zoneId, int page, int size) {
//        // Fetch the SalaryStructure page from the repository
//        Pageable pageable = PageRequest.of(page, size);
//        Page<BhilaiSalaryStructure> resultPage = salaryRepo.staffOnTarget( pageable);
//        List<TargetReqToTakeTargetDTO> targetReqList = new ArrayList<>();
//
//        // Loop through the SalaryStructure list and map it to TargetReqToTakeTargetDTO
//        for (BhilaiSalaryStructure found : resultPage.getContent()) {
//            Optional<BhilaiStaff> optionalStaff = bhilaiStaffRepo.findById(found.getStaffId());
//
//            // If the staff exists, populate the TargetReqToTakeTargetDTO object
//            if (optionalStaff.isPresent()) {
//                BhilaiStaff foundBhilaiStaff = optionalStaff.get();
//                TargetReqToTakeTargetDTO newResult = new TargetReqToTakeTargetDTO();
//
//                // Map SalaryStructure and Staff data to TargetReqToTakeTargetDTO
//                newResult.setSsId(found.getSsId());  // Salary Structure ID
//                newResult.setStaffName(foundBhilaiStaff.getName()); // Staff Name
//                newResult.setStructureGross(found.getGross()); // Gross Salary
//                newResult.setEmpNo(found.getEmpNo()); // Employee Number
//
//                targetReqList.add(newResult);
//            }
//        }
//
//        // Prepare the TargetResponseDTO object to hold the final results
//        TargetResponseDTO responseDto = new TargetResponseDTO();
//        responseDto.setResults(targetReqList); // Set list of target requests
//        responseDto.setCount(salaryRepo.countByZoneIdAndIsTargetBasedTrue()); // Set the count based on the zone
//        return  responseDto;
//    }


    @Override
    public TargetResponseDTO staffStaffDetails(String[] areaId, String month, String year, String emp_no, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<TargetReqToTakeTargetDTO> targetReqList = new ArrayList<>();
        TargetResponseDTO responseDto = new TargetResponseDTO();
        Long[] area = (areaId != null && areaId.length > 0)
                ? Arrays.stream(areaId).map(Long::parseLong).toArray(Long[]::new)
                : new Long[0];

        Page<BhilaiSalaryStructure> resultPage;
        long count;
        String empNo  = emp_no==null?"":emp_no;

        if (area.length > 0 && !empNo.isEmpty()) {
            resultPage = salaryRepo.staffOnTargetWithEmpNo(area, empNo, pageable);
            count = resultPage.getTotalElements();
        } else if (area.length > 0) {
            resultPage = salaryRepo.staffOnTarget(area, pageable);
            count = resultPage.getTotalElements();
        } else if (!empNo.isEmpty()) {
            resultPage = salaryRepo.staffOnTargetByEmpNo(empNo, pageable);
            count = resultPage.getTotalElements();
        } else {
            resultPage = salaryRepo.staffOnTarget(pageable);
            count = resultPage.getTotalElements();
        }


        for (BhilaiSalaryStructure salaryStructure : resultPage) {
            mapToTargetReqDTO(salaryStructure, month, year, targetReqList);
        }
        responseDto.setResults(targetReqList);
        responseDto.setCount(count);

        return responseDto;
    }


    private void mapToTargetReqDTO(BhilaiSalaryStructure salaryStructure, String month, String year,
                                   List<TargetReqToTakeTargetDTO> targetReqList) {

        // Retrieve staff record with a for-each loop by using findAllById
        for (BhilaiStaff staff : bhilaiStaffRepo.findAllById(Collections.singletonList(salaryStructure.getStaffId()))) {

            TargetReqToTakeTargetDTO dto = new TargetReqToTakeTargetDTO();
            dto.setSsId(salaryStructure.getSsId());
            dto.setStaffName(staff.getName());
            dto.setDateOfJoining(staff.getDateOfJoining() == null ? "N/A" : staff.getDateOfJoining());
            dto.setStructureGross(salaryStructure.getGross());
            dto.setEmpNo(salaryStructure.getEmpNo());

            // Fetch target details for the specified month, year, and employee number
            BhilaiStaffTargetDetails target = targetRepo.findByDetails(month, year, staff.getTempEmp());
            if (target != null) {
                dto.setTarget(target.getTarget() != null ? target.getTarget().toString() : "0.00");
                dto.setExtraTarget(target.getExtraAchived() != null ? target.getExtraAchived().toString() : "0.00");
            }
            targetReqList.add(dto);
        }
    }

}
