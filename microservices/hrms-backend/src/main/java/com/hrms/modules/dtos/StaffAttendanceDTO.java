package com.hrms.modules.dtos;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaffAttendanceDTO {
	private String empNo;
	private Long createdBy;
	private Integer year;
	private Long zoneId;
	private String monthName;
	private List<AttendanceDTO> attendance;
}
