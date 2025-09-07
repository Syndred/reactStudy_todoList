import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;

    if (!file || !fileName) {
      return NextResponse.json({ message: "Missing file or fileName" }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type, // Set ContentType
      Metadata: {
        'Content-Type': file.type, // Store ContentType in metadata
      },
    });

    await s3Client.send(command);

    const publicUrl = `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL}/${fileName}`;
    
    return NextResponse.json({ 
      success: true, 
      publicUrl,
      fileName,
      size: file.size,
      type: file.type
    });
  } catch (error) {
    console.error("Error uploading file to R2:", error);
    return NextResponse.json({ message: "Error uploading file to R2" }, { status: 500 });
  }
}
