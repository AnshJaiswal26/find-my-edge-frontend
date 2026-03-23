import { useRef, useState } from "react";
import { toast } from "../../services/toast.service";

export default function ImageUpload({
  value, // existing image url
  onChange, // (url) => void
  className = "",
  uploadImage,
}) {
  const fileRef = useRef(null);

  const [preview, setPreview] = useState(value || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSelect = () => {
    if (!uploading) fileRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // local preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    setUploading(true);
    setProgress(10);

    try {
      let fakeProgress = 20;
      const interval = setInterval(() => {
        fakeProgress = Math.min(fakeProgress + 10, 90);
        setProgress(fakeProgress);
      }, 400);

      const res = await uploadImage(file);

      clearInterval(interval);

      setProgress(100);

      const imageUrl = res.url || res.imageUrl;
      const publicId = res.publicId;

      onChange?.(imageUrl, publicId);

      setTimeout(() => {
        setUploading(false);
      }, 300);
    } catch (err) {
      console.error(err);
      setUploading(false);
      setProgress(0);
      setPreview(null);
      onChange?.(null, null);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onClick={handleSelect}
        className="
          w-full h-40
          border-2 border-dashed border-(--border)
          rounded-lg
          flex flex-col items-center justify-center
          cursor-pointer
          relative overflow-hidden
        "
      >
        {!preview ? (
          <>
            <div className="text-3xl mb-2">📤</div>
            <p className="text-sm font-medium">Click to upload image</p>
            <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
          </>
        ) : (
          <img
            src={preview}
            alt="preview"
            className="!h-full !w-[70%] object-cover"
          />
        )}

        {/* Upload Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-(--surface-muted) flex flex-col pointer-events-none items-center justify-center gap-2">
            <p className="text-sm font-medium">Uploading... {progress}%</p>

            <div className="w-2/4 h-2 bg-(--hover) rounded-full overflow-hidden">
              <div
                className="h-full bg-(--info) transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
