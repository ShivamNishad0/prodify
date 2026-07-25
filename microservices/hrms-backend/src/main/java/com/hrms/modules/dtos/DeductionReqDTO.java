package com.hrms.modules.dtos;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class DeductionReqDTO {
    private String empNo;
    private String month;
    private String year;
    private String amount;
    private String remark;
}
