package com.hrms.modules.dtos;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
public class RemoveStaffDTO {
    private Long staffId;
    private Long removedBy;
    private Long sallaryStructureId;
    private Long areaId;
    private String month;
    private String year;
    private String empNo;
    private String lastWorkingDay;
}
