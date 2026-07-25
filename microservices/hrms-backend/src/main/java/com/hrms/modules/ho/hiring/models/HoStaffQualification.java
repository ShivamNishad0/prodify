package com.hrms.modules.ho.hiring.models;


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
@Table(schema = "ho")
public class HoStaffQualification {
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
