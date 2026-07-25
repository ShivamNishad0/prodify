package com.hrms.modules.auth.serviceImpl;


import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import com.hrms.modules.utilsServics.ImageToLocalStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hrms.modules.auth.models.CompanyProfile;
import com.hrms.modules.auth.models.Images;
import com.hrms.modules.auth.models.Role;
import com.hrms.modules.auth.models.Users;
import com.hrms.modules.auth.repositories.CompanyProfileRepo;
import com.hrms.modules.auth.repositories.ImagesRepo;
import com.hrms.modules.auth.repositories.UserRepository;
import com.hrms.modules.auth.service.CompanyProfileServices;
import com.hrms.modules.dtos.CompanyProfileDto;
import com.hrms.modules.dtos.ImageDTO;
import com.hrms.modules.utilsServics.DateUtils;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;

@Service
public class CompanyProfileServicesImpl implements CompanyProfileServices {

	@Autowired
	private CompanyProfileRepo cmpRepo;
	@Autowired
	private UserRepository userRepo;
	@Autowired
	private DateUtils dateService;
	@Autowired
	private ImageToLocalStorage fileService;
	@Autowired
	private ImagesRepo imageRepo;

	@Override
	public String createCompany(CompanyProfileDto cmp) {
		Optional<Users> foundUserOptional = userRepo.findById(cmp.getCreatedBy());
		if (foundUserOptional.isPresent() ) {
			Users foundUser = foundUserOptional.get();
			Set<Role> roles = foundUser.getRoles();
			boolean isAdmin = roles.stream().anyMatch(role -> "ROLE_ADMIN".equals(role.getName()));
			if (isAdmin) {
				CompanyProfile comp = new CompanyProfile();
				comp.setName(cmp.getName());
				comp.setAddress(cmp.getAddress());
				comp.setPhoneNumber(cmp.getPhoneNumber());
				comp.setEmail(cmp.getEmail());
				comp.setWebsite(cmp.getWebsite());
				comp.setIndustry(cmp.getIndustry());
				comp.setNumberOfEmployees(cmp.getNumberOfEmployees());
				comp.setEstablishedDate(dateService.convertStringToSqlDate(cmp.getEstablishedDate()));
				comp.setCeo(cmp.getCeo());
				comp.setDescription(cmp.getDescription());
				comp.setGstNo(cmp.getGstNo());
				comp.setCinNo(cmp.getCinNo());
				comp.setTinNo(cmp.getTinNo());
				comp.setZoneId(cmp.getZoneId());
				comp.setCreatedBy(cmp.getCreatedBy());
				comp.setStatus(Status.ACTIVE);
				cmpRepo.save(comp);
				return Result.SUCCESS.toString();
			} else {
				return "User does not have the required ADMIN role to create a company and Zone Must Be Avialable";
			}
		} else {
			return "Data not found.";
		}
	}

	@Override
	public String editCompanyProfile(Long companyId, CompanyProfileDto cmp) {
		Optional<CompanyProfile> found = cmpRepo.findById(companyId);
		if (found.isPresent()) {
			CompanyProfile comp = found.get();

			comp.setName(cmp.getName());
			comp.setAddress(cmp.getAddress());
			comp.setPhoneNumber(cmp.getPhoneNumber());
			comp.setEmail(cmp.getEmail());
			comp.setWebsite(cmp.getWebsite());
			comp.setIndustry(cmp.getIndustry());
			comp.setNumberOfEmployees(cmp.getNumberOfEmployees());
			comp.setEstablishedDate(dateService.convertStringToSqlDate(cmp.getEstablishedDate()));
			comp.setCeo(cmp.getCeo());
			comp.setDescription(cmp.getDescription());
			comp.setGstNo(cmp.getGstNo());
			comp.setCinNo(cmp.getCinNo());
			comp.setTinNo(cmp.getTinNo());
			cmpRepo.save(comp);
			return Result.SUCCESS.toString();
		}
		return Result.WENT_WRONG.toString();
	}

	@Override
	public CompanyProfile findCompanyById(Long compId) {
		CompanyProfile found = cmpRepo.findById(compId).get();
		return found != null ? found : null;
	}

	@Override
	public CompanyProfile findCompanyByZoneId(Long compId) {
		CompanyProfile found = cmpRepo.findCompanyByZoneId(compId);
		return found != null ? found : null;
	}

	@Override
	public String uploadOtherImage(ImageDTO dto) {
		UUID uuid = UUID.randomUUID();
		String imageName = fileService.saveImage(dto.getFile(), uuid.toString(), "OTHER_DOC");
		Images img = new Images();
		img.setImageName(imageName);
		img.setImageType(dto.getImageType());
		imageRepo.save(img);
		return imageName;
	}

	@Override
	public String editImage(Long imageId, String Type, MultipartFile file) {
		Images foundImg = imageRepo.findById(imageId).get();
		foundImg.setImageType(Type);
		if (file != null) {
			UUID uuid = UUID.randomUUID();
			String imageName = fileService.saveImage(file, uuid.toString(), "OTHER_DOC");
			foundImg.setImageName(imageName);
		}
		Images Img = imageRepo.save(foundImg);
		return Img != null ? Img.getImageName() : null;
	}

	@Override
	public String deleteImage(Long imageId) {
		Images foundImg = imageRepo.findById(imageId).get();
		fileService.deleteFile(foundImg.getImageName(), "OTHER_DOC");
		imageRepo.deleteById(imageId);
		return Result.SUCCESS.toString();
	}

	@Override
	public List<Images> allImages() {
		List<Images> allImg = imageRepo.findAll();
		return !allImg.isEmpty() ? allImg : null;
	}

	@Override
	public Images image(Long imageId) {
		Images foundImg = imageRepo.findById(imageId).get();

		return foundImg != null ? foundImg : null;
	}
	
	@Override
	public  List<Images> getByType(String type) {
		List<Images> allImages = imageRepo.imageByType(type);
		return !allImages.isEmpty() ?  allImages : null; 
	}
}
