import { Popup, Section } from "@shared/components/layout";
import { ErrorText, ImageUpload, Input } from "@shared/components/ui";
import { useTradeSetupStore } from "@shared/stores";
import { useFormValidator, useImageUpload } from "@shared/hooks";
import { required } from "@shared/utils";

export function SetupFormBuilder({
  title,
  onApply,
  initialValues,
  isSubmitting,
}) {
  const closePopup = useTradeSetupStore((s) => s.closePopup);

  const { values, setField, register, errors, validate } = useFormValidator({
    initialValues: {
      name: initialValues.name,
      imageUrl: initialValues.imageUrl,
      imagePublicId: initialValues.imagePublicId,
    },
    rules: {
      name: [required("Name is required")],
      imageUrl: [required("Image is required")],
    },
  });

  const { state, deleteImage, uploadImage } = useImageUpload();

  return (
    <>
      <Popup.Header title={title} onClose={closePopup} />

      <Popup.Body className="!p-4 space-y-5">
        <Section title="Setup Name">
          <Input
            ref={register("name")}
            placeholder="Enter setup name"
            value={values.name}
            classNames={{ input: "!min-w-full w-full" }}
            onChange={(v) => setField("name", v)}
          />
          {errors.name && <ErrorText text={errors.name} />}
        </Section>

        <Section title="Setup Image">
          <ImageUpload
            value={values?.imageUrl}
            uploadImage={uploadImage}
            onChange={(imageUrl, imagePublicId) => {
              if (imageUrl === null || imagePublicId === null) return;
              console.log(imageUrl, imagePublicId);
              setField("imageUrl", imageUrl);
              setField("imagePublicId", imagePublicId);
            }}
          />
          {errors.imageUrl && <ErrorText text={errors.imageUrl} />}
        </Section>
      </Popup.Body>

      <Popup.Footer
        text={["Cancel", title.includes("Edit") ? "Save" : "Add"]}
        loading={{
          apply: isSubmitting || state.uploading,
          cancel: state.cleanup,
        }}
        disableApply={isSubmitting || state.uploading || state.cleanup}
        disableCancel={isSubmitting || state.uploading || state.cleanup}
        onApply={() => onApply(values, validate)}
        onCancel={async () => {
          await deleteImage(values.imagePublicId);
          closePopup();
        }}
      />
    </>
  );
}
