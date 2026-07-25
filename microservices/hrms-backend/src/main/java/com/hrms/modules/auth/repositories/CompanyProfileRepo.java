package com.hrms.modules.auth.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hrms.modules.auth.models.CompanyProfile;


public interface CompanyProfileRepo extends JpaRepository<CompanyProfile, Long> {

	@Query(value = "SELECT * FROM company_profile WHERE zone_id =:zone_id", nativeQuery = true)
	CompanyProfile findCompanyByZoneId(@Param("zone_id")Long zone_id);
}
