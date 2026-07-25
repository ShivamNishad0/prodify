package com.hrms.modules.ho.payroll.modles;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@Entity
@Table(schema = "ho")
public class HoAssest {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long assetId;
	private String assetName;
	
}
