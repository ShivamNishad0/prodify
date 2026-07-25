package com.hrms.modules.auth.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import com.hrms.modules.auth.models.Images;

public interface ImagesRepo extends JpaRepository<Images, Long> {

	@Query(value="Select * images where image_type=:imageType",nativeQuery = true)
	List<Images>  imageByType(@Param("imageType") String imageType);
}
