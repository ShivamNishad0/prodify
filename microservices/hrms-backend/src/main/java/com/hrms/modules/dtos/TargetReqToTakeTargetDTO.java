package com.hrms.modules.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TargetReqToTakeTargetDTO {
    private Long staffId;
    private String staffName;
    private BigDecimal structureGross;
    private Long ssId;
    private String empNo;
    private String target;
    private String assignTarget;
    private String extraTarget;
    private String dateOfJoining;
    private Long areaId;
}
