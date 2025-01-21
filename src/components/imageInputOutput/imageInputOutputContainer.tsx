"use client";

import React, { useContext } from "react";
import { ImageAnalysisContext } from "@/app/imageAnalysisProvider";
import ImageUpload from "@/components/imageInputOutput/imageUpload";
import ImageAnalysisDisplay from "@/components/imageInputOutput/imageAnalysisDisplay";

const ImageInputOutputContainer = () => {
  const { imageAnalysisResult } = useContext(ImageAnalysisContext);

  return (
    <div className="aligflex items-center w-full max-w-screen-md mx-auto">
      <ImageUpload />
      {imageAnalysisResult && (
        <ImageAnalysisDisplay text={imageAnalysisResult.text} />
      )}
    </div>
  );
};

export default ImageInputOutputContainer;
