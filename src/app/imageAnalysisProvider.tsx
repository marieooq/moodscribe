"use client";
import { createContext, useState, ReactNode } from "react";

interface ImageAnalysisData {
  text: string;
  url?: string;
  confidence?: number;
}

interface ImageAnalysisContextType {
  imageAnalysisResult: ImageAnalysisData | null;
  setImageAnalysisResult: (data: ImageAnalysisData | null) => void;
}

export const ImageAnalysisContext = createContext<
  ImageAnalysisContextType | undefined
>(undefined);

const ImageAnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [imageAnalysisResult, setImageAnalysisResult] =
    useState<ImageAnalysisData | null>(null);

  return (
    <ImageAnalysisContext.Provider
      value={{ imageAnalysisResult, setImageAnalysisResult }}
    >
      {children}
    </ImageAnalysisContext.Provider>
  );
};

export default ImageAnalysisProvider;
