package com.hrms.modules.suda.hiring.models;

import com.hrms.modules.utilsServics.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(schema = "suda")
public class SudaIDCard {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Long idNo;
	 private String empNo;
	 private String name;
	 private String post;
	 private String dob;
	 private String fname;
	 private String mobNo;
	 private String validUpto;
	 private String address;
	 private LocalDate generationDate;
	 private String staffImg;
	 @Column(name = "staff_id", unique = true, nullable = false)
	 private Long staffId;
	 private Long areaId;
	 @Enumerated(EnumType.STRING)
	 private Status status;
	 private Long generatedBy;
	 private String tempEmp;
	 private Long printCount;
	 private Timestamp stamp;
}
