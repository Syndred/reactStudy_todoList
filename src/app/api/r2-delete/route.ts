import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
  },
});

export async function DELETE(request: Request) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json({ message: "Missing 'key' in request body" }, { status: 400 });
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);

    return NextResponse.json({ message: `Deleted file: ${key}` });
  } catch (error) {
    console.error("Error deleting file from R2:", error);
    return NextResponse.json({ message: "Error deleting file from R2" }, { status: 500 });
  }
}
