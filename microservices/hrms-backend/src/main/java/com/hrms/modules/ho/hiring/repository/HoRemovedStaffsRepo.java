package com.hrms.modules.ho.hiring.repository;

import com.hrms.modules.ho.hiring.models.HoRemovedStaffs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HoRemovedStaffsRepo extends JpaRepository<HoRemovedStaffs,Long> {
    @Query(value = "SELECT * FROM ho.ho_removed_staffs WHERE emp_no=:emp_no", nativeQuery = true)
    HoRemovedStaffs deactivationDetails(@Param("emp_no") String emp_no);

    @Query(value = "SELECT * FROM ho.ho_removed_staffs WHERE emp_no LIKE %:searchTerm%", nativeQuery = true)
    List<HoRemovedStaffs> removedStaffDetails(@Param("searchTerm") String searchTerm);
}
