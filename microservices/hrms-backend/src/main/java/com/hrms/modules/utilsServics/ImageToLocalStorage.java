package com.hrms.modules.utilsServics;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageToLocalStorage {
	@Value("${user.image.upload.path}")
	private String userimage;
	@Value("${staff.image.upload.path}")
	private String staffimage;
	@Value("${staff_doc.image.upload.path}")
	private String staffDoc;
	@Value("${other_doc.image.upload.path}")
	private String otherDoc;


	public String saveImage(MultipartFile file, String name, String location) {
        if (file.isEmpty()) {
            return "Please select a file to upload";
        }

        try {
            String fileName = name + "_" + LocalDate.now() + "_" + file.getOriginalFilename();
            String fileUploadPath = getFileUploadPath(location);

            if (fileUploadPath == null) {
                return "Invalid file upload location";
            }

            createDirectoryIfNotExists(fileUploadPath);

            String filePath = Paths.get(fileUploadPath, fileName).toString();
            try (FileOutputStream fos = new FileOutputStream(filePath)) {
                fos.write(file.getBytes());
            }

            return fileName;
        } catch (IOException e) {
            e.printStackTrace();
            return "Failed to upload file: " + e.getMessage();
        }
    }

    private String getFileUploadPath(String location) {
        switch (location) {
            case "STAFF_IMG":
                return staffimage;
            case "USER_IMG":
                return userimage;
            case "STAFF_DOC":
                return staffDoc;
            case "OTHER_DOC":
                return otherDoc;
            default:
                return null;
        }
    }

    private void createDirectoryIfNotExists(String path) {
        File directory = new File(path);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

	public String deleteFile(String fileName, String location) {
		// Specify the directory where you want to delete the file
		  String fileUploadPath = getFileUploadPath(location);
		String uploadDir = fileUploadPath;

		// Create the file path for the file to be deleted
		String filePath = uploadDir + File.separator + fileName;
		Path path = Paths.get(filePath);

		try {
			// Delete the file
			Files.delete(path);
			return "File deleted successfully";
		} catch (IOException e) {
			// Handle file deletion exceptions
			return "Failed to delete file: " + e.getMessage();
		}
	}
}
