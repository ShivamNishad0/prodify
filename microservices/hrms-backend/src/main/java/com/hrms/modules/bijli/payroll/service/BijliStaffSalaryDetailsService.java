package com.hrms.modules.bijli.payroll.service;

import com.hrms.modules.dtos.*;
import com.hrms.modules.bijli.payroll.modles.BijliStaffSalaryDetails;

import java.util.List;

public interface BijliStaffSalaryDetailsService {
    public String generateSalary(Long StaffId, int year, String month);

    public String editSalaryDetails(Long sslId, SalaryDetails_EDIT_DTO details, Long editedBy);

    public BijliStaffSalaryDetails findSalaryDetails(Long StaffId, String month, String year);

    public String verifySalary(List<Long> salaryDetId, Long userId);

    public CountAndSalaryDetailsByZone allSalariesList(Long zoneId, String month, String year, String type, String req, Long desigId, String[] area_id, int page, int size);

    public CountAndSalaryDetailsByZone findByStaffEmpNo(String tempEmp, String month, String year,String type);

    public StaffAdvanceInfoDTO findAdvDetailsOfEmp(String empNo, Long zoneId);

    public List<SalaryReportDTO> getAllSalaryByDetails(String month, Long zoneId, String[] area_id, String year, String type, String req, Long desigId);

    public String createAdvPaymentOfStaff(AdvancePaymentDTO data, String type);

    public List<BijliStaffSalaryDetails> getAnualResultOfEmp(String empNo, Long zoneId, String year);

    public CountAndSalaryDetailsByZone allSalariesListForTargetBased(Long zoneId, String month, String year, String type, String[] area_id, int page, int size);

    public CountAndSalaryDetailsByZone completeSalariesListForTargetBased(String month, String year, String type, String[] area_id, String report_for);

    public SumOfDistributionDTO findTotalMoneyDistribution(String month, String year, String type);

    public CountAndDetails searchSalaryDetails(String searchTerm, String month, String year);

    public CountAndSalaryDetailsByZone allRemovedStaffSalary(int page, int size);

    public CountAndSalaryDetailsByZone removedStaffSalary(int page, int size, String empNo);

    public CountAndDetails getSumOf(String month, String year, String type, int pageNumber, int pageSize);

    public CountAndDetails getSumOfIndividual(String empNo, String month, String year, String type, int pageNumber, int pageSize);

    public String createDeduction(DeductionReqDTO data);

    public CountAndSalaryDetailsByZone getDataAsPerMonthAndYear(String type, String month, String year, int page, int size);

    public String salaryOnHold(String empNo,String month,String year,String type);

    public String removeSalaryDetails(String month, String year, String empNo);

    public BijliStaffSalaryDetails findPrevAmt(String empNo,String month,String year);
}
