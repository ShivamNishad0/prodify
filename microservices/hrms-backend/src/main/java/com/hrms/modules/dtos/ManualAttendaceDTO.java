package com.hrms.modules.dtos;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class ManualAttendaceDTO {
    private String salaryId;
    private String empNo;
    private String staffId;
    private String present;
    private Integer year;
    private Long createdBy;
    private String monthName;
    private String empName;
}
