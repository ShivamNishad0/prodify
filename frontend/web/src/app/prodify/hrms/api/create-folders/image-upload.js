import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { folderPath, fileName, imageData } = req.body;

      // Decode base64 image data
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");

      // Create folders if they don't exist
      await fs.promises.mkdir(folderPath, { recursive: true });

      // Write the file
      const filePath = path.join(folderPath, fileName);
      await fs.promises.writeFile(filePath, base64Data, "base64");

      return res.status(200).json({ message: "File saved successfully" });
    } catch (err) {
      console.error("Error saving file:", err);
      return res.status(500).json({ message: "Failed to save file" });
    }
  } else {
    return res
      .setHeader("Allow", ["POST"])
      .status(405)
      .end(`Method ${req.method} Not Allowed`);
  }
}
