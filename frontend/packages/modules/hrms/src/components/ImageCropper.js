"use client";
import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import Cropper from "react-easy-crop";

const ImageCropper = (props) => {
  const { image, onCropCancel, setCroppedArea } = props;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRatio] = useState(7 / 9);

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const onAspectRatioChange = (event) => {
    setAspectRatio(event.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      <div>
        <Cropper
          image={image}
          aspect={aspectRatio}
          crop={crop}
          zoom={zoom}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="flex item-end justify-end gap-4">
        <Button
          className="relative max-w-full min-w-min box-border whitespace-nowrap px-1 text-xl text-foreground-50 pb-1 text-center h-7 rounded-full bg-transparent aspect-square flex justify-end items-center"
          onClick={onCropCancel}
        >
          ×
        </Button>
      </div>
    </div>
  );
};

ImageCropper.displayName = "ImageCropper";

export default ImageCropper;
