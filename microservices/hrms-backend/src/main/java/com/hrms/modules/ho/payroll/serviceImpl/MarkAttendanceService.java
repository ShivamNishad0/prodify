package com.hrms.modules.ho.payroll.serviceImpl;

import com.hrms.modules.dtos.AttendanceDTO;
import com.hrms.modules.ho.payroll.modles.HoStaffAttendance;
import com.hrms.modules.utilsServics.Attendance;
import org.springframework.stereotype.Service;

@Service
public class MarkAttendanceService {

    private void setDayAttendance(HoStaffAttendance newAttendance, AttendanceDTO attendanceDTO) {
        String day = attendanceDTO.getDay();
        Attendance status = Attendance.valueOf(attendanceDTO.getStatus());

        switch (day) {
            case "d1":
                newAttendance.setD1(status);
                newAttendance.setD1In(attendanceDTO.getInTime());
                newAttendance.setD1Out(attendanceDTO.getOutTime());
                break;
            case "d2":
                newAttendance.setD2(status);
                newAttendance.setD2In(attendanceDTO.getInTime());
                newAttendance.setD2Out(attendanceDTO.getOutTime());
                break;
            case "d3":
                newAttendance.setD3(status);
                newAttendance.setD3In(attendanceDTO.getInTime());
                newAttendance.setD3Out(attendanceDTO.getOutTime());
                break;
            case "d4":
                newAttendance.setD4(status);
                newAttendance.setD4In(attendanceDTO.getInTime());
                newAttendance.setD4Out(attendanceDTO.getOutTime());
                break;
            case "d5":
                newAttendance.setD5(status);
                newAttendance.setD5In(attendanceDTO.getInTime());
                newAttendance.setD5Out(attendanceDTO.getOutTime());
                break;
            case "d6":
                newAttendance.setD6(status);
                newAttendance.setD6In(attendanceDTO.getInTime());
                newAttendance.setD6Out(attendanceDTO.getOutTime());
                break;
            case "d7":
                newAttendance.setD7(status);
                newAttendance.setD7In(attendanceDTO.getInTime());
                newAttendance.setD7Out(attendanceDTO.getOutTime());
                break;
            case "d8":
                newAttendance.setD8(status);
                newAttendance.setD8In(attendanceDTO.getInTime());
                newAttendance.setD8Out(attendanceDTO.getOutTime());
                break;
            case "d9":
                newAttendance.setD9(status);
                newAttendance.setD9In(attendanceDTO.getInTime());
                newAttendance.setD9Out(attendanceDTO.getOutTime());
                break;
            case "d10":
                newAttendance.setD10(status);
                newAttendance.setD10In(attendanceDTO.getInTime());
                newAttendance.setD10Out(attendanceDTO.getOutTime());
                break;
            case "d11":
                newAttendance.setD11(status);
                newAttendance.setD11In(attendanceDTO.getInTime());
                newAttendance.setD11Out(attendanceDTO.getOutTime());
                break;
            case "d12":
                newAttendance.setD12(status);
                newAttendance.setD12In(attendanceDTO.getInTime());
                newAttendance.setD12Out(attendanceDTO.getOutTime());
                break;
            case "d13":
                newAttendance.setD13(status);
                newAttendance.setD13In(attendanceDTO.getInTime());
                newAttendance.setD13Out(attendanceDTO.getOutTime());
                break;
            case "d14":
                newAttendance.setD14(status);
                newAttendance.setD14In(attendanceDTO.getInTime());
                newAttendance.setD14Out(attendanceDTO.getOutTime());
                break;
            case "d15":
                newAttendance.setD15(status);
                newAttendance.setD15In(attendanceDTO.getInTime());
                newAttendance.setD15Out(attendanceDTO.getOutTime());
                break;
            case "d16":
                newAttendance.setD16(status);
                newAttendance.setD16In(attendanceDTO.getInTime());
                newAttendance.setD16Out(attendanceDTO.getOutTime());
                break;
            case "d17":
                newAttendance.setD17(status);
                newAttendance.setD17In(attendanceDTO.getInTime());
                newAttendance.setD17Out(attendanceDTO.getOutTime());
                break;
            case "d18":
                newAttendance.setD18(status);
                newAttendance.setD18In(attendanceDTO.getInTime());
                newAttendance.setD18Out(attendanceDTO.getOutTime());
                break;
            case "d19":
                newAttendance.setD19(status);
                newAttendance.setD19In(attendanceDTO.getInTime());
                newAttendance.setD19Out(attendanceDTO.getOutTime());
                break;
            case "d20":
                newAttendance.setD20(status);
                newAttendance.setD20In(attendanceDTO.getInTime());
                newAttendance.setD20Out(attendanceDTO.getOutTime());
                break;
            case "d21":
                newAttendance.setD21(status);
                newAttendance.setD21In(attendanceDTO.getInTime());
                newAttendance.setD21Out(attendanceDTO.getOutTime());
                break;
            case "d22":
                newAttendance.setD22(status);
                newAttendance.setD22In(attendanceDTO.getInTime());
                newAttendance.setD22Out(attendanceDTO.getOutTime());
                break;
            case "d23":
                newAttendance.setD23(status);
                newAttendance.setD23In(attendanceDTO.getInTime());
                newAttendance.setD23Out(attendanceDTO.getOutTime());
                break;
            case "d24":
                newAttendance.setD24(status);
                newAttendance.setD24In(attendanceDTO.getInTime());
                newAttendance.setD24Out(attendanceDTO.getOutTime());
                break;
            case "d25":
                newAttendance.setD25(status);
                newAttendance.setD25In(attendanceDTO.getInTime());
                newAttendance.setD25Out(attendanceDTO.getOutTime());
                break;
            case "d26":
                newAttendance.setD26(status);
                newAttendance.setD26In(attendanceDTO.getInTime());
                newAttendance.setD26Out(attendanceDTO.getOutTime());
                break;
            case "d27":
                newAttendance.setD27(status);
                newAttendance.setD27In(attendanceDTO.getInTime());
                newAttendance.setD27Out(attendanceDTO.getOutTime());
                break;
            case "d28":
                newAttendance.setD28(status);
                newAttendance.setD28In(attendanceDTO.getInTime());
                newAttendance.setD28Out(attendanceDTO.getOutTime());
                break;
            case "d29":
                newAttendance.setD29(status);
                newAttendance.setD29In(attendanceDTO.getInTime());
                newAttendance.setD29Out(attendanceDTO.getOutTime());
                break;
            case "d30":
                newAttendance.setD30(status);
                newAttendance.setD30In(attendanceDTO.getInTime());
                newAttendance.setD30Out(attendanceDTO.getOutTime());
                break;
            case "d31":
                newAttendance.setD31(status);
                newAttendance.setD31In(attendanceDTO.getInTime());
                newAttendance.setD31Out(attendanceDTO.getOutTime());
                break;
        }
    }


}
