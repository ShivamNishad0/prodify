package com.hrms.modules.suda.payroll.serviceImpl;

import com.hrms.modules.dtos.*;
import com.hrms.modules.suda.hiring.models.SudaSalaryStructure;
import com.hrms.modules.suda.hiring.models.SudaStaff;
import com.hrms.modules.suda.hiring.repository.SudaSalaryStructureRepo;
import com.hrms.modules.suda.hiring.repository.SudaStaffRepo;
import com.hrms.modules.suda.payroll.modles.SudaStaffTargetDetails;
import com.hrms.modules.suda.payroll.repository.SudaStaffTargetDetailsRepository;
import com.hrms.modules.suda.payroll.service.SudaStaffTargetDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class SudaStaffTargetDetailsServiceImpl implements SudaStaffTargetDetailsService {

    @Autowired
    private SudaStaffTargetDetailsRepository targetRepo;
    @Autowired
    private SudaSalaryStructureRepo salaryRepo;
    @Autowired
    private SudaStaffSalaryServicesForTarget detailsService;
    @Autowired
    private SudaStaffRepo staffRepo;

    @Override
    public String createTargetDetails(NewTargetDTO data) {
        StringBuilder response = new StringBuilder();
        Map<Long, TargetValuesDTO> targets = data.getTargets();
        String year = data.getYear();
        String month = data.getMonth();

        targets.forEach((salaryStructureId, target) -> {
            salaryRepo.findById(salaryStructureId).ifPresent(salaryStructure -> {
                SudaStaffTargetDetails foundTarget = targetRepo.findByDetails( month, year, salaryStructure.getEmpNo());
                if (foundTarget == null) {
                    // Create a new target record
                    SudaStaffTargetDetails details = new SudaStaffTargetDetails();
                    details.setTarget(target.getAchieveTarget());
                    details.setAssignTarget(target.getAssignTarget());
                    details.setMonth(month);
                    details.setYear(year);
                    details.setStaffId(salaryStructure.getStaffId());
                    details.setSsid(salaryStructure.getSsId());
                    details.setGross(salaryStructure.getGross());
                    details.setEmpNo(salaryStructure.getEmpNo());
                    SudaStaff staff = staffRepo.findById(salaryStructure.getStaffId()).get();
                    details.setName(staff.getName());
                    SudaStaffTargetDetails saved = targetRepo.save(details);
                    if (saved != null) {
                        String result = detailsService.generateSalaryForTargetBased(saved.getStaffId(),Integer.parseInt(year),month,target.getAchieveTarget(),saved.getSsid());
                        response.append("Salary generated = ").append(saved.getStaffId()).append("\n");
                    } else {
                        response.append("Failed To Generate = ").append(salaryStructure.getEmpNo()).append("\n");
                    }
                } else {
                    // Update existing target record
                    foundTarget.setTarget(target.getAchieveTarget());
                    foundTarget
                            .setAssignTarget(target.getAssignTarget());                    foundTarget.setMonth(month);
                    foundTarget.setYear(year);
                    foundTarget.setGross(salaryStructure.getGross());
                    SudaStaff staff = staffRepo.findById(salaryStructure.getStaffId()).get();
                    foundTarget.setName(staff.getName());
                    SudaStaffTargetDetails updated = targetRepo.save(foundTarget);
                    if (updated != null) {
                        String result = detailsService.generateSalaryForTargetBased(updated.getStaffId(),Integer.parseInt(year),month,target.getAchieveTarget(),updated.getSsid());
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
    public String createFixedDetails(NewTargetDTO data) {
        StringBuilder response = new StringBuilder();
        Map<Long, TargetValuesDTO> targets = data.getTargets();
        String year = data.getYear();
        String month = data.getMonth();

        targets.forEach((salaryStructureId, target) -> {
            salaryRepo.findById(salaryStructureId).ifPresent(salaryStructure -> {
                SudaStaffTargetDetails foundTarget = targetRepo.findByDetails( month, year, salaryStructure.getEmpNo());
                if (foundTarget == null) {
                    // Create a new target record
                    SudaStaffTargetDetails details = new SudaStaffTargetDetails();
                    details.setTarget(target.getAchieveTarget());
                    details.setAssignTarget(target.getAssignTarget());
                    details.setMonth(month);
                    details.setYear(year);
                    details.setStaffId(salaryStructure.getStaffId());
                    details.setSsid(salaryStructure.getSsId());
                    details.setGross(salaryStructure.getGross());
                    details.setEmpNo(salaryStructure.getEmpNo());
                    SudaStaff staff = staffRepo.findById(salaryStructure.getStaffId()).get();
                    details.setName(staff.getName());
                    SudaStaffTargetDetails saved = targetRepo.save(details);
                    if (saved != null) {
                        String result = detailsService.generateSalaryForFixedBased(saved.getStaffId(),Integer.parseInt(year),month,target.getAchieveTarget(),saved.getSsid());
                        response.append("Salary generated = ").append(saved.getStaffId()).append("\n");
                    } else {
                        response.append("Failed To Generate = ").append(salaryStructure.getEmpNo()).append("\n");
                    }
                } else {
                    // Update existing target record
                    foundTarget.setTarget(target.getAchieveTarget());
                    foundTarget
                            .setAssignTarget(target.getAssignTarget());                    foundTarget.setMonth(month);
                    foundTarget.setYear(year);
                    foundTarget.setGross(salaryStructure.getGross());
                    SudaStaff staff = staffRepo.findById(salaryStructure.getStaffId()).get();
                    foundTarget.setName(staff.getName());
                    SudaStaffTargetDetails updated = targetRepo.save(foundTarget);
                    if (updated != null) {
                        String result = detailsService.generateSalaryForFixedBased(updated.getStaffId(),Integer.parseInt(year),month,target.getAchieveTarget(),updated.getSsid());
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
    public TargetResponseDTO staffStaffDetails(String[] areaId, String month, String year, String empNo, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<TargetReqToTakeTargetDTO> targetReqList = new ArrayList<>();
        TargetResponseDTO responseDto = new TargetResponseDTO();

        // Parse area IDs if provided, otherwise set to an empty array
        Long[] area = (areaId != null && areaId.length > 0)
                ? Arrays.stream(areaId).map(Long::parseLong).toArray(Long[]::new)
                : new Long[0];

        // Fetch data based on area, designation, and empNo conditions
        Page<SudaSalaryStructure> resultPage;
        long count;

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

        // Populate targetReqList by mapping each salary structure to DTOs
        for (SudaSalaryStructure salaryStructure : resultPage) {
            mapToTargetReqDTO(salaryStructure, month, year, targetReqList, area);
        }


        // Set properties in responseDto
        responseDto.setResults(targetReqList);
        responseDto.setCount(count);

        return responseDto;
    }

    @Override
    public TargetResponseDTO staffStaffFixedDetails(String[] areaId, String month, String year, String empNo, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<TargetReqToTakeTargetDTO> targetReqList = new ArrayList<>();
        TargetResponseDTO responseDto = new TargetResponseDTO();

        // Parse area IDs if provided, otherwise set to an empty array
        Long[] area = (areaId != null && areaId.length > 0)
                ? Arrays.stream(areaId).map(Long::parseLong).toArray(Long[]::new)
                : new Long[0];

        // Fetch data based on area, designation, and empNo conditions
        Page<SudaSalaryStructure> resultPage;
        long count;

        if (area.length > 0 && !empNo.isEmpty()) {
            resultPage = salaryRepo.staffOnFixedWithEmpNo(area, empNo, pageable);
            count = resultPage.getTotalElements();
        } else if (area.length > 0) {
            resultPage = salaryRepo.staffOnFixed(area, pageable);
            count = resultPage.getTotalElements();
        } else if (!empNo.isEmpty()) {
            resultPage = salaryRepo.staffOnFixedByEmpNo(empNo, pageable);
            count = resultPage.getTotalElements();
        } else {
            resultPage = salaryRepo.staffOnFixed(pageable);
            count = resultPage.getTotalElements();
        }

        // Populate targetReqList by mapping each salary structure to DTOs
        for (SudaSalaryStructure salaryStructure : resultPage) {
            mapToTargetReqDTO(salaryStructure, month, year, targetReqList, area);
        }


        // Set properties in responseDto
        responseDto.setResults(targetReqList);
        responseDto.setCount(count);

        return responseDto;
    }


    private void mapToTargetReqDTO(SudaSalaryStructure salaryStructure, String month, String year,
                                   List<TargetReqToTakeTargetDTO> targetReqList, Long[] area) {

        // Retrieve staff record with a for-each loop by using findAllById
        for (SudaStaff staff : staffRepo.findAllById(Collections.singletonList(salaryStructure.getStaffId()))) {

            Long areaId = (staff.getAreaId() != null) ? staff.getAreaId() : 0L;

            // Check if `area` is empty or contains `areaId`
            boolean areaContainsAreaId = (area.length == 0);
            for (Long areaValue : area) {
                if (areaValue.equals(areaId)) {
                    areaContainsAreaId = true;
                    break;
                }
            }

            if (areaContainsAreaId) {
                TargetReqToTakeTargetDTO dto = new TargetReqToTakeTargetDTO();
                dto.setSsId(salaryStructure.getSsId());
                dto.setStaffName(staff.getName());
                dto.setDateOfJoining(staff.getDateOfJoining() == null ? "N/A" : staff.getDateOfJoining());
                dto.setStructureGross(salaryStructure.getGross());
                dto.setEmpNo(salaryStructure.getEmpNo());
                // Fetch target details for the specified month, year, and employee number
//                log.info("Finding Target Details For =============> {} {} {}",staff.getTempEmp(),month, year);
                SudaStaffTargetDetails target = targetRepo.findByDetails(month, year, staff.getTempEmp());
                if (target != null) {
                    dto.setTarget(target.getTarget() != null ? target.getTarget().toString() : "0.00");
                    dto.setExtraTarget(target.getExtraAchived() != null ? target.getExtraAchived().toString() : "0.00");
                    dto.setAssignTarget(target.getAssignTarget()!=null?target.getAssignTarget().toString():"0.00");
                }else {
                    dto.setTarget( "0.00");
                    dto.setExtraTarget("0.00");
                    dto.setAssignTarget("0.00");
                }

                targetReqList.add(dto);
            }
        }
    }



}
