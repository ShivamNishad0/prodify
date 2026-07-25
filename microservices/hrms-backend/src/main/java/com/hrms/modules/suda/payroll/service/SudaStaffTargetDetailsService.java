package com.hrms.modules.suda.payroll.service;

import com.hrms.modules.dtos.NewTargetDTO;
import com.hrms.modules.dtos.TargetRequestDTO;
import com.hrms.modules.dtos.TargetResponseDTO;

public interface SudaStaffTargetDetailsService {
    public String createTargetDetails(NewTargetDTO data);
    public String createFixedDetails(NewTargetDTO data);
    public TargetResponseDTO staffStaffDetails(String[] areaId, String month, String year, String empNo, int page, int size) ;
    public TargetResponseDTO staffStaffFixedDetails(String[] areaId, String month, String year, String empNo, int page, int size) ;
}
