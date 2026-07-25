package com.hrms.modules.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceDTO {
	private String day;
	private String inTime;
	private String outTime;
	private String status;
}
