import React from "react";

interface ImageAnalysisDisplay {
  text: string;
}

const ImageAnalysisDisplay = ({ text }: ImageAnalysisDisplay) => {
  return <pre className="text-wrap">{text}</pre>;
};

export default ImageAnalysisDisplay;
