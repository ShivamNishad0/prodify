package com.hrms.modules.dmc.payroll.service;


import com.hrms.modules.dmc.payroll.modles.DmcStaffSalaryDetails;
import com.hrms.modules.dtos.*;

import java.util.List;

public interface DmcStaffSalaryDetailsService {
    public String generateSalary(Long StaffId, int year, String month);

    public String editSalaryDetails(Long sslId, SalaryDetails_EDIT_DTO details, Long editedBy);

    public DmcStaffSalaryDetails findSalaryDetails(Long StaffId, String month, String year);

    public String verifySalary(List<Long> salaryDetId, Long userId);

    public CountAndSalaryDetailsByZone allSalariesList(Long zoneId, String month, String year, int page, int size);

    public CountAndSalaryDetailsByZone findByStaffEmpNo(String tempEmp, String month, String year,String type);

    public StaffAdvanceInfoDTO findAdvDetailsOfEmp(String empNo, Long zoneId);

    public List<SalaryReportDTO> getAllSalaryByDetails(String month, Long zoneId, String year);

    public String createAdvPaymentOfStaff(AdvancePaymentDTO data, String type);

    public List<DmcStaffSalaryDetails> getAnualResultOfEmp(String empNo, Long zoneId, String year);

    public CountAndSalaryDetailsByZone allSalariesListForTargetBased(Long zoneId, String month, String year, int page, int size);

    public SumOfDistributionDTO findTotalMoneyDistribution(String month, String year,String type);

    public CountAndSalaryDetailsByZone allRemovedStaffSalary(int page, int size);

    public CountAndSalaryDetailsByZone removedStaffSalary(int page, int size,String empNo);

    public CountAndDetails getSumOf(String month, String year, String type, int pageNumber, int pageSize);

    public CountAndDetails getSumOfIndividual(String empNo,String month, String year, String type, int pageNumber, int pageSize);

    public String createDeduction(DeductionReqDTO data);

    public CountAndSalaryDetailsByZone getDataAsPerMonthAndYear(String type, String month, String year, int page, int size);

    public String salaryOnHold(String empNo,String month,String year,String type);

    public CountAndSalaryDetailsByZone allSalariesListForComplete( String month, String year, String[] areaIds);

    public CountAndSalaryDetailsByZone allSalariesListForAll(Long zoneId, String month, String year, String[] areaIds, int page, int size);

    public String removeSalaryDetails(String month, String year, String empNo);

    public DmcStaffSalaryDetails findPrevAmt(String empNo,String month,String year);

}
