package com.hrms.modules.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImageDTO {
	
	private Long imageId;
	private MultipartFile file;
	private String imageName;
	private String imageType;
	
}
