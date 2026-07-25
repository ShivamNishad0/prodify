package com.hrms.modules.dmc.payroll.serviceImpl;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DMCTargetCriteria {

    public BigDecimal dmcTCAndServiorGrossCriteria(BigDecimal target, BigDecimal structureGross){
        BigDecimal gross = new BigDecimal(0.00);
        if(target.compareTo(new BigDecimal(70))<=0){
            gross= new BigDecimal(6000);
        }
        if (target.compareTo(new BigDecimal(70))>=0 && target.compareTo(new BigDecimal(80))<=0){
            gross=new BigDecimal(8000);
        }
        if (target.compareTo(new BigDecimal(80))>=0 && target.compareTo(new BigDecimal(90))<=0){
            gross=  new BigDecimal(10000);
        }
        if (target.compareTo(new BigDecimal(90))>=0 && target.compareTo(new BigDecimal(100))<=0){
            gross=  new BigDecimal(12000);
        }
        if (target.compareTo(new BigDecimal(100))>=0 ){
            gross=  new BigDecimal(5000).add(structureGross);
        }
        return  gross;
    }

    public BigDecimal dmcATLGrossCriteria(BigDecimal target,BigDecimal structureGross){
        BigDecimal gross = new BigDecimal(0.00);
        if(target.compareTo(new BigDecimal(70))<=0){
            gross= new BigDecimal(9000);
        }
        if (target.compareTo(new BigDecimal(70))>=0 && target.compareTo(new BigDecimal(80))<=0){
            gross=  new BigDecimal(12000);
        }
        if (target.compareTo(new BigDecimal(80))>=0 && target.compareTo(new BigDecimal(90))<=0){
            gross=  new BigDecimal(15000);
        }
        if (target.compareTo(new BigDecimal(90))>=0 && target.compareTo(new BigDecimal(100))<=0){
            gross=  new BigDecimal(18000);
        }
        if (target.compareTo(new BigDecimal(100))>=0 ){
            gross=  new BigDecimal(5000).add(structureGross);
        }
        return  gross;
    }


    public BigDecimal dmcTLGrossCriteria(BigDecimal target,BigDecimal structureGross){
        BigDecimal gross = new BigDecimal(0.00);
        if(target.compareTo(new BigDecimal(70))<=0){
            gross= new BigDecimal(12000);
        }
        if (target.compareTo(new BigDecimal(70))>=0 && target.compareTo(new BigDecimal(80))<=0){
            gross=  new BigDecimal(16000);
        }
        if (target.compareTo(new BigDecimal(80))>=0 && target.compareTo(new BigDecimal(90))<=0){
            gross=  new BigDecimal(20000);
        }
        if (target.compareTo(new BigDecimal(90))>=0 && target.compareTo(new BigDecimal(100))<=0){
            gross=  new BigDecimal(24000);
        }
        if (target.compareTo(new BigDecimal(100))>=0 ){
            gross=  new BigDecimal(5000).add(structureGross);
        }
        return  gross;
    }

}
