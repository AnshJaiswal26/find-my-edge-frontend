import { useState } from "react";
import { apiFetch } from "@lib/api/client";
import { toast } from "@shared/services/toast.service";

export function useImageUpload() {
  const [loading, setLoading] = useState({
    uploading: false,
    cleanup: false,
  });

  const uploadImage = async (file) => {
    if (!file) return null;

    setLoading({ uploading: true, cleanup: false });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await apiFetch("api/images/upload", {
        method: "POST",
        body: formData,
      });

      const imageUrl = res.url || res.imageUrl;
      const publicId = res.publicId;

      return { imageUrl, publicId };
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
      return null;
    } finally {
      setLoading({ uploading: false, cleanup: false });
    }
  };

  const deleteImage = async (publicId) => {
    if (!publicId) return;

    try {
      setLoading({ uploading: false, cleanup: true });

      await apiFetch(`api/images?publicId=${encodeURIComponent(publicId)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Image cleanup failed", err);
    } finally {
      setLoading({ uploading: false, cleanup: false });
    }
  };

  return {
    uploadImage,
    deleteImage,
    state: loading,
  };
}
