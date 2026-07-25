package com.hrms.modules.dmc.hiring.models;

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
@Table(schema = "dmc")
public class DmcStaffExprience {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long staffExpId;
	private Long staffId;
	private String emapNo;
	private String companyName;
	private String dateFrom;
	private String dateTo;
	private String designation;
	private String totalYear;
	private String location;
	private String remarks;
}
