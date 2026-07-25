// import fs from "fs";
// import path from "path";

// export async function POST(req) {
//   try {
//     const { folderPath, fileName, imageData } = await req.json();

//     // Decode base64 image data
//     const base64Data = imageData.replace(/^data:image\/png;base64,/, "");

//     // Create folders if they don't exist
//     await fs.promises.mkdir(folderPath, { recursive: true });

//     // Write the PNG file to the specified location
//     const filePath = path.join(folderPath, fileName);
//     await fs.promises.writeFile(filePath, base64Data, "base64");

//     return new Response(
//       JSON.stringify({ message: "File saved successfully" }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error saving file:", error);
//     return new Response(
//       JSON.stringify({ message: "Failed to save file", error: error.message }),
//       { status: 500 }
//     );
//   }
// }

import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    // Parse the JSON body
    const { folderPath, fileName, imageData } = await req.json();

    // Validate inputs
    if (!folderPath || !fileName || !imageData) {
      return new Response(JSON.stringify({ message: "Invalid input data" }), {
        status: 400,
      });
    }

    // Decode base64 image data
    const base64Data = imageData.replace(/^data:image\/png;base64,/, "");

    // Create directories if they don't exist
    await fs.promises.mkdir(folderPath, { recursive: true });

    // Construct the file path and write the file
    const filePath = path.join(folderPath, fileName);
    await fs.promises.writeFile(filePath, base64Data, "base64");

    return new Response(
      JSON.stringify({ message: "File saved successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving file:", error);

    return new Response(
      JSON.stringify({
        message: "Failed to save file",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
