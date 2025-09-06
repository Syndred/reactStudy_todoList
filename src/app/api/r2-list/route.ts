import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
  },
});

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME,
    });

    const { Contents } = await s3Client.send(command);

    const files = Contents?.map((file) => ({
      Key: file.Key,
      Size: file.Size,
      LastModified: file.LastModified,
    })) || [];

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error listing files from R2:", error);
    return NextResponse.json({ message: "Error listing files from R2" }, { status: 500 });
  }
}
