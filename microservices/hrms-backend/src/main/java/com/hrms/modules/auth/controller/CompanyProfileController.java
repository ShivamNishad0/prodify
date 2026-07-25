package com.hrms.modules.auth.controller;

import java.util.List;

import com.hrms.modules.auth.service.CompanyProfileServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hrms.modules.auth.models.CompanyProfile;
import com.hrms.modules.auth.models.Images;
import com.hrms.modules.dtos.CompanyProfileDto;
import com.hrms.modules.dtos.ImageDTO;
import com.hrms.modules.utilsServics.Result;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/com-profile")
public class CompanyProfileController {

	@Autowired
	private CompanyProfileServices companyService;

	@PostMapping("/create")
	public ResponseEntity<String> createCompany(@RequestBody CompanyProfileDto cmp) {
		String result = companyService.createCompany(cmp);
		HttpStatus status = result.equals(Result.SUCCESS.toString()) ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST;
		return ResponseEntity.status(status).body(result);
	}

	@PutMapping("/edit/{companyId}")
	public ResponseEntity<String> editCompanyProfile(@PathVariable Long companyId, @RequestBody CompanyProfileDto cmp) {
		String result = companyService.editCompanyProfile(companyId, cmp);
		HttpStatus status = result.equals(Result.SUCCESS.toString()) ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
		return ResponseEntity.status(status).body(result);
	}

	@GetMapping("/company-find/{compId}")
	public ResponseEntity<CompanyProfile> getCompProfile(@PathVariable Long compId) {
		CompanyProfile company = companyService.findCompanyById(compId);
		HttpStatus status = company != null ? HttpStatus.OK : HttpStatus.NO_CONTENT;
		return ResponseEntity.status(status).body(company);
	}

	@GetMapping("/company-zone/{zoneId}")
	public ResponseEntity<CompanyProfile> getCompProfileByZone(@PathVariable Long zoneId) {
		CompanyProfile company = companyService.findCompanyByZoneId(zoneId);
		HttpStatus status = company != null ? HttpStatus.OK : HttpStatus.NO_CONTENT;
		return ResponseEntity.status(status).body(company);
	}

	@PostMapping("/upload")
	public ResponseEntity<String> uploadOtherImage(@ModelAttribute ImageDTO dto) {
		String imageName = companyService.uploadOtherImage(dto);
		return ResponseEntity.ok(imageName);
	}

	@PutMapping("/upload/edit/{id}")
	public ResponseEntity<String> editImage(@PathVariable("id") Long imageId, @RequestParam String type,
			@RequestParam(required = false) MultipartFile file) {
		String imageName = companyService.editImage(imageId, type, file);
		return ResponseEntity.ok(imageName);
	}

	@DeleteMapping("/upload/delete/{id}")
	public ResponseEntity<String> deleteImage(@PathVariable("id") Long imageId) {
		String result = companyService.deleteImage(imageId);
		return ResponseEntity.ok(result);
	}

	@GetMapping("/upload/all")
	public ResponseEntity<List<Images>> getAllImages() {
		List<Images> images = companyService.allImages();
		if (images == null || images.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(images);
	}
	@GetMapping("/get/upload/{type}")
	public ResponseEntity<List<Images>> getAllImages(@PathVariable String type) {
		List<Images> images = companyService.getByType(type);
		if (images == null || images.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(images);
	}

	@GetMapping("/upload/{id}")
	public ResponseEntity<Images> getImageById(@PathVariable("id") Long imageId) {
		Images image = companyService.image(imageId);
		if (image == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(image);
	}
}
