package com.hrms.modules.bijli.hiring.models;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(schema = "bijli")
public class BijliStaffQualification {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long qid;
	private String qualiFication;
	private String startDate;
	private String univ;
	private Double marks;
	private String endDate;
	private Long staffId;
}
