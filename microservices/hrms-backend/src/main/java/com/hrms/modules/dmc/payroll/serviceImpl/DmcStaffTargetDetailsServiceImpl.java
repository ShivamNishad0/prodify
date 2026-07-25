package com.hrms.modules.dmc.payroll.serviceImpl;


import com.hrms.modules.dmc.hiring.models.DmcSalaryStructure;
import com.hrms.modules.dmc.hiring.models.DmcStaff;
import com.hrms.modules.dmc.hiring.repository.DmcSalaryStructureRepo;
import com.hrms.modules.dmc.hiring.repository.DmcStaffRepo;
import com.hrms.modules.dmc.payroll.modles.DmcStaffTargetDetails;
import com.hrms.modules.dmc.payroll.repository.DmcStaffTargetDetailsRepository;
import com.hrms.modules.dmc.payroll.service.DmcStaffTargetDetailsService;
import com.hrms.modules.dtos.TargetReqToTakeTargetDTO;
import com.hrms.modules.dtos.TargetRequestDTO;
import com.hrms.modules.dtos.TargetResponseDTO;
import com.hrms.modules.rmc.hiring.models.RmcSalaryStructure;
import com.hrms.modules.rmc.hiring.models.RmcStaff;
import com.hrms.modules.rmc.payroll.modles.RmcStaffTargetDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class DmcStaffTargetDetailsServiceImpl implements DmcStaffTargetDetailsService {

    @Autowired
    private DmcStaffTargetDetailsRepository targetRepo;
    @Autowired
    private DmcSalaryStructureRepo salaryRepo;
    @Autowired
    private DmcStaffSalaryServicesForRMC detailsService;
    @Autowired
    private DmcStaffRepo staffRepo;

    @Override
    public String createTargetDetails(TargetRequestDTO data) {
        StringBuilder response = new StringBuilder();
        Map<Long, BigDecimal> targets = data.getTargets();
        String year = data.getYear();
        String month = data.getMonth();
        Long zoneId = data.getZoneId();

        targets.forEach((salaryStructureId, target) -> {
            salaryRepo.findById(salaryStructureId).ifPresent(salaryStructure -> {
                DmcStaffTargetDetails foundTarget = targetRepo.findByDetails( month, year, salaryStructure.getEmpNo());
                if (foundTarget == null) {
                    // Create a new target record
                    DmcStaffTargetDetails details = new DmcStaffTargetDetails();
                    details.setTarget(target);
                    details.setMonth(month);
                    details.setYear(year);
                    details.setStaffId(salaryStructure.getStaffId());
                    details.setSsid(salaryStructure.getSsId());
                    details.setGross(salaryStructure.getGross());
                    details.setEmpNo(salaryStructure.getEmpNo());
                    DmcStaff staff = staffRepo.findById(salaryStructure.getStaffId()).get();
                    details.setName(staff.getName());
                    DmcStaffTargetDetails saved = targetRepo.save(details);
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
                    DmcStaff staff = staffRepo.findById(salaryStructure.getStaffId()).get();
                    foundTarget.setName(staff.getName());
                    DmcStaffTargetDetails updated = targetRepo.save(foundTarget);
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
    public TargetResponseDTO staffStaffDetails(String[] areaId, String month, String year, String emp_no, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<TargetReqToTakeTargetDTO> targetReqList = new ArrayList<>();
        TargetResponseDTO responseDto = new TargetResponseDTO();
        Long[] area = (areaId != null && areaId.length > 0)
                ? Arrays.stream(areaId).map(Long::parseLong).toArray(Long[]::new)
                : new Long[0];

        Page<DmcSalaryStructure> resultPage;
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


        for (DmcSalaryStructure salaryStructure : resultPage) {
            mapToTargetReqDTO(salaryStructure, month, year, targetReqList);
        }
        responseDto.setResults(targetReqList);
        responseDto.setCount(count);

        return responseDto;
    }


    private void mapToTargetReqDTO(DmcSalaryStructure salaryStructure, String month, String year,
                                   List<TargetReqToTakeTargetDTO> targetReqList) {

        // Retrieve staff record with a for-each loop by using findAllById
        for (DmcStaff staff : staffRepo.findAllById(Collections.singletonList(salaryStructure.getStaffId()))) {

            TargetReqToTakeTargetDTO dto = new TargetReqToTakeTargetDTO();
            dto.setSsId(salaryStructure.getSsId());
            dto.setStaffName(staff.getName());
            dto.setDateOfJoining(staff.getDateOfJoining() == null ? "N/A" : staff.getDateOfJoining());
            dto.setStructureGross(salaryStructure.getGross());
            dto.setEmpNo(salaryStructure.getEmpNo());

            // Fetch target details for the specified month, year, and employee number
            DmcStaffTargetDetails target = targetRepo.findByDetails(month, year, staff.getTempEmp());
            if (target != null) {
                dto.setTarget(target.getTarget() != null ? target.getTarget().toString() : "0.00");
                dto.setExtraTarget(target.getExtraAchived() != null ? target.getExtraAchived().toString() : "0.00");
            }
            targetReqList.add(dto);
        }
    }

}
