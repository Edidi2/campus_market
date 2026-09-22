import React, { useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Upload, Loader2 } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function ImageUpload({ value, onChange, label }) {
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    try {
      // 1. Create a unique file path for the product image
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. Upload directly to Supabase Storage 'products' bucket
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 3. Get the public URL of the uploaded image
      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);

      // 4. Pass the public URL back to the parent component
      onChange(data.publicUrl);
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Failed to upload image: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {label && <label className="text-sm font-medium">{label}</label>}
      <label className="mt-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-muted/50 h-36 relative overflow-hidden">
        {value ? (
          <div className="relative w-full h-full">
            <Image src={value} alt="preview" className="h-full w-full object-cover rounded-lg" fittingType="fill" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              Click to change image
            </div>
          </div>
        ) : loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : (
          <>
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-1">Click to upload</span>
          </>
        )}
        <input type="file" accept="image/*" className="hidden" onChange={handle} disabled={loading} />
      </label>
    </div>
  );
}