package com.hrms.modules.dmc.hiring.repository;

import com.hrms.modules.dmc.hiring.models.DmcRemovedStaffs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DmcRemovedStaffsRepo extends JpaRepository<DmcRemovedStaffs,Long> {
    @Query(value = "SELECT * FROM dmc.dmc_removed_staffs WHERE emp_no=:emp_no", nativeQuery = true)
    DmcRemovedStaffs deactivationDetails(@Param("emp_no") String emp_no);

    @Query(value = "SELECT * FROM dmc.dmc_removed_staffs WHERE emp_no LIKE %:searchTerm%", nativeQuery = true)
    List<DmcRemovedStaffs> removedStaffDetails(@Param("searchTerm") String searchTerm);

}
