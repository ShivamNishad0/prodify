package com.hrms.modules.rmc.payroll.service;

import com.hrms.modules.dtos.*;
import com.hrms.modules.rmc.payroll.modles.RmcStaffSalaryDetails;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface RmcStaffSalaryDetailsService {
    public String generateSalary(Long StaffId, int year, String month);

    public String editSalaryDetails(Long sslId, SalaryDetails_EDIT_DTO details, Long editedBy);

    public RmcStaffSalaryDetails findSalaryDetails(Long StaffId, String month, String year);

    public String verifySalary(List<Long> salaryDetId, Long userId);

    public CountAndSalaryDetailsByZone allSalariesList(Long zoneId, String month, String year,String type, int page, int size);

    public CountAndSalaryDetailsByZone findByStaffEmpNo(String tempEmp, String month, String year,String type);

    public StaffAdvanceInfoDTO findAdvDetailsOfEmp(String empNo);

    public Map<String, BigDecimal> otherAllowancesDetails(String emp_no, String month, String year);

    public List<?> getAllSalaryByDetails(String month, Long zoneId, String year,String type);

    public String createAdvPaymentOfStaff(AdvancePaymentDTO data, String type);

    public List<RmcStaffSalaryDetails> getAnualResultOfEmp(String empNo, Long zoneId, String year);

    public CountAndSalaryDetailsByZone allSalariesListForTargetBased(Long zoneId, String month, String year,String type,String[]area_id, int page, int size);

    public String createDeduction(DeductionReqDTO data);

    public StaffDeductionsInfoDTO staffDeductionDetails(String empNo, String year);

    public CountAndSalaryDetailsByZone getDataAsPerMonthAndYear(String type, String month, String year, int page, int size);

    public SumOfDistributionDTO findTotalMoneyDistribution(String month, String year,String type);

    public CountAndDetails searchSalaryDetails(String searchTerm,String month,String year);

    public CountAndSalaryDetailsByZone allRemovedStaffSalary(int page, int size);

    public CountAndSalaryDetailsByZone removedStaffSalary(int page, int size,String empNo);

    public CountAndDetails getSumOf(String month, String year, String type, int pageNumber, int pageSize);

    public CountAndDetails getSumOfIndividual(String empNo,String month, String year, String type, int pageNumber, int pageSize);

    public String salaryOnHold(String empNo,String month,String year,String type);

    public List<SalaryReportDTO> getAllSalaryByDetailsFixed(String month, Long zoneId, String year,String[]area_id,String req);

    public CountAndSalaryDetailsByZone allSalariesListForFixed(Long zoneId, String month, String year,String []area_id, int page, int size);

    public String removeSalaryDetails(String month, String year, String empNo);

    public RmcStaffSalaryDetails findPrevAmt(String empNo,String month,String year);

}
