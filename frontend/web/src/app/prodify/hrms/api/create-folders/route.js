import JSZip from "jszip";
import path from "path";
import os from "os"; // Import the os module
import { saveAs } from "file-saver";

// // Function to create nested folders
const createNestedFolders = (nestedAreas, selection) => {
  const { area, circle, division } = selection;

  // Initialize a new ZIP instance
  const zip = new JSZip();

  // Create the folder structure
  const areaFolder = zip.folder(area);
  const circleFolder = areaFolder.folder(circle);
  const divisionFolder = circleFolder.folder(division);

  // Add a sample file to the folder (optional)
  divisionFolder.file("example.txt", "This is an example file");

  // Generate the ZIP file
  zip.generateAsync({ type: "blob" }).then((content) => {
    // Download the ZIP file
    saveAs(content, `${area}-${circle}-${division}.zip`);
  });
};

export async function POST(req) {
  try {
    const { selection, nestedAreas } = await req.json();
    const { area, circle, division } = selection;

    // Check if area and circle exist in nestedAreas
    if (nestedAreas[area] && nestedAreas[area][circle]) {
      // Ensure the circle is an object and contains the divisions as keys
      const divisions = nestedAreas[area][circle];

      // Check if the division exists in the list of divisions
      const selectedStructure = {
        [circle]: divisions[division]
          ? { [division]: divisions[division] }
          : {},
      };

      // Get the user's Downloads folder path
      const downloadsPath = path.join(os.homedir(), "Downloads");
      const basePath = path.join(downloadsPath, "generated-folders", area);

      // Create folders using the filtered structure
      createNestedFolders(basePath, selectedStructure);

      return new Response(
        JSON.stringify({ message: "Folders created successfully!" }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ message: "Invalid selection." }), {
        status: 400,
      });
    }
  } catch (error) {
    console.error("Error creating folders:", error);
    return new Response(
      JSON.stringify({ message: "An error occurred while creating folders." }),
      { status: 500 }
    );
  }
}
