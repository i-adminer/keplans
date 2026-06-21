import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: File, folder: string = "plans") {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise<{ publicId: string; url: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
        } else {
          resolve({
            publicId: result.public_id,
            url: result.secure_url,
          });
        }
      }
    ).end(buffer);
  });
}

export async function uploadDocument(file: File, folder: string = "plan-documents") {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise<{ publicId: string; url: string; fileSize: number }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw",
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
        } else {
          resolve({
            publicId: result.public_id,
            url: result.secure_url,
            fileSize: result.bytes,
          });
        }
      }
    ).end(buffer);
  });
}

export async function deleteAsset(publicId: string, resourceType: "image" | "raw" = "image") {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error("Error deleting asset:", error);
  }
}
