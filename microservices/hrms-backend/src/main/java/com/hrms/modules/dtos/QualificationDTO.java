package com.hrms.modules.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class QualificationDTO {
	private Long qualiID;
	private String qualiFication;
	private String startDate;
	private String univ;
	private Double marks;
	private String endDate;
}
