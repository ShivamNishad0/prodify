import fs from "fs";
import * as archiver from "archiver";
import { NextResponse } from "next/server";

// Ensure the runtime supports Node.js APIs
export const runtime = "nodejs";

export async function GET(req) {
  try {
    const folderToZip = "/home/ubuntu/frontend_ws/generated-folders"; // For ubuntu
    // const folderToZip = "C:\\Users\\avina\\Downloads\\generated-folders"; //For windows

    // Check if the folder exists
    if (!fs.existsSync(folderToZip)) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Set up headers for streaming the zip file
    const headers = new Headers({
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=generated-folders.zip",
    });

    // Create a readable stream to write the zip archive
    const zipStream = new ReadableStream({
      start(controller) {
        const archive = archiver("zip", { zlib: { level: 9 } });

        // Handle data as it is generated
        archive.on("data", (chunk) => controller.enqueue(chunk));

        // Handle completion
        archive.on("end", async () => {
          controller.close();

          // Delete the folder after the zip process is complete
          try {
            await fs.promises.rm(folderToZip, { recursive: true, force: true });
            console.log(`Folder ${folderToZip} deleted successfully.`);
          } catch (err) {
            console.error(`Error deleting folder: ${err.message}`);
          }
        });

        // Handle errors
        archive.on("error", (err) => controller.error(err));

        // Add the folder to the archive
        archive.directory(folderToZip, false);

        // Finalize the archive to signal that we're done writing
        archive.finalize();
      },
    });

    // Return the stream as the response
    return new Response(zipStream, { headers });
  } catch (error) {
    console.error("Error creating zip file:", error);
    return NextResponse.json(
      { error: "Failed to create or serve zip file" },
      { status: 500 }
    );
  }
}
