import { Popup } from "@shared/components/layout";
import { Input } from "@shared/components/ui";
import { useEffect, useRef, useState } from "react";
import { useTradeSetupStore } from "@shared/stores";

export function EditSetupPopup({ setupId }) {
  const closePopup = useTradeSetupStore((s) => s.closePopup);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);

    const url = URL.createObjectURL(file);
    setPreview(url);

    // simulate upload
    setUploading(true);
    setProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploading(false);
        }, 300); // slight delay for smooth finish
      }
    }, 300); // ~3 sec total
  };

  // cleanup preview
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <Popup.Container>
      <Popup.Header title={"Edit Setup"} onClose={closePopup} />

      <Popup.Body className="!p-4 space-y-5">
        <Input
          vertical
          label={"Setup Name"}
          classNames={{ input: "!min-w-full w-full" }}
        />

        {/* Upload Section */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Setup Image</label>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            onClick={() => !uploading && fileRef.current.click()}
            className="
                w-full
                h-40
                border-2 border-dashed border-(--border)
                rounded-lg
                flex flex-col items-center justify-center
                cursor-pointer
                relative
                overflow-hidden
              "
          >
            {/* Upload UI */}
            {!preview ? (
              <>
                <div className="text-3xl mb-2">📤</div>
                <p className="text-sm font-medium">Click to upload image</p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG up to 5MB
                </p>
              </>
            ) : (
              <img src={preview} alt="preview" className="!h-full !w-[70%] " />
            )}

            {/* Upload overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-(--surface) flex flex-col items-center justify-center gap-2">
                <p className="text-white text-sm font-medium">
                  Uploading... {progress}%
                </p>

                {/* Progress bar */}
                <div className="w-3/4 h-2 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-(--text-muted) transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Popup.Body>

      <Popup.Footer
        onApply={() => {
          console.log("Image:", image);
        }}
        onCancel={closePopup}
      />
    </Popup.Container>
  );
}
