"use client";
import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { ProductDTO, ProductImage } from "@/lib/types";
import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import NextImage from "next/image";
import { FiUpload, FiX } from "react-icons/fi";

interface FileUploaderProps {
  product: ProductDTO;
  imagesRef?: React.RefObject<ProductImage[]>;
  updateProductImages: (product: ProductImage[]) => void;
  updateProductImageOrder: (key: string, orderPosition: number) => void;
  onFilesSelected?: (files: File[]) => void;
  selectedFiles?: File[];
}

const MAX_FILES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Compress image on client before upload
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const image = new Image();
      image.src = event.target?.result as string;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = image;
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(image, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const webpFilename = file.name.replace(/\.[^.]+$/, ".webp");
              resolve(new File([blob], webpFilename, { type: "image/webp" }));
            } else {
              resolve(file);
            }
          },
          "image/webp",
          0.75,
        );
      };
    };
  });
};

export const FileUploader = ({
  product,
  updateProductImages,
  updateProductImageOrder,
  imagesRef,
  onFilesSelected,
  selectedFiles,
}: FileUploaderProps) => {
  const dragKey = useRef<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileCompress = async (files: FileList | null) => {
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

    setCompressing(true);

    try {
      // Compress files only, don't upload yet
      const compressedFiles = await Promise.all(
        validFiles.map((file) => compressImage(file))
      );

      // Store compressed files in parent state via callback
      if (onFilesSelected) {
        const existingFiles = selectedFiles || [];
        onFilesSelected([...existingFiles, ...compressedFiles]);
      }

      // Create preview URLs for display only (not saved to DB)
      const newPreviewUrls = compressedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);


    } catch (error) {
      console.error("Compression error:", error);
      alert("Failed to compress files. Please try again.");
    } finally {
      setCompressing(false);
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
    handleFileCompress(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileCompress(e.target.files);
    e.target.value = "";
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
            {compressing
              ? "Compressing images..."
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
            disabled={compressing}
          />
        </div>
      </div>

      {/* Image Preview List */}
      <div className="flex flex-col gap-2 w-1/2">
        <div className="flex flex-wrap border border-gray-300 bg-white h-64 p-2 overflow-scroll w-full">
          {(previewUrls.length > 0 || product?.images) &&
            [...(previewUrls.map(url => ({ url, orderPosition: 0 })) || []), ...(product?.images || [])]
              ?.sort(
                (a, b) => (a?.orderPosition ?? 0) - (b?.orderPosition ?? 0),
              )
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
                      <NextImage
                        src={file?.url}
                        alt={`${product?.name} product image`}
                        fill
                        className="h-full cursor-move object-cover"
                      />

                      <div
                        className="ml-2 text-gray-300 hover:text-gray-400 rounded-full! border! absolute! -top-2! -right-2! bg-white p-1 cursor-pointer"
                        onClick={() => {
                          updateProductImages(
                            Array.isArray(product?.images)
                              ? product?.images?.filter(
                                  (img) => img?.url !== file?.url,
                                ) || []
                              : ([] as ProductImage[]),
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
