package com.hrms.modules.suda.hiring.serviceImpl;

import com.hrms.modules.auth.service.UserServices;
import com.hrms.modules.dtos.*;
import com.hrms.modules.suda.hiring.models.*;
import com.hrms.modules.suda.hiring.repository.*;
import com.hrms.modules.suda.hiring.service.SudaStaffServices;
import com.hrms.modules.suda.payroll.modles.*;
import com.hrms.modules.suda.payroll.repository.*;
import com.hrms.modules.utilsServics.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SudaStaffServicesImpl implements SudaStaffServices {

	@Autowired
	private SudaStaffRepo staffRepo;
	@Autowired
	private SudaStaffQualificationRepo qualiRepo;
	@Autowired
	private SudaStaffAreaRepo areaRepo;
	@Autowired
	private ImageToLocalStorage fileService;
	@Autowired
	private EmpIdGenerator idGenerator;
	@Autowired
	private SudaStaffExprienceRepo expRepo;
	@Autowired
	private UserServices userService;
	@Autowired
	private SudaRemovedStaffsRepo removeStaffRepo;

	@Autowired
	private SudaIDCardRepo idCardRepo;
	@Autowired
	private SudaAttendanceDeatilsRepository attendanceDeatilsRepo;
	@Autowired
	private SudaSalaryEarnedRepository salaryEarnedRepo;
	@Autowired
	private SudaSalaryStructureRepo salaryStructureRepo;
	@Autowired
	private SudaStaffAssestsRepo assestsRepo;
	@Autowired
	private SudaStaffAttendanceRepository attendanceRepo;
	@Autowired
	private SudaStaffLeavesRepository leavesRepo;
	@Autowired
	private SudaStaffSalaryDetailsRepository salaryDetailsRepo;
	@Autowired
	private SudaStaffTargetDetailsRepository targetDetailsRepo;

	@Override
	public String saveStaffDetails(Actions action, Long staffId, NewStaffDTO newStaff) {
		switch (action.toString()) {
		case "CREATE_NEW":
			return handleNewStaff(newStaff);
		case "EDIT_OLD":
			return handleEditStaff(staffId, newStaff);
		default:
			return Result.INVALID_ACTION.toString();
		}
	}


	@Override
	public List<ResponseStaffDTO> allStaffs(Pageable pageable) {
	    Page<SudaStaff> staffPage = staffRepo.findAllStaffs(pageable);
	    List<ResponseStaffDTO> found = new ArrayList<>();
	    for (SudaStaff s : staffPage.getContent()) {
	        ResponseStaffDTO rsd = new ResponseStaffDTO();
	        found.add(mapForGet(rsd, s));
	    }
	    return found;
	}
	
	@Override
    public List<ResponseStaffDTO> allStaffsByZone(int size, int page, Long zoneId) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SudaStaff> staffPage = staffRepo.allStaffByZone( pageable);
        List<ResponseStaffDTO> found = new ArrayList<>();
        for (SudaStaff s : staffPage) {
            ResponseStaffDTO rsd = new ResponseStaffDTO();
            found.add(mapForGet(rsd, s));
        }	
        return found;
    }
	
	@Override
	public GetStaffAndStaffCountDTO allStaffsByZoneAndAreaSubDivision(int size, int page,String areaId,String type, String verified) {
	    Pageable pageable = PageRequest.of(page, size);
	    Page<SudaStaff> staffPage;
	    Long count;
		String active = type.equals("inactive")?"INACTIVE":"ACTIVE";
	    // Fetch the staff records based on the presence of areaId

	    if (!areaId.isEmpty()&&areaId !=null) {
	    	Long area = Long.parseLong(areaId);
	        staffPage = staffRepo.allStaffByZoneAndBySubDivision( area,active, verified, pageable);
			count = staffRepo.countStaffByZoneAndBySubDivision( area,verified);
	    } else {
	        staffPage = staffRepo.allStaff(active,pageable,verified);
	        count = staffRepo.countStaffByZoneAndBySubDivision(verified);
	    }

	    // Map the results to DTOs
	    List<ResponseStaffDTO> found = staffPage.stream()
	                                            .map(s -> mapForGet(new ResponseStaffDTO(), s))
	                                            .collect(Collectors.toList());

	    // Create and populate the result DTO
	    GetStaffAndStaffCountDTO staffDTO = new GetStaffAndStaffCountDTO();
	    staffDTO.setCount(count);
	    staffDTO.setResults(found);

	    return staffDTO;
	}

	
	
	@Override
	public ResponseStaffDTO staffByID(Long staffId) {
		SudaStaff staff = staffRepo.findById(staffId).get();
		if (staff != null) {
			ResponseStaffDTO rsd = new ResponseStaffDTO();
			return mapForGet(rsd, staff);
		}
		return null;
	}

	@Override
	public List<ResponseStaffDTO> staffByVerifiedStatus() {
		List<SudaStaff> staff = staffRepo.findStaffUnverifiedStatus();
		List<ResponseStaffDTO> found = new ArrayList<>();
		for (SudaStaff s : staff) {
			ResponseStaffDTO rsd = new ResponseStaffDTO();
			rsd = mapForGet(rsd, s);
			found.add(rsd);
			rsd = null;
		}
		return found;
	}

	@Override
	public List<ResponseStaffDTO> staffVerifiedStatus() {
		List<SudaStaff> staff = staffRepo.findStaffVerifiedStatus();
		List<ResponseStaffDTO> found = new ArrayList<>();
		for (SudaStaff s : staff) {
			ResponseStaffDTO rsd = new ResponseStaffDTO();
			rsd = mapForGet(rsd, s);
			found.add(rsd);
			rsd = null;
		}
		return found;
	}

	@Override
	public String generateOfferLetter(Long staffId, Long userId) {
		SudaStaff s = staffRepo.findById(staffId).get();
		String r1 = s.getVerified().toString();
		String r2 = s.getActive().toString();
		if (r1 == "VERIFIED" && r2 == "ACTIVE") {
			s.setOfferGenBy(userId.toString());
			s.setIsOfferGenrated(Status.TRUE);
			long timeInMillis = System.currentTimeMillis();
			Date now = new Date(timeInMillis);
			s.setOfferGenDate(now.toString());
			staffRepo.save(s);
			return Result.SUCCESS.toString();
		}
		return Result.INVALID_ACTION.toString();
	}

	@Override
	public String approveCandidate(Long staffId, Long userId) {
		SudaStaff s = staffRepo.findById(staffId).get();
		String active = s.getActive().toString();
		if (active == "ACTIVE") {
			s.setApprovBy(userId);
			s.setVerified(Status.VERIFIED);
			staffRepo.save(s);
			return Result.SUCCESS.toString();
		}
		return Result.INVALID_ACTION.toString();
	}

	@Override
	public String rejectCandidate(Long staffId, Long userId) {
		SudaStaff s = staffRepo.findById(staffId).get();
		String active = s.getActive().toString();
		if (active == "ACTIVE") {
			s.setApprovBy(userId);
			s.setVerified(Status.UNVERIFIED);
			staffRepo.save(s);
			return Result.SUCCESS.toString();
		}
		return Result.INVALID_ACTION.toString();
	}

	@Override
	public String fileUpload(String empNo, String fileOf, MultipartFile file) {
		Long staffId = Long.parseLong(empNo);
		SudaStaff staff = staffRepo.findById(staffId).get();
		String fileName = "";
		UUID uuid = UUID.randomUUID();
		switch (fileOf) {
		case "BANK":
			if (staff.getBankDoc() != null) {
				fileService.deleteFile(staff.getBankDoc(), "STAFF_DOC");
			}

			fileName = fileService.saveImage(file, uuid.toString(), "STAFF_DOC");
			staff.setBankDoc(fileName);
			break;

		case "AADHAR_BACK":
			if (staff.getAddharBackDoc() != null) {
				fileService.deleteFile(staff.getAddharBackDoc(), "STAFF_DOC");
			}
			fileName = fileService.saveImage(file, uuid.toString(), "STAFF_DOC");
			staff.setAddharBackDoc(fileName);
			break;

		case "AADHAR_FRONT":
			if (staff.getAddharFrontDoc() != null) {
				fileService.deleteFile(staff.getAddharFrontDoc(), "STAFF_DOC");
			}
			fileName = fileService.saveImage(file, uuid.toString(), "STAFF_DOC");
			staff.setAddharFrontDoc(fileName);
			break;

		case "PAN_BACK":
			if (staff.getPanBackDoc() != null) {
				fileService.deleteFile(staff.getPanBackDoc(), "STAFF_DOC");
			}
			fileName = fileService.saveImage(file, uuid.toString(), "STAFF_DOC");
			staff.setPanBackDoc(fileName);
			break;

		case "PAN_FRONT":
			if (staff.getPanFrontDoc() != null) {
				fileService.deleteFile(staff.getPanFrontDoc(), "STAFF_DOC");
			}
			fileName = fileService.saveImage(file, uuid.toString(), "STAFF_DOC");
			staff.setPanFrontDoc(fileName);
			break;

		case "CHARACTER":
			if (staff.getCharacterDoc() != null) {
				fileService.deleteFile(staff.getCharacterDoc(), "STAFF_DOC");
			}
			fileName = fileService.saveImage(file, uuid.toString(), "STAFF_DOC");
			staff.setCharacterDoc(fileName);
			break;

		case "USER_IMG":
			if (staff.getStaffImg() != null) {
				fileService.deleteFile(staff.getStaffImg(), "STAFF_IMG");
			}
			fileName = fileService.saveImage(file, uuid.toString(), "STAFF_IMG");
			staff.setStaffImg(fileName);
			break;

		default:
			return Result.WENT_WRONG.toString();
		}

		staffRepo.save(staff);
		return fileName;
	}

	@Override
	public String verifyCharacter(Long saffID) {
		SudaStaff staff = staffRepo.findById(saffID).get();

		if (staff.getVerified().equals(Status.VERIFIED)) {
			staff.setIsCharaterVerified(Status.TRUE);
			staffRepo.save(staff);
			return Result.SUCCESS.toString();
		}
		return Result.WENT_WRONG.toString();
	}

	@Override
	public String deleteStaff(RemoveStaffDTO data) {

		SudaStaff staff = staffRepo.findById(data.getStaffId()).get();
		if (staff!=null && staff.getActive().equals(Status.ACTIVE)){
			staff.setActive(Status.INACTIVE);
			staffRepo.save(staff);
			SudaRemovedStaffs staffs =new SudaRemovedStaffs();
			staffs.setStaffId(data.getStaffId());
			staffs.setRemovedBy(data.getRemovedBy());
			staffs.setSallaryStructureId(data.getSallaryStructureId());
			staffs.setAreaId(data.getAreaId());
			staffs.setMonth(data.getMonth());
			staffs.setYear(data.getYear());
			staffs.setEmpNo(data.getEmpNo());
			staffs.setLastWorkingDay(data.getLastWorkingDay());
			long timeInMillis = System.currentTimeMillis();
			staffs.setTimeStamp(new Timestamp(timeInMillis));
			removeStaffRepo.save(staffs);
			return Result.SUCCESS.toString();
		}else {
			return Result.ALREADY_DISABLED.toString();
		}
	}
	
	@Override
	public List<ResponseStaffDTO> tempForGetAllStaff() {
		List<SudaStaff> staff = staffRepo.findAll();
		List<ResponseStaffDTO> found = new ArrayList<>();
		for (SudaStaff s : staff) {
			ResponseStaffDTO rsd = new ResponseStaffDTO();
			rsd = mapForGet(rsd, s);
			found.add(rsd);
			rsd = null;
		}
		return found;
	}

	@Override
	public GetStaffAndStaffCountDTO findByTempEmp(String tempEmp, String type, String verified) {
		String active = type.equals("inactive")?"INACTIVE":"ACTIVE";
	    List<SudaStaff> staff = staffRepo.findStaffByTempEmp(tempEmp,active,verified);
	    List<ResponseStaffDTO> found = new ArrayList<>();
	    for (SudaStaff s : staff) {
	        ResponseStaffDTO rsd = new ResponseStaffDTO();
	        rsd = mapForGet(rsd, s);
	        found.add(rsd);
	    }
		Long count = staffRepo.countStaffByTempEmp(tempEmp,active);
		GetStaffAndStaffCountDTO staffDTO = new GetStaffAndStaffCountDTO();
	    staffDTO.setCount(count);
	    staffDTO.setResults(found);
	    return staffDTO;
	}

	@Override
	public CountAndStaffDetails findAllDeactivatedEmp(Pageable pageable) {
		Page<SudaStaff> staffPage = staffRepo.findAllStaffsDeactivated(pageable);
		CountAndStaffDetails data = new CountAndStaffDetails();
		long count = staffRepo.countStaffsDeactivated();
		data.setCount(count);
		data.setResults(staffPage.getContent());
		return data;
	}

	@Override
	public  SudaRemovedStaffs deactivationDetails(String emp_no){
		SudaRemovedStaffs staff = removeStaffRepo.deactivationDetails(emp_no);
        if (staff != null) {
            return staff;
        }
		return null;
	}

	//----------------------------------------------- supportive methods ----------------------------------------------------

	private String handleNewStaff(NewStaffDTO newStaff) {

		if (staffRepo.findStaffByContact(newStaff.getContactNo()) != null) {
			return Result.CONTACT_NO_ALREADY_EXIST.toString();
		}
		if (staffRepo.findStaffByTemp_emp(newStaff.getTempEmp()) != null) {
			return Result.EMP_NO_ALREADY_EXIST.toString();
		}

		SudaStaff staff = createOrUpdateStaff(new SudaStaff(), newStaff, "NEW");

		if (newStaff.getUser() != null) {
			try {
				String userResult = userService.addNewUser(newStaff.getUser());
				return userResult.equals(Result.SUCCESS.toString()) ? saveStaff(staff)
						: Result.ALLREADY_EXISTS.toString();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return saveStaff(staff);
	}

	private String handleEditStaff(Long staffId, NewStaffDTO newStaff) {
		// Fetch the existing staff, return NOT_FOUND if not found
		SudaStaff existingStaff = staffRepo.findById(staffId).orElse(null);
		if (existingStaff == null) {
			return Result.NOT_FOUND.toString();
		}

		// Check for account number conflicts if a new account number is provided
		if (newStaff.getAccountNumber() != null) {
			String accountConflictResult = handleAccountNumberConflict(newStaff, staffId);
			if (accountConflictResult != null) {
				return accountConflictResult;
			}
		}

		// Check for tempEmp conflicts
		if (newStaff.getTempEmp() != null) {
			SudaStaff staffWithTempEmp = staffRepo.findStaffByTemp_emp(newStaff.getTempEmp());
			if (staffWithTempEmp != null && !staffWithTempEmp.getStaffId().equals(staffId)) {
				return Result.TEMP_EMP_ALREADY_EXIST.toString();
			}
		}

		// Handle updates across multiple models when empNo changes
		if (newStaff.getTempEmp() != null && !newStaff.getTempEmp().equals(existingStaff.getTempEmp())) {
			String empNoUpdateResult = updateEmpNoInRelatedModels(existingStaff.getTempEmp(), newStaff.getTempEmp());
			if (!empNoUpdateResult.equals(Result.EMP_NO_UPDATE_SUCCESS.toString())) {
				return empNoUpdateResult; // Handle errors during multi-model update
			}
		}

		// Update and save the staff
		existingStaff = createOrUpdateStaff(existingStaff, newStaff, "EDIT");
		return saveStaff(existingStaff);
	}

	private String handleAccountNumberConflict(NewStaffDTO newStaff, Long staffId) {
		// Find staff by account number and ensure it's not the current staff being
		// updated
		SudaStaff staffWithNewAccount = staffRepo.findStaffByAccount(newStaff.getAccountNumber());
		if (staffWithNewAccount != null && !staffWithNewAccount.getStaffId().equals(staffId)) {
			return Result.ACCOUNT_NO_ALREADY_EXIST.toString();
		}
		return null;
	}

	@Transactional
	private String updateEmpNoInRelatedModels(String oldEmpNo, String newEmpNo) {
		try {
			// Update empNo in SudaStaff
			SudaStaff staff = staffRepo.findStaffByTemp_emp(oldEmpNo);
			if (staff != null) {
				staff.setTempEmp(newEmpNo);
				staffRepo.save(staff);
			}

			// Update empNo in SudaIDCard
			SudaIDCard card = idCardRepo.findByEmpNo(oldEmpNo);
			if (card != null) {
				card.setEmpNo(newEmpNo);
				idCardRepo.save(card);
			}

			// Batch update for SudaAttendanceDeatils
			List<SudaAttendanceDeatils> attendanceDetails = attendanceDeatilsRepo.findByEmpNo(oldEmpNo);
			if (!attendanceDetails.isEmpty()) {
				attendanceDetails.forEach(details -> details.setEmpNo(newEmpNo));
				attendanceDeatilsRepo.saveAll(attendanceDetails);
			}

			// Batch update for SudaSalaryEarned
			List<SudaSalaryEarned> salaryEarned = salaryEarnedRepo.findByEmpNo(oldEmpNo);
			if (!salaryEarned.isEmpty()) {
				salaryEarned.forEach(details -> details.setEmpNo(newEmpNo));
				salaryEarnedRepo.saveAll(salaryEarned);
			}

			// Update empNo in SudaSalaryStructure
			SudaSalaryStructure salaryStructure = salaryStructureRepo.findByEmpNo(oldEmpNo);
			if (salaryStructure != null) {
				salaryStructure.setEmpNo(newEmpNo);
				salaryStructureRepo.save(salaryStructure);
			}

			// Batch update for SudaStaffAssests
			List<SudaStaffAssests> staffAssests = assestsRepo.findByEmpNo(oldEmpNo);
			if (!staffAssests.isEmpty()) {
				staffAssests.forEach(asset -> asset.setEmpNo(newEmpNo));
				assestsRepo.saveAll(staffAssests);
			}

			// Batch update for SudaStaffAttendance
			List<SudaStaffAttendance> attendances = attendanceRepo.findStaffByEmpNo(oldEmpNo);
			if (!attendances.isEmpty()) {
				attendances.forEach(details -> details.setEmpNo(newEmpNo));
				attendanceRepo.saveAll(attendances);
			}

			// Batch update for SudaStaffLeaves
			List<SudaStaffLeaves> staffLeaves = leavesRepo.findLeaveByEmp_no(oldEmpNo);
			if (!staffLeaves.isEmpty()) {
				staffLeaves.forEach(leave -> leave.setEmpNo(newEmpNo));
				leavesRepo.saveAll(staffLeaves);
			}

			// Batch update for SudaStaffSalaryDetails
			List<SudaStaffSalaryDetails> salaryDetails = salaryDetailsRepo.findStaffByEmpNo(oldEmpNo);
			if (!salaryDetails.isEmpty()) {
				salaryDetails.forEach(salaryDetail -> salaryDetail.setEmpNo(newEmpNo));
				salaryDetailsRepo.saveAll(salaryDetails);
			}

			// Batch update for SudaStaffTargetDetails
			List<SudaStaffTargetDetails> targetDetails = targetDetailsRepo.findByEmpNo(oldEmpNo);
			if (!targetDetails.isEmpty()) {
				targetDetails.forEach(targetDetail -> targetDetail.setEmpNo(newEmpNo));
				targetDetailsRepo.saveAll(targetDetails);
			}

			return Result.EMP_NO_UPDATE_SUCCESS.toString();
		} catch (Exception ex) {
			// Log the error
			System.err.println("Error updating empNo in related models: " + ex.getMessage());
			return Result.EMP_NO_UPDATE_FAILED.toString();
		}
	}


//	private String handleNewStaff(NewStaffDTO newStaff) {
//
//		if (staffRepo.findStaffByContact(newStaff.getContactNo()) != null) {
//			return Result.ALLREADY_EXISTS.toString();
//		}
//		if (staffRepo.findStaffByTemp_emp(newStaff.getTempEmp()) != null) {
//			return Result.ALLREADY_EXISTS.toString();
//		}
//
//		SudaStaff staff = createOrUpdateStaff(new SudaStaff(), newStaff, "NEW");
//
//		if (newStaff.getUser() != null) {
//			try {
//				String userResult = userService.addNewUser(newStaff.getUser());
//				return userResult.equals(Result.SUCCESS.toString()) ? saveStaff(staff)
//						: Result.ALLREADY_EXISTS.toString();
//			} catch (Exception e) {
//				e.printStackTrace();
//			}
//		}
//		return saveStaff(staff);
//	}
//
//	private String handleEditStaff(Long staffId, NewStaffDTO newStaff) {
//		Optional<SudaStaff> optionalStaff = staffRepo.findById(staffId);
//		if (!optionalStaff.isPresent()) {
//			return Result.NOT_FOUND.toString();
//		}
//
//		SudaStaff existingStaff = optionalStaff.get();
//		existingStaff = createOrUpdateStaff(existingStaff, newStaff, "EDIT");
//
//		return saveStaff(existingStaff);
//	}

	private SudaStaff createOrUpdateStaff(SudaStaff staff, NewStaffDTO newStaff, String action) {
		staff.setDesigId(newStaff.getDesigId());
		staff.setName(newStaff.getName());
		staff.setFname(newStaff.getFname());
		staff.setDob(newStaff.getDob());
		staff.setAge(newStaff.getAge() == null ? 0 : Integer.parseInt(newStaff.getAge()));
		staff.setGender(newStaff.getGender());
		staff.setMaritalStatus(newStaff.getMaritalStatus());
		staff.setContactNo(newStaff.getContactNo());
		staff.setPaddress(newStaff.getPaddress());
		staff.setCaddress(newStaff.getCaddress());
		staff.setEmail(newStaff.getEmail());
		staff.setAadharNo(newStaff.getAadharNo());
		staff.setPanCard(newStaff.getPanCard());
		staff.setExEmp(newStaff.getExEmp());
		staff.setIdCopy(newStaff.getIdCopy());
		staff.setDlNo(newStaff.getDlNo());
		staff.setDlExpDate(newStaff.getDlExpDate());
		staff.setDeclaration(newStaff.getDeclaration());
		long timeInMillis = System.currentTimeMillis();
		Date now = new Date(timeInMillis);
		staff.setFilledDate(now);
		staff.setPlace(newStaff.getPlace());
		staff.setFilledBy(Long.parseLong(newStaff.getFilledBy()));
		staff.setBloodGroup(newStaff.getBloodGroup());
		staff.setAccountNumber(newStaff.getAccountNumber());
		staff.setBankName(newStaff.getBankName());
		staff.setBranch(newStaff.getBranch());
		staff.setIfscCode(newStaff.getIfscCode());
		if (action.equals("EDIT")) {
			staff.setAreaId(newStaff.getAreaId());

		}
		if (!action.equals("EDIT")) {
			staff.setIsOfferGenrated(Status.FALSE);
			staff.setIsIdGenrated(Status.FALSE);
			staff.setVerified(Status.UNVERIFIED);
			staff.setIdStatus(Status.INACTIVE);
			staff.setEmpNo(idGenerator.getEmpId());
			staff.setAreaId(newStaff.getAreaId());
			staff.setIsAssetAlloted(Status.FALSE);
			staff.setIsCharaterVerified(Status.FALSE);
			SudaStaff sc = staffRepo.getLatest();
			staff.setSampleId((sc == null || sc.getSampleId() == null) ? 10001 : sc.getSampleId() + 1);
		}
		staff.setEmergencyRelation(newStaff.getEmergencyRelation());
		staff.setEmergencyMobile(newStaff.getEmergencyMobile());
		staff.setStreet1(newStaff.getStreet1());
		staff.setStreet2(newStaff.getStreet2());
		staff.setCity(newStaff.getCity());
		staff.setState(newStaff.getState());
		staff.setNationality(newStaff.getNationality());
		staff.setPincode(newStaff.getPincode());
		staff.setJobSpecification(newStaff.getJobSpecification());
		staff.setJobCat(newStaff.getJobCat());
		staff.setContractStartDate(newStaff.getContractStartDate());
		staff.setContractEndDate(newStaff.getContractEndDate());
		staff.setDepartmentId(newStaff.getDepartmentId());
		staff.setTempEmp(newStaff.getTempEmp());
		staff.setDateOfJoining(newStaff.getDateOfJoining());
		
		staff.setActive(Status.ACTIVE);
		staff.setStamp(new Timestamp(timeInMillis));

		return staff;
	}

	private String saveStaff(SudaStaff staff) {
		SudaStaff savedStaff = staff != null ? staffRepo.save(staff) : null;
		List<String> messages = new ArrayList<>();
		if (savedStaff != null) {
			String message = "staffId=" + savedStaff.getStaffId().toString();
			messages.add(message);
			return message;
		}
		return Result.WENT_WRONG.toString();
	}

	public ResponseStaffDTO mapForGet(ResponseStaffDTO rsd, SudaStaff s) {
		rsd.setDesigId(s.getDesigId());
		rsd.setStaffId(s.getStaffId().toString());
		rsd.setName(s.getName());
		rsd.setFname(s.getFname());
		rsd.setDob(s.getDob());
		rsd.setAge(s.getAge());
		rsd.setGender(s.getGender());
		rsd.setNationality(s.getNationality());
		rsd.setMaritalStatus(s.getMaritalStatus());
		rsd.setContactNo(s.getContactNo());
		rsd.setEmergencyRelation(s.getEmergencyRelation());
		rsd.setEmergencyMobile(s.getEmergencyMobile());
		rsd.setStreet1(s.getStreet1());
		rsd.setStreet2(s.getStreet2());
		rsd.setCity(s.getCity());
		rsd.setState(s.getState());
		rsd.setPincode(s.getPincode());
		rsd.setJobSpecification(s.getJobSpecification());
		rsd.setJobCat(s.getJobCat());
		rsd.setContractStartDate(s.getContractStartDate());
		rsd.setContractEndDate(s.getContractEndDate());
		rsd.setEmail(s.getEmail());
		rsd.setStaffImg(s.getStaffImg());
		rsd.setAadharNo(s.getAadharNo());
		rsd.setPanCard(s.getPanCard());
		rsd.setDlNo(s.getDlNo());
		rsd.setDlExpDate(s.getDlExpDate());
		rsd.setBankDoc(s.getBankDoc());
		rsd.setExEmp(s.getExEmp());
		rsd.setIdCopy(s.getIdCopy());
		rsd.setDeclaration(s.getDeclaration());
		rsd.setFilledDate(s.getFilledDate());
		rsd.setPlace(s.getPlace());
		rsd.setFilledBy(s.getFilledBy());
		rsd.setDepartmentId(s.getDepartmentId() != null ? s.getDepartmentId().toString() : "");
		rsd.setStamp(s.getStamp());
		rsd.setDateOfJoining(s.getDateOfJoining());
		List<SudaStaffQualification> quali = qualiRepo.findByStaffId(s.getStaffId());
		List<QualificationDTO> qq = new ArrayList<>();
		for (SudaStaffQualification d : quali) {
			QualificationDTO qd = new QualificationDTO();
			qd.setQualiFication(d.getQualiFication());
			qd.setQualiFication(d.getQualiFication());
			qd.setUniv(d.getUniv());
			qd.setMarks(d.getMarks());
			qd.setStartDate(d.getStartDate());
			qd.setEndDate(d.getEndDate());
			qd.setQualiID(d.getQid());
			qq.add(qd);
			qd = null;
		}

		List<SudaStaffExprience> exps = expRepo.findByStaff(s.getStaffId());
		List<StaffExprienceDTOS> exs = new ArrayList<>();
		for (SudaStaffExprience se : exps) {
			StaffExprienceDTOS exp = new StaffExprienceDTOS();
			exp.setStaffExpId(se.getStaffExpId());
			exp.setStaffId(se.getStaffId());
			exp.setEmapNo(se.getEmapNo());
			exp.setCompanyName(se.getCompanyName());
			exp.setDateFrom(se.getDateFrom());
			exp.setDateTo(se.getDateTo());
			exp.setDesignation(se.getDesignation());
			exp.setTotalYear(se.getTotalYear());
			exp.setLocation(se.getLocation());
			exp.setRemarks(se.getRemarks());
			exs.add(exp);
			exp = null;
		}
		rsd.setExp(!exs.isEmpty() ? exs : null);
		Optional<SudaStaffArea> optionalArea = Optional.ofNullable(s.getAreaId()).flatMap(areaRepo::findById);

		optionalArea.ifPresent(a -> {
			StaffAreaDTO sd = new StaffAreaDTO();
			sd.setArea(a.getArea());
			sd.setCircle(a.getCircle());
			sd.setDivision(a.getDivision());
			sd.setSubDivision(a.getSubDivision());
			rsd.setArea(sd);
		});

		if (!optionalArea.isPresent()) {
			rsd.setArea(null);
		}
		rsd.setQuali(qq);
		rsd.setActive(s.getActive().toString());
		rsd.setVerified(s.getVerified() != null ? s.getVerified().toString() : "N/A");
		rsd.setIdStatus(s.getIdStatus() != null ? s.getIdStatus().toString() : "N/A");
		rsd.setCharacterDoc(s.getCharacterDoc());
		rsd.setIsOfferGenrated(s.getIsOfferGenrated() != null ? s.getIsOfferGenrated().toString() : "N/A");
		rsd.setEmpNo(s.getEmpNo());
		rsd.setPanFrontDoc(s.getPanFrontDoc());
		rsd.setPanBackDoc(s.getPanBackDoc());
		rsd.setAddharFrontDoc(s.getAddharFrontDoc());
		rsd.setAddharBackDoc(s.getAddharBackDoc());
		rsd.setBloodGroup(s.getBloodGroup());
		rsd.setIsIdGenrated(s.getIsIdGenrated() != null ? s.getIsIdGenrated().toString() : "NULL");
		rsd.setAccountNumber(s.getAccountNumber());
		rsd.setBankName(s.getBankName());
		rsd.setBranch(s.getBranch());
		rsd.setIfscCode(s.getIfscCode());
		rsd.setIsAssetGenrated(s.getIsIdGenrated() != null ? s.getIsAssetAlloted().toString() : "N/A");
		rsd.setOfferGenBy(s.getOfferGenBy());
		rsd.setOfferGenDate(s.getOfferGenDate());
		rsd.setDateOfJoining(s.getDateOfJoining());
		rsd.setIsCharaterVerified(s.getIsCharaterVerified() != null ? s.getIsCharaterVerified().toString() : "");
		rsd.setTempEmp(s.getTempEmp());
		rsd.setApprovBy(s.getApprovBy() != null ? s.getApprovBy().toString() : "N/A");
		rsd.setPstreet1(s.getPstreet1());
		rsd.setPstreet2(s.getPstreet2());
		rsd.setPcity(s.getPcity());
		rsd.setPstate(s.getPstate());
		rsd.setPpincode(s.getPpincode());
		return rsd;
	}

}
