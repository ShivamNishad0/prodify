package com.hrms.modules.bhilai.hiring.service;

import com.hrms.modules.bhilai.hiring.models.BhilaiIDCard;

import java.util.List;

public interface BhilaiIDCardServices {
	 public String approveAndGenerateId(Long staffId, Long userId);
	 
	 public String generateIdOnly(Long staffId, Long userId);
	 
	 public List<BhilaiIDCard> allActiveCards();
	 
	 public BhilaiIDCard findByEmpNo(String empNo);
	 
	 public List<BhilaiIDCard> getAllUnActiveIDCard();
	 
	 public String increaseCount(List <Long>cardId);
	 
	 public String updateIdDetails(Long staffId, Long cardId);
	 
	 public List<BhilaiIDCard> idByStaffsIds(List<Long>ids);
}
