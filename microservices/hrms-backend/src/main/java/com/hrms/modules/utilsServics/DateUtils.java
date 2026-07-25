package com.hrms.modules.utilsServics;


import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import org.springframework.stereotype.Service;

@Service
public class DateUtils {

	public Date convertStringToSqlDate(String dateString) {
        try {
            // Define the date format that matches your input string
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd"); // Example format
            
            // Parse the string date into java.util.Date
            java.util.Date parsedDate = dateFormat.parse(dateString);
            
            // Convert java.util.Date to java.sql.Date
            return new Date(parsedDate.getTime());
        } catch (ParseException e) {
            // Handle parse exception (e.g., log, throw custom exception, etc.)
            e.printStackTrace(); // Example: Print stack trace for debugging
            return null; // Or throw a custom exception or return a default value
        }
    }
	
}
