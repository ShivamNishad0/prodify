package com.hrms.modules.rmc.hiring.repository;

import com.hrms.modules.rmc.hiring.models.RmcRemovedStaffs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RmcRemovedStaffsRepo extends JpaRepository<RmcRemovedStaffs,Long> {
    @Query(value = "SELECT * FROM rmc.rmc_removed_staffs WHERE emp_no=:emp_no", nativeQuery = true)
    RmcRemovedStaffs deactivationDetails(@Param("emp_no") String emp_no);

    @Query(value = "SELECT * FROM rmc.rmc_removed_staffs WHERE emp_no LIKE %:searchTerm%", nativeQuery = true)
    List<RmcRemovedStaffs> removedStaffDetails(@Param("searchTerm") String searchTerm);
}
