package com.hrms.modules.dmc.payroll.repository;


import com.hrms.modules.dmc.payroll.modles.DmcAssest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DmcStaffAssestRepository extends JpaRepository<DmcAssest, Long> {

	DmcAssest findByAssetName(String assetName);

}
