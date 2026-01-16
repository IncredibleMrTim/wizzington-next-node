"use client";
import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Product, ProductImage } from "@/lib/types";
import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { FiUpload, FiX } from "react-icons/fi";

interface FileUploaderProps {
  product: Product;
  imagesRef?: React.RefObject<ProductImage[]>;
  updateProductImages: (product: ProductImage[]) => void;
  updateProductImageOrder: (key: string, order: number) => void;
}

const MAX_FILES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const FileUploader = ({
  product,
  updateProductImages,
  updateProductImageOrder,
  imagesRef,
}: FileUploaderProps) => {
  const dragKey = useRef<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const currentImages = imagesRef?.current || product?.images || [];
    const remainingSlots = MAX_FILES - currentImages.length;

    if (remainingSlots <= 0) {
      alert(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    // Validate file types and sizes
    const validFiles = filesToUpload.filter((file) => {
      const isImage = file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/);
      const isValidSize = file.size <= MAX_FILE_SIZE;

      if (!isImage) {
        alert(`${file.name} is not a valid image file`);
        return false;
      }
      if (!isValidSize) {
        alert(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);

    try {
      // Upload files to Vercel Blob
      const uploadPromises = validFiles.map(async (file, index) => {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload/blob",
        });

        return {
          url: blob.url,
          order: currentImages.length + index,
        };
      });

      // const newImages = await Promise.all(uploadPromises);
      updateProductImages([...currentImages, ...newImages]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  return (
    <div className="flex justify-between gap-4 w-full">
      {/* Upload Zone */}
      <div className="flex flex-col gap-2 w-1/2">
        <div
          className={`flex flex-col gap-4 justify-center items-center border-2 border-dashed rounded-md h-64 bg-white cursor-pointer transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <FiUpload className="text-4xl text-gray-400" />
          <p className="text-sm text-gray-500 text-center px-4">
            {uploading
              ? "Uploading..."
              : "Drag and drop files here, or click to select files"}
          </p>
          <p className="text-xs text-gray-400">
            Max {MAX_FILES} files, 5MB each (JPEG, PNG, GIF, WEBP)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={uploading}
          />
        </div>
      </div>

      {/* Image Preview List */}
      <div className="flex flex-col gap-2 w-1/2">
        <div className="flex flex-wrap border border-gray-300 bg-white h-64 p-2 overflow-scroll w-full">
          {product?.images &&
            [...product.images]
              ?.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
              ?.map((file, index) => {
                return (
                  <div
                    key={file?.url}
                    className="flex flex-col bg-white w-1/5 items-center p-2"
                  >
                    <div
                      className="flex border border-gray-200 h-32 p-2 relative justify-center items-center"
                      draggable
                      onDragStart={() => {
                        dragKey.current = file?.url;
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                      }}
                      onDrop={() => {
                        if (!file?.url) return;
                        updateProductImageOrder(dragKey.current!, index);
                      }}
                    >
                      <img
                        src={file?.url}
                        alt={`${product?.name} product image`}
                        aria-label={`${product?.name} product image`}
                        className="h-full cursor-move"
                      />

                      <div
                        className="ml-2 text-gray-300 hover:text-gray-400 rounded-full! border! absolute! -top-2! -right-2! bg-white p-1 cursor-pointer"
                        onClick={() => {
                          updateProductImages(
                            Array.isArray(product?.images)
                              ? product?.images?.filter(
                                  (img) => img?.url !== file?.url
                                ) || []
                              : ([] as ProductImage[])
                          );
                        }}
                      >
                        <FiX />
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};
