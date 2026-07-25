import React, {
  useContext,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { FaCamera } from "react-icons/fa";
import { ImBin2 } from "react-icons/im";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import WebcamCapture from "./WebcamCapture"; // Ensure correct import path
import ThemeContext from "@/context/ThemeContext";

const FileUpload = forwardRef(
  (
    {
      fileKey,
      fileType,
      handleDocCapture,
      handleDocDelete,
      resourceUrl,
      title,
      disabled,
      buttonText,
      file,
      setFile,
      modalOnClose,
    },
    ref
  ) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState("");
    const { themeColor } = useContext(ThemeContext);
    const [selectedDeviceId, setSelectedDeviceId] = useState("");
    const [imgAfterCrop, setImgAfterCrop] = useState("");

    const capturePhoto = () => {
      if (webcamRef.current) {
        webcamRef.current.capture();
      }
    };

    const savePhoto = () => {
      if (imgAfterCrop) {
        handleDocCapture(fileKey, imgAfterCrop, modalOnClose);
        setImgSrc("");
        setImgAfterCrop("");
        onClose();
        return;
      }
      if (file) {
        if (Array.isArray(file)) handleDocCapture(fileKey, file[0]);
        else handleDocCapture(fileKey, file);
        onClose();
      }
    };

    const handleViewDocument = () => {
      if (typeof file === "string") {
        window.open(resourceUrl + file, "_blank");
      } else if (file instanceof File) {
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
      }
    };

    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      setImgSrc(file);
      setFile(file);
    };

    // Expose savePhoto function to parent component
    useImperativeHandle(ref, () => ({
      savePhoto,
    }));

    function handleCropDone() {
      if (webcamRef.current) {
        webcamRef.current.onCropDone(); // Call the method exposed by WebcamCapture
      }
    }

    return (
      <>
        <div className="w-full text-sm flex h-full items-end">
          {!file ? (
            <div className="flex flex-col w-full gap-y-1.5 h-full">
              {title && (
                <span className="block text-small w-full text-foreground">
                  {title}
                </span>
              )}
              <label
                className={`relative w-full inline-flex justify-between flex-row items-center shadow-sm px-3 gap-3 h-full rounded-medium transition-background border-2 content-center custom-file-upload cursor-pointer p-auto text-white ${
                  disabled ? "bg-gray-400 cursor-not-allowed" : themeColor
                }`}
              >
                <input
                  type="file"
                  name={fileKey}
                  accept={fileType || "All Files"}
                  onChange={handleFileUpload}
                  disabled={disabled}
                  className="hidden"
                />
                {buttonText || "Upload"}
                {handleDocCapture && (
                  <button
                    type="button"
                    onClick={onOpen}
                    disabled={disabled}
                    className="ml-2"
                  >
                    <FaCamera color={disabled ? "gray" : "white"} />
                  </button>
                )}
              </label>
            </div>
          ) : (
            <div className="flex flex-col w-full gap-y-1.5 h-full">
              {title && (
                <span className="block text-small w-full text-foreground">
                  {title}
                </span>
              )}
              <div className="relative px-3 gap-3 inline-flex flex-row items-center cursor-text shadow-sm border-medium border-default-200 hover:border-default-400 focus-within:border-default-foreground h-full rounded-medium w-full transition-background justify-between">
                <button
                  className="text-blue-500 w-[max-content]"
                  onClick={handleViewDocument}
                  disabled={disabled}
                >
                  View Document
                </button>
                <div
                  className={`ml-2 my-auto cursor-pointer ${
                    disabled
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-red-500"
                  }`}
                  onClick={() => !disabled && handleDocDelete(fileKey)}
                >
                  <ImBin2 />
                </div>
              </div>
            </div>
          )}
        </div>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader className="flex flex-col items-center gap-1">
              Take Photo
            </ModalHeader>
            <ModalBody>
              <WebcamCapture
                ref={webcamRef}
                imgSrc={imgSrc}
                setImgSrc={setImgSrc}
                setFile={setFile}
                file={file}
                selectedDeviceId={selectedDeviceId}
                setSelectedDeviceId={setSelectedDeviceId}
                imgAfterCrop={imgAfterCrop}
                setImgAfterCrop={setImgAfterCrop}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                className="h-7 text-[#FFC107] border-[#FFC107] rounded-full"
                onPress={() => setSelectedDeviceId("")}
                variant="bordered"
              >
                Upload
              </Button>
              <Button
                className="h-7 rounded-full"
                onPress={() => {
                  setImgAfterCrop("");
                  setImgSrc("");
                }}
                color="danger"
                isDisabled={!imgSrc}
              >
                Reset
              </Button>
              {imgSrc ? (
                <Button
                  className="h-7 rounded-full"
                  onClick={() => {
                    handleCropDone();
                  }}
                >
                  Crop
                </Button>
              ) : (
                <Button
                  className="h-7 rounded-full"
                  color="primary"
                  onPress={capturePhoto}
                >
                  Capture
                </Button>
              )}
              <Button
                className="h-7 rounded-full"
                color="success"
                onClick={savePhoto}
                isDisabled={!imgAfterCrop}
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
);

FileUpload.displayName = "FileUpload";

export default FileUpload;
