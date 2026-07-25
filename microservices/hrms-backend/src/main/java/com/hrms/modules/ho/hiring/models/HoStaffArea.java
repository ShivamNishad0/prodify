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
public class HoStaffArea {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long areaId;
	private String area;
	private String circle;
	private String division;
	private String subDivision;
}
