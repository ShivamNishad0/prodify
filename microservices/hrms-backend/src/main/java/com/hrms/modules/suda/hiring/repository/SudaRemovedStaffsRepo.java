package com.hrms.modules.suda.hiring.repository;

import com.hrms.modules.suda.hiring.models.SudaRemovedStaffs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SudaRemovedStaffsRepo extends JpaRepository<SudaRemovedStaffs,Long> {
    @Query(value = "SELECT * FROM suda.suda_removed_staffs WHERE emp_no=:emp_no", nativeQuery = true)
    SudaRemovedStaffs deactivationDetails(@Param("emp_no")String emp_no);

    @Query(value = "SELECT * FROM suda.suda_removed_staffs WHERE emp_no LIKE %:searchTerm%", nativeQuery = true)
    List<SudaRemovedStaffs> removedStaffDetails(@Param("searchTerm") String searchTerm);
}
