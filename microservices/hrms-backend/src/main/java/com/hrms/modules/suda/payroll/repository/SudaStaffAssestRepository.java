package com.hrms.modules.suda.payroll.repository;


import com.hrms.modules.suda.payroll.modles.SudaAssest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SudaStaffAssestRepository extends JpaRepository<SudaAssest, Long> {

	SudaAssest findByAssetName(String assetName);

}
