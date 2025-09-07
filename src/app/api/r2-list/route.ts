import { S3Client, ListObjectsV2Command, HeadObjectCommand } from "@aws-sdk/client-s3";
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

    const files = await Promise.all((Contents ?? []).map(async (file) => {
      try {
        const headCommand = new HeadObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME,
          Key: file.Key!,
        });
        const headResult = await s3Client.send(headCommand);
        return {
          Key: file.Key,
          Size: file.Size,
          LastModified: file.LastModified,
          ContentType: headResult.ContentType || 'application/octet-stream',
        };
      } catch (error) {
        console.error(`Error fetching metadata for ${file.Key}:`, error);
        return {
          Key: file.Key,
          Size: file.Size,
          LastModified: file.LastModified,
          ContentType: 'application/octet-stream',
        };
      }
    }));

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error listing files from R2:", error);
    return NextResponse.json({ message: "Error listing files from R2" }, { status: 500 });
  }
}
