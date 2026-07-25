package com.hrms.modules.ho.payroll.service;

import com.hrms.modules.dtos.TargetRequestDTO;
import com.hrms.modules.dtos.TargetResponseDTO;

public interface HoStaffTargetDetailsService {
    public String createTargetDetails(TargetRequestDTO data);
    public TargetResponseDTO staffStaffDetails(Long zoneId, int page, int size) ;
}
