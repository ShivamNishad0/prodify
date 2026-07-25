package com.hrms.modules.bijli.hiring.repository;

import com.hrms.modules.bijli.hiring.models.BijliRemovedStaffs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BijliRemovedStaffsRepo extends JpaRepository<BijliRemovedStaffs,Long> {
    @Query(value = "SELECT * FROM bijli.bijli_removed_staffs WHERE emp_no=:emp_no", nativeQuery = true)
    BijliRemovedStaffs deactivationDetails(@Param("emp_no") String emp_no);

    @Query(value = "SELECT * FROM bijli.bijli_removed_staffs WHERE emp_no LIKE %:searchTerm%", nativeQuery = true)
    List<BijliRemovedStaffs> removedStaffDetails(@Param("searchTerm") String searchTerm);
}
