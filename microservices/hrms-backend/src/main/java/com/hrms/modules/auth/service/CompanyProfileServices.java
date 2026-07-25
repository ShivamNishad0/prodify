package com.hrms.modules.auth.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.hrms.modules.auth.models.CompanyProfile;
import com.hrms.modules.auth.models.Images;
import com.hrms.modules.dtos.CompanyProfileDto;
import com.hrms.modules.dtos.ImageDTO;

public interface CompanyProfileServices {
	public String createCompany(CompanyProfileDto cmp);
	public String editCompanyProfile(Long companyId, CompanyProfileDto cmp);
	public CompanyProfile findCompanyById(Long compId);
	public CompanyProfile findCompanyByZoneId(Long compId);
	public String uploadOtherImage(ImageDTO dto);
	public String editImage(Long imageId,String Type,MultipartFile file);
	public String deleteImage(Long imageId) ;
	public List<Images> allImages();
	public Images image(Long imageId);
	public  List<Images> getByType(String type);
}
