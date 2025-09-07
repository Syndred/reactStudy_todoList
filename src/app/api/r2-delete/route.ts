import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const R2_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME;
const R2_ENDPOINT = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_ENDPOINT;

const s3Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || "",
    secretAccessKey: R2_SECRET_ACCESS_KEY || "",
  },
});

export async function DELETE(request: Request) {
  try {
    const { key } = await request.json();

    if (!key) {
      console.error('Delete API: Missing file key');
      return NextResponse.json({ message: "Missing file key" }, { status: 400 });
    }

    console.log(`Delete API: Attempting to delete key: ${key}`);
    console.log(`Delete API: R2_ENDPOINT: ${R2_ENDPOINT}`);
    console.log(`Delete API: R2_BUCKET_NAME: ${R2_BUCKET_NAME}`);

    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file from R2:", error);
    return NextResponse.json({ message: "Error deleting file from R2" }, { status: 500 });
  }
}
