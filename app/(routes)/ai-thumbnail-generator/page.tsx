"use client";

import { ArrowUp, ImagePlus, Loader2, User, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import ThumbnailList from './_components/ThumbnailList';
import { toast } from 'sonner';
import axios from 'axios';

function AiThumbnailGenerator() {
  const [userInput, setUserInput] = useState<string>();
  const [referenceImage, setReferenceImage] = useState<File>();
  const [faceImage, setFaceImage] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [outputThumbnailImage, setOutputThumbnailImage] = useState('');

  // ✅ File Preview
  const onHandleFileChange = (field: string, e: any) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (field === "referenceImage") setReferenceImage(selectedFile);
    if (field === "faceImage") setFaceImage(selectedFile);
  };

  // ✅ Submit & Generate Thumbnail
  const onSubmit = async () => {
    if (!userInput?.trim()) {
      toast.error("Enter your title or description!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("userInput", userInput);

    try {
      const res = await axios.post("/api/generate-thumbnail", formData);
      setOutputThumbnailImage(res.data.image);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to generate thumbnail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-10 md:px-20 lg:px-40">
      <div className="flex items-center justify-center mt-5 flex-col gap-2">
        <h2 className="font-bold text-4xl">AI Thumbnail Generator</h2>
        <p className="text-gray-400 text-center">Create eye-catching AI thumbnails instantly!</p>
      </div>

      {/* ✅ Output */}
      <div className="mt-6">
        {loading ? (
          <div className="w-full bg-secondary rounded-2xl p-10 h-[250px] flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" />
            <h2>Please wait... generating</h2>
          </div>
        ) : (
          outputThumbnailImage && (
            <Image
              src={outputThumbnailImage}
              alt="Thumbnail"
              width={500}
              height={400}
              className="aspect-video w-full rounded-xl"
            />
          )
        )}
      </div>

      {/* ✅ Input */}
      <div className="flex gap-5 items-center p-3 border rounded-xl mt-10 bg-secondary">
        <textarea
          placeholder="Enter your YouTube title or video description"
          className="w-full outline-0 bg-transparent resize-none"
          rows={2}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <div
          className="p-3 bg-gradient-to-t from-red-500 to-orange-500 rounded-full cursor-pointer"
          onClick={onSubmit}
        >
          <ArrowUp />
        </div>
      </div>

      {/* ✅ Upload buttons (hidden for now but included) */}
      <div className="mt-3 flex gap-3">
        <label htmlFor="referenceImageUpload" className="w-full cursor-pointer">
          <div className="p-4 w-full border rounded-xl bg-secondary flex gap-2 items-center justify-center hover:scale-105 transition-all">
            <ImagePlus />
            <p>Reference Image</p>
          </div>
        </label>
        <input
          type="file"
          id="referenceImageUpload"
          className="hidden"
          onChange={(e) => onHandleFileChange("referenceImage", e)}
        />

        <label htmlFor="faceImageUpload" className="w-full cursor-pointer">
          <div className="p-4 w-full border rounded-xl bg-secondary flex gap-2 items-center justify-center hover:scale-105 transition-all">
            <User />
            <p>Face Image</p>
          </div>
        </label>
        <input
          type="file"
          id="faceImageUpload"
          className="hidden"
          onChange={(e) => onHandleFileChange("faceImage", e)}
        />
      </div>

      <ThumbnailList />
    </div>
  );
}

export default AiThumbnailGenerator;
