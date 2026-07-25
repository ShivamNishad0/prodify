package com.hrms.modules.bijli.payroll.serviceImpl;

import com.hrms.modules.bijli.payroll.modles.BijliStaffSalaryDetails;
import com.hrms.modules.bijli.payroll.repository.BijliStaffSalaryDetailsRepository;
import com.hrms.modules.dtos.TargetReqToTakeTargetDTO;
import com.hrms.modules.dtos.TargetRequestDTO;
import com.hrms.modules.dtos.TargetResponseDTO;
import com.hrms.modules.bijli.hiring.models.BijliSalaryStructure;
import com.hrms.modules.bijli.hiring.models.BijliStaff;
import com.hrms.modules.bijli.hiring.repository.BijliSalaryStructureRepo;
import com.hrms.modules.bijli.hiring.repository.BijliStaffRepo;
import com.hrms.modules.bijli.payroll.modles.BijliStaffTargetDetails;
import com.hrms.modules.bijli.payroll.repository.BijliStaffTargetDetailsRepository;
import com.hrms.modules.bijli.payroll.service.BijliStaffTargetDetailsService;
import com.hrms.modules.utilsServics.Status;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Slf4j
@Service
public class BijliStaffTargetDetailsServiceImpl implements BijliStaffTargetDetailsService {

    @Autowired
    private BijliStaffTargetDetailsRepository targetRepo;
    @Autowired
    private BijliSalaryStructureRepo salaryRepo;
    @Autowired
    private BijliStaffSalaryServicesForRMC detailsService;
    @Autowired
    private BijliStaffRepo staffRepo;
    @Autowired
    private BijliStaffTargetDetailsRepository detailsRepository;
    @Autowired
    private BijliStaffSalaryDetailsRepository salaryDetails;

