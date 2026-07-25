package com.hrms.modules.rmc.payroll.repository;


import com.hrms.modules.rmc.payroll.modles.RmcAssest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RmcStaffAssestRepository extends JpaRepository<RmcAssest, Long> {

	RmcAssest findByAssetName(String assetName);

}
