package com.hrms.modules.bhilai.payroll.repository;


import com.hrms.modules.bhilai.payroll.modles.BhilaiAssest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BhilaiStaffAssestRepository extends JpaRepository<BhilaiAssest, Long> {

	BhilaiAssest findByAssetName(String assetName);

}