    @Override
    public String createTargetDetails(TargetRequestDTO data) {
        StringBuilder response = new StringBuilder();
        Map<Long, BigDecimal> targets = data.getTargets();
        String year = data.getYear();
        String month = data.getMonth();

        targets.forEach((salaryStructureId, target) -> {
            salaryRepo.findById(salaryStructureId).ifPresent(salaryStructure -> {
                BijliStaffTargetDetails foundTarget = targetRepo.findByDetails(month, year, salaryStructure.getEmpNo());

                BigDecimal achived = targetVerification(target)[0] != null ? targetVerification(target)[0] : BigDecimal.ZERO;
                BigDecimal extraAchived = targetVerification(target)[1] != null ? targetVerification(target)[1] : BigDecimal.ZERO;

                if (foundTarget == null) {
                    // Create a new target record
                    BijliStaffTargetDetails details = new BijliStaffTargetDetails();
                    details.setTarget(achived);
                    details.setExtraAchived(extraAchived);
                    details.setMonth(month);
                    details.setYear(year);
                    details.setStaffId(salaryStructure.getStaffId());
                    details.setSsid(salaryStructure.getSsId());
                    details.setGross(salaryStructure.getGross());
                    details.setEmpNo(salaryStructure.getEmpNo());
                    BijliStaff staff = staffRepo.findById(salaryStructure.getStaffId()).get();
                    details.setName(staff.getName());
                    BijliStaffTargetDetails saved = targetRepo.save(details);
                    if (saved != null) {
                        BijliStaffSalaryDetails foundData = salaryDetails.findBydetails(saved.getStaffId(), month, year);
                        if (foundData == null || foundData.getStatus().equals(Status.UNVERIFIED)) {
                            String result = detailsService.generateSalaryForTargetBased(saved.getStaffId(), Integer.parseInt(year), month, targetVerification(target)[0], salaryStructure.getSsId());
                            response.append("Salary generated = ").append(saved.getEmpNo()).append("\n");
                        }
                        response.append("Salary Already generated = ").append(saved.getEmpNo()).append("\n");
                    } else {
                        response.append("Failed To Generate = ").append(salaryStructure.getEmpNo()).append("\n");
                    }
                } else {
                    // Update existing target record
                    foundTarget.setTarget(achived);
                    foundTarget.setExtraAchived(extraAchived);
                    foundTarget.setMonth(month);
                    foundTarget.setYear(year);
                    foundTarget.setGross(salaryStructure.getGross());
                    BijliStaff staff = staffRepo.findById(salaryStructure.getStaffId()).get();
                    foundTarget.setName(staff.getName());
                    BijliStaffTargetDetails updated = targetRepo.save(foundTarget);
                    if (updated != null) {

                        System.out.println("LOOKING DATA OF EMP  =====> "+updated.getEmpNo()+" Month => "+ month+" Year ==>"+ year);
                        BijliStaffSalaryDetails foundData = salaryDetails.findBydetails(updated.getEmpNo(), month, year);
                        if (foundData == null || foundData.getStatus().equals(Status.UNVERIFIED)) {
                            String result = detailsService.generateSalaryForTargetBased(updated.getStaffId(), Integer.parseInt(year), month, achived, salaryStructure.getSsId());
                            response.append("Salary updated = ").append(updated.getEmpNo()).append("\n");
                        }
                        response.append("Salary Already generated = ").append(updated.getEmpNo()).append("\n");


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
        Page<BijliSalaryStructure> resultPage;
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
        for (BijliSalaryStructure salaryStructure : resultPage) {
            mapToTargetReqDTO(salaryStructure, month, year, targetReqList, area);
        }


        // Set properties in responseDto
        responseDto.setResults(targetReqList);
        responseDto.setCount(count);

        return responseDto;
    }


    private void mapToTargetReqDTO(BijliSalaryStructure salaryStructure, String month, String year,
                                   List<TargetReqToTakeTargetDTO> targetReqList, Long[] area) {

        // Retrieve staff record with a for-each loop by using findAllById
        for (BijliStaff staff : staffRepo.findAllById(Collections.singletonList(salaryStructure.getStaffId()))) {

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

                String emp=staff.getTempEmp();
                log.info("Finding Target Details For =============> {} {} {}",emp,month, year);
                BijliStaffTargetDetails target = targetRepo.findByDetails(month, year, emp);
                if (target != null) {
                    dto.setAssignTarget(target.getTarget() != null ? target.getTarget().toString() : "0.00");
                    dto.setTarget(target.getTarget() != null ? target.getTarget().toString() : "0.00");
                    dto.setExtraTarget(target.getExtraAchived() != null ? target.getExtraAchived().toString() : "0.00");
                }else {
                    dto.setTarget( "0.00");
                    dto.setExtraTarget("0.00");
                }

                targetReqList.add(dto);
            }
        }
    }


    @Override
    public TargetResponseDTO staffDetails(String month, String year, String areaId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
//        String tempEmpPattern = "%" + empNo + "%";
        long area_id = Long.parseLong(areaId);

        Page<Object[]> foundData = salaryRepo.uniqueSearch(month, year, area_id, pageable);
        List<TargetReqToTakeTargetDTO> data = new ArrayList<>();
        for (Object[] gotData : foundData.getContent()) {
            TargetReqToTakeTargetDTO set = new TargetReqToTakeTargetDTO();
            set.setStaffId((long) gotData[0]);
            set.setStaffName((String) gotData[2]);
            set.setStructureGross((BigDecimal) gotData[4]);
            set.setAreaId((long) gotData[7]);
            set.setSsId((long) gotData[3]);
            set.setEmpNo((String) gotData[1]);
            set.setTarget(gotData[9].toString());
            set.setExtraTarget(gotData[8].toString());
            data.add(set);
        }
        TargetResponseDTO result = new TargetResponseDTO();
        result.setResults(data);
        int count = foundData.getSize();
        result.setCount((long) count);
        return result;
    }

    private BigDecimal[] targetVerification(BigDecimal achivedTarget) {
        BigDecimal[] blance = new BigDecimal[2];
        if (achivedTarget.compareTo(new BigDecimal("1500")) <= 0) {
            blance[0] = achivedTarget;
            blance[1] = BigDecimal.ZERO;
        }
        if (achivedTarget.compareTo(new BigDecimal("1500")) > 0) {
            blance[0] = new BigDecimal("1500");
            blance[1] = achivedTarget.subtract(new BigDecimal("1500"));
        }
        return blance;
    }

}
