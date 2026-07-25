package com.hrms.modules.ho.payroll.repository;


import com.hrms.modules.ho.payroll.modles.HoAssest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HoStaffAssestRepository extends JpaRepository<HoAssest, Long> {

	HoAssest findByAssetName(String assetName);

}
