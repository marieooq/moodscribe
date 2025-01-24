"use client";

import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadDialog } from "@/components/upload-dialog";

const UploadJournal = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  return (
    <>
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUpload={() => {
          console.log("uploading...");
        }}
      />
      <div className="flex justify-center max-w-md mx-auto w-full">
        <Button
          onClick={() => setUploadDialogOpen(true)}
          className="w-full md:w-64"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Journal
        </Button>
      </div>
    </>
  );
};

export default UploadJournal;
