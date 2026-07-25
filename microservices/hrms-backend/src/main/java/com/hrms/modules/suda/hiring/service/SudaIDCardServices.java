package com.hrms.modules.suda.hiring.service;

import com.hrms.modules.suda.hiring.models.SudaIDCard;

import java.util.List;

public interface SudaIDCardServices {
	 public String approveAndGenerateId(Long staffId, Long userId);
	 
	 public String generateIdOnly(Long staffId, Long userId);
	 
	 public List<SudaIDCard> allActiveCards();
	 
	 public SudaIDCard findByEmpNo(String empNo);
	 
	 public List<SudaIDCard> getAllUnActiveIDCard();
	 
	 public String increaseCount(List <Long>cardId);
	 
	 public String updateIdDetails(Long staffId, Long cardId);
	 
	 public List<SudaIDCard> idByStaffsIds(List<Long>ids);
}
