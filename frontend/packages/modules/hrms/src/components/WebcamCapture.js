import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import ImageCropper from "./ImageCropper";
import toast from "react-hot-toast";

const WebcamCapture = forwardRef((props, ref) => {
  const captureRef = useRef(null);
  const {
    imgSrc,
    setImgSrc,
    setFile,
    selectedDeviceId,
    setSelectedDeviceId,
    imgAfterCrop,
    setImgAfterCrop,
  } = props;

  const [devices, setDevices] = useState([]);
  const [croppedArea, setCroppedArea] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = captureRef.current.getScreenshot();
    setImgSrc(imageSrc);
    if (imageSrc) {
      // Convert base64 to Blob
      const byteString = atob(imageSrc.split(",")[1]);
      const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      // Create a file from the blob
      const file = new File([blob], "capture.jpg", { type: mimeString });
      setFile([file]); // Set as an array of File objects
    }
  }, [captureRef, setImgSrc, setFile]);

  useImperativeHandle(ref, () => ({
    capture,
    onCropDone,
  }));

  useEffect(() => {
    const getDevices = async () => {
      try {
        // Request permission by accessing the camera
        await navigator.mediaDevices.getUserMedia({ video: true });

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setDevices(videoDevices);

        if (videoDevices.length > 0) {
          const usbCamera = videoDevices.find((device) =>
            device.label.toLowerCase().includes("usb")
          );

          if (usbCamera) {
            setSelectedDeviceId(usbCamera.deviceId);
          } else {
            setSelectedDeviceId(videoDevices[0].deviceId);
          }
        }
      } catch (error) {
        console.error("Error enumerating devices:", error);
      }
    };

    getDevices();
  }, [setSelectedDeviceId]);

  const handleDeviceChange = (deviceId) => {
    setSelectedDeviceId(deviceId);
  };

  const videoConstraints = {
    deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
    width: 264,
    height: 339,
  };

  const onCropDone = () => {
    const canvasEle = document.createElement("canvas");
    if (croppedArea) {
      canvasEle.width = croppedArea.width;
      canvasEle.height = croppedArea.height;

      const context = canvasEle.getContext("2d");

      let imageObj1 = new window.Image(); // Explicitly use native Image constructor
      imageObj1.src = imgSrc;
      imageObj1.onload = function () {
        context.drawImage(
          imageObj1,
          croppedArea.x,
          croppedArea.y,
          croppedArea.width,
          croppedArea.height,
          0,
          0,
          croppedArea.width,
          croppedArea.height
        );

        // Convert the canvas content to a Blob
        canvasEle.toBlob((blob) => {
          if (blob) {
            // Convert the Blob to a File object, similar to the file from the file input
            const croppedFile = new File([blob], "cropped_image.jpg", {
              type: blob.type,
              lastModified: Date.now(),
            });

            // Set the cropped File object in the state
            setImgAfterCrop(croppedFile);
          }
        }, "image/jpeg");
      };
    } else {
      toast("Please Select Crop region");
    }
  };

  const onCropCancel = () => {
    setImgSrc("");
    setImgAfterCrop(null); // Clear the cropped image
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {devices.length > 0 && (
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" className="h-8 rounded-full">
              {(devices.length > 0 &&
                devices.find((ele) => ele.deviceId === selectedDeviceId)
                  ?.label) ||
                "Upload From Camera"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            {devices.map((device, index) => (
              <DropdownItem
                key={device.deviceId}
                onClick={() => handleDeviceChange(device.deviceId)}
              >
                {device.label || `Device ${index + 1}`}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      )}

      {imgAfterCrop ? (
        <div className="relative w-full max-w-64 aspect-[7/9] mt-2">
          <Image
            src={URL.createObjectURL(imgAfterCrop)}
            alt="Cropped"
            layout="fill"
            objectFit="cover"
          />
        </div>
      ) : imgSrc ? (
        <div className="relative w-full max-w-64 aspect-[7/9] mt-2">
          <ImageCropper
            image={imgSrc}
            onCropCancel={onCropCancel}
            setCroppedArea={setCroppedArea}
          />
        </div>
      ) : selectedDeviceId ? (
        <Webcam
          audio={false}
          ref={captureRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
      ) : null}
    </div>
  );
});

WebcamCapture.displayName = "WebcamCapture";

export default WebcamCapture;
