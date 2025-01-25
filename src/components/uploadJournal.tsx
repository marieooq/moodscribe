"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const UploadJournal = () => {
  const router = useRouter();

  return (
    <div className="flex justify-center max-w-md mx-auto w-full">
      <Button
        onClick={() => router.push('/upload')}
        className="w-full md:w-64"
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload Journal
      </Button>
    </div>
  );
};

export default UploadJournal;
