package com.hrms.modules.rmc.payroll.serviceImpl;


import com.hrms.modules.bijli.hiring.models.BijliSalaryStructure;
import com.hrms.modules.dtos.TargetReqToTakeTargetDTO;
import com.hrms.modules.dtos.TargetRequestDTO;
import com.hrms.modules.dtos.TargetResponseDTO;
import com.hrms.modules.rmc.hiring.models.RmcSalaryStructure;
import com.hrms.modules.rmc.hiring.models.RmcStaff;
import com.hrms.modules.rmc.hiring.repository.RmcSalaryStructureRepo;
import com.hrms.modules.rmc.hiring.repository.RmcStaffRepo;
import com.hrms.modules.rmc.payroll.modles.RmcStaffSalaryDetails;
import com.hrms.modules.rmc.payroll.modles.RmcStaffTargetDetails;
import com.hrms.modules.rmc.payroll.repository.RmcStaffSalaryDetailsRepository;
import com.hrms.modules.rmc.payroll.repository.RmcStaffTargetDetailsRepository;
import com.hrms.modules.rmc.payroll.service.RmcStaffTargetDetailsService;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class RmcStaffTargetDetailsServiceImpl implements RmcStaffTargetDetailsService {

    @Autowired
    private RmcStaffTargetDetailsRepository targetRepo;
    @Autowired
    private RmcSalaryStructureRepo salaryRepo;
    @Autowired
    private RmcStaffSalaryServicesForRMC detailsService;
    @Autowired
    private RmcStaffRepo staffRepo;
    @Autowired
    private RmcStaffSalaryDetailsRepository salaryDetails;


    @Override
    public String createTargetDetails(TargetRequestDTO data) {
        StringBuilder response = new StringBuilder();
        Map<Long, BigDecimal> targets = data.getTargets();
        String year = data.getYear();
        String month = data.getMonth();

        targets.forEach((salaryStructureId, target) -> {
            salaryRepo.findById(salaryStructureId).ifPresent(salaryStructure -> {
                RmcStaffTargetDetails foundTarget = targetRepo.findByDetails(month, year, salaryStructure.getEmpNo());
                if (foundTarget == null) {
                    // Create a new target record
                    RmcStaffTargetDetails details = new RmcStaffTargetDetails();
                    details.setTarget(target);
                    details.setMonth(month);
                    details.setYear(year);
                    details.setStaffId(salaryStructure.getStaffId());
                    details.setSsid(salaryStructure.getSsId());
                    details.setGross(salaryStructure.getGross());
                    details.setEmpNo(salaryStructure.getEmpNo());
                    RmcStaff staff = staffRepo.findById(salaryStructure.getStaffId()).get();
                    details.setName(staff.getName());
                    RmcStaffTargetDetails saved = targetRepo.save(details);
                    if (saved != null) {
                        System.out.println("Looking for data of emp ===> " + saved.getStaffId() + " emp_no  ===> " + saved.getEmpNo() + " Month ===> " + month);
                        RmcStaffSalaryDetails foundData = salaryDetails.findBydetails(saved.getStaffId(), month, year);
                        if (foundData == null || foundData.getStatus().equals(Status.UNVERIFIED)) {
                            String result = detailsService.generateSalaryForTargetBased(saved.getStaffId(), Integer.parseInt(year), month, target, saved.getSsid());
                            response.append("Salary generated = ").append(saved.getEmpNo()).append("\n");
                        }
                        response.append("Salary Already generated = ").append(saved.getEmpNo()).append("\n");
                    } else {
                        response.append("Failed To Generate = ").append(salaryStructure.getEmpNo()).append("\n");
                    }
                } else {
                    // Update existing target record
                    foundTarget.setTarget(target);
                    foundTarget.setMonth(month);
                    foundTarget.setYear(year);
                    foundTarget.setGross(salaryStructure.getGross());
                    RmcStaff staff = staffRepo.findById(salaryStructure.getStaffId()).get();
                    foundTarget.setName(staff.getName());
                    RmcStaffTargetDetails updated = targetRepo.save(foundTarget);
                    if (updated != null) {
                        RmcStaffSalaryDetails foundData = salaryDetails.findBydetails(updated.getStaffId(), month, year);
                        if (foundData == null || foundData.getStatus().equals(Status.UNVERIFIED)) {
                            String result = detailsService.generateSalaryForTargetBased(updated.getStaffId(), Integer.parseInt(year), month, target, updated.getSsid());
                            response.append("Salary updated = ").append(updated.getEmpNo()).append("\n");
                        }
                        response.append("Already generated = ").append(updated.getEmpNo()).append("\n");

                    } else {
                        response.append("Failed To Update = ").append(salaryStructure.getEmpNo()).append("\n");
                    }
                }
            });
        });

        return response.toString();
    }

    public String createFixedDetails(TargetRequestDTO data) {
        StringBuilder response = new StringBuilder();
        Map<Long, BigDecimal> targets = data.getTargets();
        String year = data.getYear();
        String month = data.getMonth();

        targets.forEach((salaryStructureId, target) -> {
            salaryRepo.findById(salaryStructureId).ifPresent(salaryStructure -> {
                RmcStaffTargetDetails foundTarget = targetRepo.findByDetails(month, year, salaryStructure.getEmpNo());
                if (foundTarget == null) {
                    // Create a new target record
                    RmcStaffTargetDetails details = new RmcStaffTargetDetails();
                    details.setTarget(target);
                    details.setMonth(month);
                    details.setYear(year);
                    details.setStaffId(salaryStructure.getStaffId());
                    details.setSsid(salaryStructure.getSsId());
                    details.setGross(salaryStructure.getGross());
                    details.setEmpNo(salaryStructure.getEmpNo());
                    RmcStaff staff = staffRepo.findById(salaryStructure.getStaffId()).get();
                    details.setName(staff.getName());
                    RmcStaffTargetDetails saved = targetRepo.save(details);
                    if (saved != null) {
                        System.out.println("Looking for data of emp ===> " + saved.getStaffId() + " emp_no  ===> " + saved.getEmpNo() + " Month ===> " + month);
                        RmcStaffSalaryDetails foundData = salaryDetails.findBydetails(saved.getStaffId(), month, year);
                        if (foundData == null || foundData.getStatus().equals(Status.UNVERIFIED)) {
                            String result = detailsService.generateSalaryForFixedBased(saved.getStaffId(), Integer.parseInt(year), month, target, saved.getSsid());
                            response.append("Salary generated = ").append(saved.getEmpNo()).append("\n");
                        }
                        response.append("Salary Already generated = ").append(saved.getEmpNo()).append("\n");
                    } else {
                        response.append("Failed To Generate = ").append(salaryStructure.getEmpNo()).append("\n");
                    }
                } else {
                    // Update existing target record
                    foundTarget.setTarget(target);
                    foundTarget.setMonth(month);
                    foundTarget.setYear(year);
                    foundTarget.setGross(salaryStructure.getGross());
                    RmcStaff staff = staffRepo.findById(salaryStructure.getStaffId()).get();
                    foundTarget.setName(staff.getName());
                    RmcStaffTargetDetails updated = targetRepo.save(foundTarget);
                    if (updated != null) {
                        RmcStaffSalaryDetails foundData = salaryDetails.findBydetails(updated.getStaffId(), month, year);
                        if (foundData == null || foundData.getStatus().equals(Status.UNVERIFIED)) {
                            String result = detailsService.generateSalaryForFixedBased(updated.getStaffId(), Integer.parseInt(year), month, target, updated.getSsid());
                            response.append("Salary updated = ").append(updated.getEmpNo()).append("\n");
                        }
                        response.append("Already generated = ").append(updated.getEmpNo()).append("\n");

                    } else {
                        response.append("Failed To Update = ").append(salaryStructure.getEmpNo()).append("\n");
                    }
                }
            });
        });

        return response.toString();
    }



    @Override
    public TargetResponseDTO staffStaffDetails(String[] areaId, String month, String year, String emp_no, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<TargetReqToTakeTargetDTO> targetReqList = new ArrayList<>();
        TargetResponseDTO responseDto = new TargetResponseDTO();
        Long[] area = (areaId != null && areaId.length > 0)
                ? Arrays.stream(areaId).map(Long::parseLong).toArray(Long[]::new)
                : new Long[0];

        Page<RmcSalaryStructure> resultPage;
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


        for (RmcSalaryStructure salaryStructure : resultPage) {
            mapToTargetReqDTO(salaryStructure, month, year, targetReqList);
        }
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
        Page<RmcSalaryStructure> resultPage;
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
        for (RmcSalaryStructure salaryStructure : resultPage) {
            mapToTargetReqDTO(salaryStructure, month, year, targetReqList, area);
        }


        // Set properties in responseDto
        responseDto.setResults(targetReqList);
        responseDto.setCount(count);

        return responseDto;
    }


    private void mapToTargetReqDTO(RmcSalaryStructure salaryStructure, String month, String year,
                                   List<TargetReqToTakeTargetDTO> targetReqList) {

        // Retrieve staff record with a for-each loop by using findAllById
        for (RmcStaff staff : staffRepo.findAllById(Collections.singletonList(salaryStructure.getStaffId()))) {

            TargetReqToTakeTargetDTO dto = new TargetReqToTakeTargetDTO();
            dto.setSsId(salaryStructure.getSsId());
            dto.setStaffName(staff.getName());
            dto.setDateOfJoining(staff.getDateOfJoining() == null ? "N/A" : staff.getDateOfJoining());
            dto.setStructureGross(salaryStructure.getGross());
            dto.setEmpNo(salaryStructure.getEmpNo());

            // Fetch target details for the specified month, year, and employee number
            RmcStaffTargetDetails target = targetRepo.findByDetails(month, year, staff.getTempEmp());
            if (target != null) {
                dto.setTarget(target.getTarget() != null ? target.getTarget().toString() : "0.00");
                dto.setExtraTarget(target.getExtraAchived() != null ? target.getExtraAchived().toString() : "0.00");
            }
            targetReqList.add(dto);
        }
    }

    private void mapToTargetReqDTO(RmcSalaryStructure salaryStructure, String month, String year,
                                   List<TargetReqToTakeTargetDTO> targetReqList, Long[] area) {

        // Retrieve staff record with a for-each loop by using findAllById
        for (RmcStaff staff : staffRepo.findAllById(Collections.singletonList(salaryStructure.getStaffId()))) {

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
                RmcStaffTargetDetails target = targetRepo.findByDetails(month, year, staff.getTempEmp());
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
