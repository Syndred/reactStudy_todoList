import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;

    if (!file || !fileName) {
      console.error('Upload API: Missing file or fileName');
      return NextResponse.json({ message: "Missing file or fileName" }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    console.log(`Upload API: Attempting to upload key: ${fileName}`);
    console.log(`Upload API: R2_ENDPOINT: ${R2_ENDPOINT}`);
    console.log(`Upload API: R2_BUCKET_NAME: ${R2_BUCKET_NAME}`);

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
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
