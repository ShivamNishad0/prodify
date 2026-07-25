package com.hrms.modules.dmc.payroll.service;


import com.hrms.modules.dtos.TargetRequestDTO;
import com.hrms.modules.dtos.TargetResponseDTO;

public interface DmcStaffTargetDetailsService {
    public String createTargetDetails(TargetRequestDTO data);
//    public TargetResponseDTO staffStaffDetails(Long zoneId, int page, int size) ;

    public TargetResponseDTO staffStaffDetails(String[] areaId, String month, String year, String emp_no, int page, int size);
}
