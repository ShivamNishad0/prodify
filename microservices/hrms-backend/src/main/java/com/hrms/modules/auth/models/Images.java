package com.hrms.modules.auth.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Images {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long imageId;
	private String imageName;
	private String imageType;
}
