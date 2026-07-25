package com.hrms.modules.dtos;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Map;
@Getter
@Setter
public class NewTargetDTO {
    private Map<Long, TargetValuesDTO> targets;
    private String year;
    private String month;
    private Long zoneId;
}
