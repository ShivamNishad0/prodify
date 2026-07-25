package com.hrms.modules.bijli.payroll.repository;


import com.hrms.modules.bijli.payroll.modles.BijliAssest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BijliStaffAssestRepository extends JpaRepository<BijliAssest, Long> {

	BijliAssest findByAssetName(String assetName);

}
