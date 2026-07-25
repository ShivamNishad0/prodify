package com.hrms.modules.bhilai.hiring.serviceImpl;

import com.hrms.modules.bhilai.hiring.models.BhilaiIDCard;
import com.hrms.modules.bhilai.hiring.models.BhilaiStaff;
import com.hrms.modules.bhilai.hiring.models.BhilaiStaffArea;
import com.hrms.modules.bhilai.hiring.repository.BhilaiIDCardRepo;
import com.hrms.modules.bhilai.hiring.repository.BhilaiStaffAreaRepo;
import com.hrms.modules.bhilai.hiring.repository.BhilaiStaffRepo;
import com.hrms.modules.bhilai.hiring.service.BhilaiIDCardServices;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BhilaiIDCardServicesImpl implements BhilaiIDCardServices {

	@Autowired
	private BhilaiIDCardRepo idRepo;
	@Autowired
	private BhilaiStaffRepo bhilaiStaffRepo;
	@Autowired
	private BhilaiStaffAreaRepo areaRepo;

	@Override
	public String approveAndGenerateId(Long staffId, Long userId) {
		Optional<BhilaiStaff> optionalStaff = bhilaiStaffRepo.findById(staffId);
		if (optionalStaff.isPresent()) {
			BhilaiStaff bhilaiStaff = optionalStaff.get();
			bhilaiStaff.setIsIdGenrated(Status.TRUE);
			bhilaiStaff.setIdStatus(Status.ACTIVE);
			bhilaiStaff.setVerified(Status.VERIFIED);
			bhilaiStaff.setIsOfferGenrated(Status.TRUE);
			bhilaiStaff.setApprovBy(userId);
			BhilaiStaff savedBhilaiStaff = bhilaiStaffRepo.save(bhilaiStaff);

			if (savedBhilaiStaff != null) {
				BhilaiStaff s = optionalStaff.get();
				BhilaiIDCard oldCard = idRepo.findByEmpNo(s.getEmpNo());
				if (oldCard != null) {
					BhilaiIDCard card = new BhilaiIDCard();
					card.setEmpNo(savedBhilaiStaff.getEmpNo());
					card.setName(savedBhilaiStaff.getName());
					card.setPost(savedBhilaiStaff.getDesigId().toString());
					card.setDob(savedBhilaiStaff.getDob().toString());
					card.setFname(savedBhilaiStaff.getFname());
					card.setStaffImg(savedBhilaiStaff.getStaffImg());
					card.setMobNo(savedBhilaiStaff.getContactNo());
					LocalDate currentDate = LocalDate.now();
					card.setGenerationDate(currentDate);
					card.setValidUpto(currentDate.plusDays(90).toString());
					card.setAddress(savedBhilaiStaff.getPaddress());
					card.setStaffId(staffId);
					BhilaiStaffArea area = areaRepo.findByStaff(staffId).get(0);
					card.setAreaId(area.getAreaId());
					card.setStatus(Status.ACTIVE);
					card.setGeneratedBy(userId);
					Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
					card.setStamp(currentTimestamp);

					idRepo.save(card);
					return Result.SUCCESS.toString();
				}
				return Result.ALLREADY_EXISTS.toString();
			}
		}
		return Result.WENT_WRONG.toString();
	}
	
	@Override
	public String generateIdOnly(Long staffId, Long userId) {
	    BhilaiStaff bhilaiStaff = bhilaiStaffRepo.findById(staffId).orElse(null);
	    if (bhilaiStaff == null) {
	        return Result.NOT_FOUND.toString();
	    }

	    if (!isValidStaff(bhilaiStaff) || idRepo.existsByStaffId(staffId)) {
	        return Result.INVALID_ACTION.toString();
	    }

	    return generateAndSaveIdCard(bhilaiStaff, userId);
	}

	private boolean isValidStaff(BhilaiStaff bhilaiStaff) {
	    return Status.ACTIVE.equals(bhilaiStaff.getActive()) &&
	           Status.VERIFIED.equals(bhilaiStaff.getVerified()) &&
	           Status.TRUE.equals(bhilaiStaff.getIsOfferGenrated());
	}

	public String generateAndSaveIdCard(BhilaiStaff bhilaiStaff, Long userId) {
	    // Create a new IDCard
	    BhilaiIDCard card = new BhilaiIDCard();
	    card.setEmpNo(bhilaiStaff.getEmpNo());
	    card.setName(bhilaiStaff.getName());
	    card.setPost(bhilaiStaff.getDesigId().toString());
	    card.setDob(bhilaiStaff.getDob());
	    card.setFname(bhilaiStaff.getFname());
	    card.setStaffImg(bhilaiStaff.getStaffImg());
	    card.setMobNo(bhilaiStaff.getContactNo());
	    LocalDate currentDate = LocalDate.now();
	    card.setGenerationDate(currentDate);
	    card.setValidUpto(currentDate.plusDays(90).toString());
	    card.setAddress(bhilaiStaff.getPaddress());
	    card.setTempEmp(bhilaiStaff.getTempEmp());
	    card.setStaffId(bhilaiStaff.getStaffId());
	    card.setAreaId(areaRepo.findById(bhilaiStaff.getAreaId()).orElseThrow().getAreaId());
	    card.setStatus(Status.ACTIVE);
	    card.setGeneratedBy(userId);
	    card.setStamp(new Timestamp(System.currentTimeMillis()));
	    card.setPrintCount(0L); // Directly set to 0L

	    // Update staff status
	    bhilaiStaff.setIsIdGenrated(Status.TRUE);
	    
	    // Save both the updated staff and the new IDCard
	    bhilaiStaffRepo.save(bhilaiStaff);
	    idRepo.save(card);

	    return Result.SUCCESS.toString();
	}
	
	@Override
	public List<BhilaiIDCard> allActiveCards() {
		return idRepo.findAllActiveCard();
	}

	@Override
	public BhilaiIDCard findByEmpNo(String empNo) {
		BhilaiIDCard foundId = idRepo.findByEmpNo(empNo);
		return foundId;
	}

	@Override
	public List<BhilaiIDCard> getAllUnActiveIDCard() {
		return idRepo.findDeactiveCards();
	}

	@Override
	public String increaseCount(List<Long> cardId) {
		for (Long id : cardId) {
			BhilaiIDCard card = idRepo.findById(id).get();
			card.setPrintCount(card.getPrintCount() + 1);
			idRepo.save(card);
		}

		return Result.SUCCESS.toString();
	}


	@Override
	public String updateIdDetails(Long staffId, Long cardId) {
	    // Fetch the staff and ID card objects
	    Optional<BhilaiStaff> staffOpt = bhilaiStaffRepo.findById(staffId);
	    Optional<BhilaiIDCard> cardOpt = idRepo.findById(cardId);
	    
	    // Check if both objects are present
	    if (staffOpt.isPresent() && cardOpt.isPresent()) {
	        BhilaiStaff bhilaiStaff = staffOpt.get();
	        BhilaiIDCard card = cardOpt.get();
	        
	        // Check if the staff ID is different and if a record with the new staff ID already exists
	        if (!card.getStaffId().equals(staffId)) {
	            Optional<BhilaiIDCard> existingCard = idRepo.findBystaff_id(staffId);
	            if (existingCard.isPresent()) {
	            	// Update the ID card details
	            	BhilaiIDCard foundCard = existingCard.get();
	            	foundCard.setEmpNo(bhilaiStaff.getEmpNo());
	            	foundCard.setName(bhilaiStaff.getName());
	            	foundCard.setPost(bhilaiStaff.getDesigId() != null ? bhilaiStaff.getDesigId().toString() : "");
	            	foundCard.setDob(bhilaiStaff.getDob() != null ? bhilaiStaff.getDob().toString() : "");
	            	foundCard.setStaffImg(bhilaiStaff.getStaffImg());
	            	foundCard.setFname(bhilaiStaff.getFname());
	            	foundCard.setMobNo(bhilaiStaff.getContactNo());
	            	foundCard.setAddress(bhilaiStaff.getPaddress());
	            	foundCard.setStaffId(staffId);
	            	foundCard.setAreaId(bhilaiStaff.getAreaId());
	    	        
	    	        // Save the updated ID card
	    	        idRepo.save(foundCard);
	                return Result.SUCCESS.toString(); 
	            }
	        }
	      
	    }
	    
	    return Result.WENT_WRONG.toString();
	}



	@Override
	public List<BhilaiIDCard> idByStaffsIds(List<Long> ids) {
		if (ids == null || ids.isEmpty()) {
			return new ArrayList<>();
		}

		// Fetch all IDCards for the given list of IDs in one query
		List<BhilaiIDCard> foundBhilaiIDCards = idRepo.findByStaffIds(ids);

		return foundBhilaiIDCards;
	}

}
