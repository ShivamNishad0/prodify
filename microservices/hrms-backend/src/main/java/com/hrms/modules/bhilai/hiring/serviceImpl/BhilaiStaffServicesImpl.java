package com.hrms.modules.bhilai.hiring.serviceImpl;

import com.hrms.modules.auth.service.UserServices;
import com.hrms.modules.bhilai.hiring.models.*;
import com.hrms.modules.bhilai.hiring.repository.*;
import com.hrms.modules.bhilai.hiring.service.BhilaiStaffServices;
import com.hrms.modules.bhilai.payroll.modles.*;
import com.hrms.modules.bhilai.payroll.repository.*;
import com.hrms.modules.dtos.*;
import com.hrms.modules.utilsServics.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BhilaiStaffServicesImpl implements BhilaiStaffServices {

	@Autowired
	private BhilaiStaffRepo staffRepo;
	@Autowired
	private BhilaiStaffQualificationRepo qualiRepo;
	@Autowired
	private BhilaiStaffAreaRepo areaRepo;
	@Autowired
	private ImageToLocalStorage fileService;
	@Autowired
	private EmpIdGenerator idGenerator;
	@Autowired
	private BhilaiStaffExprienceRepo expRepo;
	@Autowired
	private UserServices userService;
	@Autowired
	private BhilaiRemovedStaffsRepo removeStaffRepo;
	@Autowired
	private  BhilaiIDCardRepo idCardRepo;
	@Autowired
	private BhilaiAttendanceDeatilsRepository attendanceDeatilsRepo;
	@Autowired
	private BhilaiSalaryEarnedRepository salaryEarnedRepo;
	@Autowired
	private BhilaiSalaryStructureRepo salaryStructureRepo;
	@Autowired
	private BhilaiStaffAssestsRepo assestsRepo;
	@Autowired
	private BhilaiStaffAttendanceRepository attendanceRepo;
	@Autowired
	private BhilaiStaffLeavesRepository leavesRepo;
	@Autowired
	private BhilaiStaffSalaryDetailsRepository salaryDetailsRepo;
	@Autowired
	private BhilaiStaffTargetDetailsRepository targetDetailsRepo;

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
	    Page<BhilaiStaff> staffPage = staffRepo.findAllStaffs(pageable);
	    List<ResponseStaffDTO> found = new ArrayList<>();
	    for (BhilaiStaff s : staffPage.getContent()) {
	        ResponseStaffDTO rsd = new ResponseStaffDTO();
	        found.add(mapForGet(rsd, s));
	    }
	    return found;
	}
	
	@Override
    public List<ResponseStaffDTO> allStaffsByZone(int size, int page) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BhilaiStaff> staffPage = staffRepo.allStaffByZone( pageable);
        List<ResponseStaffDTO> found = new ArrayList<>();
        for (BhilaiStaff s : staffPage) {
            ResponseStaffDTO rsd = new ResponseStaffDTO();
            found.add(mapForGet(rsd, s));
        }	
        return found;
    }
	
	@Override
	public GetStaffAndStaffCountDTO allStaffsByZoneAndAreaSubDivision(int size, int page, String areaId,String type, String verified) {
	    Pageable pageable = PageRequest.of(page, size);
	    Page<BhilaiStaff> staffPage;
	    Long count;

		String active = type.equals("inactive")?"INACTIVE":"ACTIVE";

	    // Fetch the staff records based on the presence of areaId
	    if (!areaId.isEmpty()&&areaId !=null) {
	    	Long area = Long.parseLong(areaId);
	        staffPage = staffRepo.allStaffByZoneAndBySubDivision( area,active, verified, pageable);
	        count = staffRepo.countStaffByZoneAndBySubDivision( area,active, verified);
	    } else {
	        staffPage = staffRepo.allStaffByBySubDivision(active,pageable, verified);
	        count = staffRepo.countStaffByZoneAndBySubDivision(active, verified);
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
		BhilaiStaff bhilaiStaff = staffRepo.findById(staffId).get();
		if (bhilaiStaff != null) {
			ResponseStaffDTO rsd = new ResponseStaffDTO();
			return mapForGet(rsd, bhilaiStaff);
		}
		return null;
	}

	@Override
	public List<ResponseStaffDTO> staffByVerifiedStatus() {
		List<BhilaiStaff> bhilaiStaffs = staffRepo.findStaffUnverifiedStatus();
		List<ResponseStaffDTO> found = new ArrayList<>();
		for (BhilaiStaff s : bhilaiStaffs) {
			ResponseStaffDTO rsd = new ResponseStaffDTO();
			rsd = mapForGet(rsd, s);
			found.add(rsd);
			rsd = null;
		}
		return found;
	}

	@Override
	public List<ResponseStaffDTO> staffVerifiedStatus() {
		List<BhilaiStaff> bhilaiStaffs = staffRepo.findStaffVerifiedStatus();
		List<ResponseStaffDTO> found = new ArrayList<>();
		for (BhilaiStaff s : bhilaiStaffs) {
			ResponseStaffDTO rsd = new ResponseStaffDTO();
			rsd = mapForGet(rsd, s);
			found.add(rsd);
			rsd = null;
		}
		return found;
	}

	@Override
	public String generateOfferLetter(Long staffId, Long userId) {
		BhilaiStaff s = staffRepo.findById(staffId).get();
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
		BhilaiStaff s = staffRepo.findById(staffId).get();
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
		BhilaiStaff s = staffRepo.findById(staffId).get();
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
		BhilaiStaff bhilaiStaff = staffRepo.findById(staffId).get();
		String fileName = "";
		UUID uuid = UUID.randomUUID();
		switch (fileOf) {
		case "BANK":
			if (bhilaiStaff.getBankDoc() != null) {
				fileService.deleteFile(bhilaiStaff.getBankDoc(), "STAFF_DOC");
			}

			fileName = fileService.saveImage(file, uuid.toString(), "STAFF_DOC");
			bhilaiStaff.setBankDoc(fileName);
			break;

		case "AADHAR_BACK":
			if (bhilaiStaff.getAddharBackDoc() != null) {
				fileService.deleteFile(bhilaiStaff.getAddharBackDoc(), "STAFF_DOC");
			}
			fileName = fileService.saveImage(file, uuid.toString(), "STAFF_DOC");
			bhilaiStaff.setAddharBackDoc(fileName);
			break;

		case "AADHAR_FRONT":
			if (bhilaiStaff.getAddharFrontDoc() != null) {
				fileService.deleteFile(bhilaiStaff.getAddharFrontDoc(), "STAFF_DOC");
			}
			fileName = fileService.saveImage(file, uuid.toString(), "STAFF_DOC");
			bhilaiStaff.setAddharFrontDoc(fileName);
			break;

		case "PAN_BACK":
			if (bhilaiStaff.getPanBackDoc() != null) {
				fileService.deleteFile(bhilaiStaff.getPanBackDoc(), "STAFF_DOC");
			}
			fileName = fileService.saveImage(file, uuid.toString(), "STAFF_DOC");
			bhilaiStaff.setPanBackDoc(fileName);
			break;

		case "PAN_FRONT":
			if (bhilaiStaff.getPanFrontDoc() != null) {
				fileService.deleteFile(bhilaiStaff.getPanFrontDoc(), "STAFF_DOC");
			}
			fileName = fileService.saveImage(file, uuid.toString(), "STAFF_DOC");
			bhilaiStaff.setPanFrontDoc(fileName);
			break;

		case "CHARACTER":
			if (bhilaiStaff.getCharacterDoc() != null) {
				fileService.deleteFile(bhilaiStaff.getCharacterDoc(), "STAFF_DOC");
			}
			fileName = fileService.saveImage(file, uuid.toString(), "STAFF_DOC");
			bhilaiStaff.setCharacterDoc(fileName);
			break;

		case "USER_IMG":
			if (bhilaiStaff.getStaffImg() != null) {
				fileService.deleteFile(bhilaiStaff.getStaffImg(), "STAFF_IMG");
			}
			fileName = fileService.saveImage(file, uuid.toString(), "STAFF_IMG");
			bhilaiStaff.setStaffImg(fileName);
			break;

		default:
			return Result.WENT_WRONG.toString();
		}

		staffRepo.save(bhilaiStaff);
		return fileName;
	}

	@Override
	public String verifyCharacter(Long saffID) {
		BhilaiStaff bhilaiStaff = staffRepo.findById(saffID).get();

		if (bhilaiStaff.getVerified().equals(Status.VERIFIED)) {
			bhilaiStaff.setIsCharaterVerified(Status.TRUE);
			staffRepo.save(bhilaiStaff);
			return Result.SUCCESS.toString();
		}
		return Result.WENT_WRONG.toString();
	}

	@Override
	public String deleteStaff(RemoveStaffDTO data) {
		BhilaiStaff staff = staffRepo.findById(data.getStaffId()).get();
		if (staff!=null && staff.getActive().equals(Status.ACTIVE)){
			staff.setActive(Status.INACTIVE);
			staffRepo.save(staff);
			BhilaiRemovedStaffs staffs =new BhilaiRemovedStaffs();
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
		List<BhilaiStaff> bhilaiStaffs = staffRepo.findAll();
		List<ResponseStaffDTO> found = new ArrayList<>();
		for (BhilaiStaff s : bhilaiStaffs) {
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
	    List<BhilaiStaff> bhilaiStaffs = staffRepo.findStaffByTempEmp(tempEmp,active, verified);
	    List<ResponseStaffDTO> found = new ArrayList<>();
	    for (BhilaiStaff s : bhilaiStaffs) {
	        ResponseStaffDTO rsd = new ResponseStaffDTO();
	        rsd = mapForGet(rsd, s);
	        found.add(rsd);
	    }
		Long count = staffRepo.countStaffByTempEmp(tempEmp,active, verified);
		GetStaffAndStaffCountDTO staffDTO = new GetStaffAndStaffCountDTO();
	    staffDTO.setCount(count);
	    staffDTO.setResults(found);
	    return staffDTO;
	}

	@Override
	public CountAndStaffDetails findAllDeactivatedEmp(Pageable pageable) {
		Page<BhilaiStaff> staffPage = staffRepo.findAllStaffsDeactivated(pageable);
		CountAndStaffDetails data = new CountAndStaffDetails();
		long count = staffRepo.countStaffsDeactivated();
		data.setCount(count);
		data.setResults(staffPage.getContent());
		return data;
	}

	@Override
	public  BhilaiRemovedStaffs deactivationDetails(String emp_no){
		BhilaiRemovedStaffs staff = removeStaffRepo.deactivationDetails(emp_no);
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


		BhilaiStaff staff = createOrUpdateStaff(new BhilaiStaff(), newStaff, "NEW");

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
		BhilaiStaff existingStaff = staffRepo.findById(staffId).orElse(null);
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
			BhilaiStaff staffWithTempEmp = staffRepo.findStaffByTemp_emp(newStaff.getTempEmp());
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
		// Find staff by account number and ensure it's not the current staff being updated
		BhilaiStaff staffWithNewAccount = staffRepo.findStaffByAccount(newStaff.getAccountNumber());
		if (staffWithNewAccount != null && !staffWithNewAccount.getStaffId().equals(staffId)) {
			return Result.ACCOUNT_NO_ALREADY_EXIST.toString();
		}
		return null;
	}

	@Transactional
	private String updateEmpNoInRelatedModels(String oldEmpNo, String newEmpNo) {
		try {
			// Update empNo in BhilaiStaff
			BhilaiStaff staff = staffRepo.findStaffByTemp_emp(oldEmpNo);
			if (staff != null) {
				staff.setTempEmp(newEmpNo);
				staffRepo.save(staff);
			}

			// Update empNo in BhilaiIDCard
			BhilaiIDCard card = idCardRepo.findByEmpNo(oldEmpNo);
			if (card != null) {
				card.setEmpNo(newEmpNo);
				idCardRepo.save(card);
			}

			// Batch update for BhilaiAttendanceDeatils
			List<BhilaiAttendanceDeatils> attendanceDetails = attendanceDeatilsRepo.findByEmpNo(oldEmpNo);
			if (!attendanceDetails.isEmpty()) {
				attendanceDetails.forEach(details -> details.setEmpNo(newEmpNo));
				attendanceDeatilsRepo.saveAll(attendanceDetails);
			}

			// Batch update for BhilaiSalaryEarned
			List<BhilaiSalaryEarned> salaryEarned = salaryEarnedRepo.findByEmpNo(oldEmpNo);
			if (!salaryEarned.isEmpty()) {
				salaryEarned.forEach(details -> details.setEmpNo(newEmpNo));
				salaryEarnedRepo.saveAll(salaryEarned);
			}

			// Update empNo in BhilaiSalaryStructure
			BhilaiSalaryStructure salaryStructure = salaryStructureRepo.findByEmpNo(oldEmpNo);
			if (salaryStructure != null) {
				salaryStructure.setEmpNo(newEmpNo);
				salaryStructureRepo.save(salaryStructure);
			}

			// Batch update for BhilaiStaffAssests
			List<BhilaiStaffAssests> staffAssests = assestsRepo.findByEmpNo(oldEmpNo);
			if (!staffAssests.isEmpty()) {
				staffAssests.forEach(asset -> asset.setEmpNo(newEmpNo));
				assestsRepo.saveAll(staffAssests);
			}

			// Batch update for BhilaiStaffAttendance
			List<BhilaiStaffAttendance> attendances = attendanceRepo.findStaffByEmpNo(oldEmpNo);
			if (!attendances.isEmpty()) {
				attendances.forEach(details -> details.setEmpNo(newEmpNo));
				attendanceRepo.saveAll(attendances);
			}

			// Batch update for BhilaiStaffLeaves
			List<BhilaiStaffLeaves> staffLeaves = leavesRepo.findLeaveByEmp_no(oldEmpNo);
			if (!staffLeaves.isEmpty()) {
				staffLeaves.forEach(leave -> leave.setEmpNo(newEmpNo));
				leavesRepo.saveAll(staffLeaves);
			}

			// Batch update for BhilaiStaffSalaryDetails
			List<BhilaiStaffSalaryDetails> salaryDetails = salaryDetailsRepo.findStaffByEmpNo(oldEmpNo);
			if (!salaryDetails.isEmpty()) {
				salaryDetails.forEach(salaryDetail -> salaryDetail.setEmpNo(newEmpNo));
				salaryDetailsRepo.saveAll(salaryDetails);
			}

			// Batch update for BhilaiStaffTargetDetails
			List<BhilaiStaffTargetDetails> targetDetails = targetDetailsRepo.findByEmpNo(oldEmpNo);
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
//		BhilaiStaff bhilaiStaff = createOrUpdateStaff(new BhilaiStaff(), newStaff, "NEW");
//
//		if (newStaff.getUser() != null) {
//			try {
//				String userResult = userService.addNewUser(newStaff.getUser());
//				return userResult.equals(Result.SUCCESS.toString()) ? saveStaff(bhilaiStaff)
//						: Result.ALLREADY_EXISTS.toString();
//			} catch (Exception e) {
//				e.printStackTrace();
//			}
//		}
//		return saveStaff(bhilaiStaff);
//	}
//
//	private String handleEditStaff(Long staffId, NewStaffDTO newStaff) {
//		Optional<BhilaiStaff> optionalStaff = staffRepo.findById(staffId);
//		if (!optionalStaff.isPresent()) {
//			return Result.NOT_FOUND.toString();
//		}
//
//		BhilaiStaff existingBhilaiStaff = optionalStaff.get();
//		existingBhilaiStaff = createOrUpdateStaff(existingBhilaiStaff, newStaff, "EDIT");
//
//		return saveStaff(existingBhilaiStaff);
//	}

	private BhilaiStaff createOrUpdateStaff(BhilaiStaff bhilaiStaff, NewStaffDTO newStaff, String action) {
		bhilaiStaff.setDesigId(newStaff.getDesigId());
		bhilaiStaff.setName(newStaff.getName());
		bhilaiStaff.setFname(newStaff.getFname());
		bhilaiStaff.setDob(newStaff.getDob());
		bhilaiStaff.setAge(newStaff.getAge() == null ? 0 : Integer.parseInt(newStaff.getAge()));
		bhilaiStaff.setGender(newStaff.getGender());
		bhilaiStaff.setMaritalStatus(newStaff.getMaritalStatus());
		bhilaiStaff.setContactNo(newStaff.getContactNo());
		bhilaiStaff.setPaddress(newStaff.getPaddress());
		bhilaiStaff.setCaddress(newStaff.getCaddress());
		bhilaiStaff.setEmail(newStaff.getEmail());
		bhilaiStaff.setNationality(newStaff.getNationality());
		bhilaiStaff.setAadharNo(newStaff.getAadharNo());
		bhilaiStaff.setPanCard(newStaff.getPanCard());
		bhilaiStaff.setExEmp(newStaff.getExEmp());
		bhilaiStaff.setIdCopy(newStaff.getIdCopy());
		bhilaiStaff.setDlNo(newStaff.getDlNo());
		bhilaiStaff.setDlExpDate(newStaff.getDlExpDate());
		bhilaiStaff.setDeclaration(newStaff.getDeclaration());
		long timeInMillis = System.currentTimeMillis();
		Date now = new Date(timeInMillis);
		bhilaiStaff.setFilledDate(now);
		bhilaiStaff.setPlace(newStaff.getPlace());
		bhilaiStaff.setFilledBy(Long.parseLong(newStaff.getFilledBy()));
		bhilaiStaff.setBloodGroup(newStaff.getBloodGroup());
		bhilaiStaff.setAccountNumber(newStaff.getAccountNumber());
		bhilaiStaff.setBankName(newStaff.getBankName());
		bhilaiStaff.setBranch(newStaff.getBranch());
		bhilaiStaff.setIfscCode(newStaff.getIfscCode());
		if (action.equals("EDIT")) {
			bhilaiStaff.setAreaId(newStaff.getAreaId());

		}
		if (!action.equals("EDIT")) {
			bhilaiStaff.setIsOfferGenrated(Status.FALSE);
			bhilaiStaff.setIsIdGenrated(Status.FALSE);
			bhilaiStaff.setVerified(Status.UNVERIFIED);
			bhilaiStaff.setIdStatus(Status.INACTIVE);
			bhilaiStaff.setEmpNo(idGenerator.getEmpId());
			bhilaiStaff.setAreaId(newStaff.getAreaId());
			bhilaiStaff.setIsAssetAlloted(Status.FALSE);
			bhilaiStaff.setIsCharaterVerified(Status.FALSE);
			BhilaiStaff sc = staffRepo.getLatest();
			bhilaiStaff.setSampleId((sc == null || sc.getSampleId() == null) ? 10001 : sc.getSampleId() + 1);
		}
		bhilaiStaff.setEmergencyRelation(newStaff.getEmergencyRelation());
		bhilaiStaff.setEmergencyMobile(newStaff.getEmergencyMobile());
		bhilaiStaff.setStreet1(newStaff.getStreet1());
		bhilaiStaff.setStreet2(newStaff.getStreet2());
		bhilaiStaff.setCity(newStaff.getCity());
		bhilaiStaff.setState(newStaff.getState());
		bhilaiStaff.setPincode(newStaff.getPincode());
		bhilaiStaff.setJobSpecification(newStaff.getJobSpecification());
		bhilaiStaff.setJobCat(newStaff.getJobCat());
		bhilaiStaff.setContractStartDate(newStaff.getContractStartDate());
		bhilaiStaff.setContractEndDate(newStaff.getContractEndDate());
		bhilaiStaff.setDepartmentId(newStaff.getDepartmentId());
		bhilaiStaff.setTempEmp(newStaff.getTempEmp());
		bhilaiStaff.setDateOfJoining(newStaff.getDateOfJoining());
		
		bhilaiStaff.setActive(Status.ACTIVE);
		bhilaiStaff.setStamp(new Timestamp(timeInMillis));

		return bhilaiStaff;
	}

	private String saveStaff(BhilaiStaff bhilaiStaff) {
		BhilaiStaff savedBhilaiStaff = bhilaiStaff != null ? staffRepo.save(bhilaiStaff) : null;
		List<String> messages = new ArrayList<>();
		if (savedBhilaiStaff != null) {
			String message = "staffId=" + savedBhilaiStaff.getStaffId().toString();
			messages.add(message);
			return message;
		}
		return Result.WENT_WRONG.toString();
	}

	public ResponseStaffDTO mapForGet(ResponseStaffDTO rsd, BhilaiStaff s) {
		rsd.setDesigId(s.getDesigId());
		rsd.setStaffId(s.getStaffId().toString());
		rsd.setName(s.getName());
		rsd.setFname(s.getFname());
		rsd.setDob(s.getDob());
		rsd.setAge(s.getAge());
		rsd.setGender(s.getGender());
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
		rsd.setNationality(s.getNationality());
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
		List<BhilaiStaffQualification> quali = qualiRepo.findByStaffId(s.getStaffId());
		List<QualificationDTO> qq = new ArrayList<>();
		for (BhilaiStaffQualification d : quali) {
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

		List<BhilaiStaffExprience> exps = expRepo.findByStaff(s.getStaffId());
		List<StaffExprienceDTOS> exs = new ArrayList<>();
		for (BhilaiStaffExprience se : exps) {
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
		Optional<BhilaiStaffArea> optionalArea = Optional.ofNullable(s.getAreaId()).flatMap(areaRepo::findById);

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
