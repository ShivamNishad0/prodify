package com.hrms.modules.bijli.hiring.service;

import com.hrms.modules.bijli.hiring.models.BijliIDCard;

import java.util.List;

public interface BijliIDCardServices {
	 public String approveAndGenerateId(Long staffId, Long userId);
	 
	 public String generateIdOnly(Long staffId, Long userId);
	 
	 public List<BijliIDCard> allActiveCards();
	 
	 public BijliIDCard findByEmpNo(String empNo);
	 
	 public List<BijliIDCard> getAllUnActiveIDCard();
	 
	 public String increaseCount(List <Long>cardId);
	 
	 public String updateIdDetails(Long staffId, Long cardId);
	 
	 public List<BijliIDCard> idByStaffsIds(List<Long>ids);
}
