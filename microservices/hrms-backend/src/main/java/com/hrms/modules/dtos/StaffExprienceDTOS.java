package com.hrms.modules.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StaffExprienceDTOS {
	private Long staffId;
	private String emapNo;
	private String companyName;
	private String dateFrom;
	private String dateTo;
	private String designation;
	private String totalYear;
	private String location;
	private String remarks;
	private Long staffExpId;
}
