import React, { useRef, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Upload, Loader2, ImageIcon, X } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function ImageUpload({ value, onChange, label }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handle = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // Limit image size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setLoading(true);

    try {
      // Create a unique file path for the product image
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const filePath = fileName;

      // Upload directly to Supabase Storage 'products' bucket
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL of the uploaded image
      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);

      // Pass the public URL back to the parent component
      onChange(data.publicUrl);
    } catch (err) {
      console.error("Error uploading image:", err);

      setError(
        `Failed to upload image: ${
          err?.message || "Unknown error"
        }`
      );
    } finally {
      setLoading(false);

      // Allow selecting the same file again
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();

    onChange("");
    setError("");
  };

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <label
        className={`group relative flex h-40 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200 ${
          error
            ? "border-destructive/50 bg-destructive/5"
            : value
            ? "border-border bg-background"
            : "border-muted-foreground/25 bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
        }`}
      >
        {value ? (
          <div className="relative h-full w-full">
            <Image
              src={value}
              alt="Uploaded product preview"
              className="h-full w-full rounded-xl object-cover"
              fittingType="fill"
            />

            {/* Image overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <div className="flex flex-col items-center gap-2 text-white">
                <Upload className="h-6 w-6" />
                <span className="text-xs font-medium">
                  Click to change image
                </span>
              </div>
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              Uploading image...
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
              <ImageIcon className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="text-sm font-medium text-foreground">
                Click to upload an image
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPG or WEBP · Max 5MB
              </p>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="hidden"
          onChange={handle}
          disabled={loading}
        />
      </label>

      {error && (
        <p className="mt-2 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
