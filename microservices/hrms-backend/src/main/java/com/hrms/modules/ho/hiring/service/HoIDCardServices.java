package com.hrms.modules.ho.hiring.service;

import com.hrms.modules.ho.hiring.models.HoIDCard;

import java.util.List;

public interface HoIDCardServices {
	 public String approveAndGenerateId(Long staffId, Long userId);
	 
	 public String generateIdOnly(Long staffId, Long userId);
	 
	 public List<HoIDCard> allActiveCards();
	 
	 public HoIDCard findByEmpNo(String empNo);
	 
	 public List<HoIDCard> getAllUnActiveIDCard();
	 
	 public String increaseCount(List <Long>cardId);
	 
	 public String updateIdDetails(Long staffId, Long cardId);
	 
	 public List<HoIDCard> idByStaffsIds(List<Long>ids);
}
