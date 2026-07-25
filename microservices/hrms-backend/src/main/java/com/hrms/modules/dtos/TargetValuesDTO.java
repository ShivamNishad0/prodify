package com.hrms.modules.dtos;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class TargetValuesDTO {
    private BigDecimal assignTarget;
    private BigDecimal achieveTarget;
}
