package com.hrms.modules.bijli.hiring.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(schema = "bijli")
public class BijliStaffAssests {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private Long id;
	private String leaderName;
	private String assetId;
	private Date dateOfIssue;
	private String areaOfStaff;
	private String modelNo;
	private String deviceSlNo;
	private String reciverName;
	private String empNo;
	private Long staffId;
	private String ram;
	private String hardDisk;
	private String remarks;
	private String issuer;
}
