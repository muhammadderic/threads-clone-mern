import { toaster } from "@/components/ui/toaster";
import { useState } from "react";

const usePreviewImg = () => {
  const MAX_FILE_SIZE_MB = 5;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImgUrl(null);
      return;
    }

    // Type validation
    if (!file.type.startsWith("image/")) {
      toaster.create({
        title: "Invalid file type",
        description: "Please select an image file",
        type: "error",
        duration: 3000,
      });
      return;
    }

    // Size validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toaster.create({
        title: "File too large",
        description: `Maximum size is ${MAX_FILE_SIZE_MB}MB`,
        type: "error",
        duration: 3000,
      });
      return;
    }

    // Create preview if valid
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImgUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return { handleImageChange, imgUrl, setImgUrl };
};

export default usePreviewImg;
