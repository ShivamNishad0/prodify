package com.hrms.modules.dtos;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Data
@Getter
@Setter
public class StaffAdvanceInfoDTO {
	private String empNo;
	private Long staffId;
	BigDecimal totalAdv;
	BigDecimal totalSettledAdv;
	BigDecimal totalBlanceAdv;
	List<StaffAdvanceData>advInfo;
}
