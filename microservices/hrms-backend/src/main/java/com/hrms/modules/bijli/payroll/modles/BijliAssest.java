package com.hrms.modules.bijli.payroll.modles;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@Entity
@Table(schema = "bijli")
public class BijliAssest {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long assetId;
	private String assetName;
	
}
