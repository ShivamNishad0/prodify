package com.hrms.modules.bhilai.hiring.repository;

import com.hrms.modules.bhilai.hiring.models.BhilaiRemovedStaffs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BhilaiRemovedStaffsRepo extends JpaRepository<BhilaiRemovedStaffs,Long> {
    @Query(value = "SELECT * FROM bhilai.bhilai_removed_staffs WHERE emp_no=:emp_no", nativeQuery = true)
    BhilaiRemovedStaffs deactivationDetails(@Param("emp_no") String emp_no);

    @Query(value = "SELECT * FROM bhilai.bhilai_removed_staffs WHERE emp_no LIKE %:searchTerm%", nativeQuery = true)
   List<BhilaiRemovedStaffs> removedStaffDetails(@Param("searchTerm") String searchTerm);
}
