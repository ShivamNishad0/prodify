package com.hrms.modules.dtos;

import com.hrms.modules.rmc.payroll.modles.RmcStaffSalaryDetails;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CountAndSalaryDetailsByZone {
private Long count;
private List<?>results;
}
