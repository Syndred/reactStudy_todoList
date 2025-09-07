import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME;
const R2_ENDPOINT = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_ENDPOINT;

const S3 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || '',
    secretAccessKey: R2_SECRET_ACCESS_KEY || '',
  },
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  if (!key) {
    console.error('Download API: Missing file key');
    return NextResponse.json({ error: 'Missing file key' }, { status: 400 });
  }

  console.log(`Download API: Attempting to download key: ${key}`);
  console.log(`Download API: R2_ENDPOINT: ${R2_ENDPOINT}`);
  console.log(`Download API: R2_BUCKET_NAME: ${R2_BUCKET_NAME}`);

  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    const response = await S3.send(command);

    if (!response.Body) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const stream = response.Body as ReadableStream<Uint8Array>;
    const headers = new Headers();
    // 暂时移除 Content-Type 和 Content-Disposition，测试是否是这些头导致的问题
    // headers.set('Content-Type', response.ContentType || 'application/octet-stream');
    // headers.set('Content-Disposition', `attachment; filename="${key.split('/').pop()}"`);
    headers.set('Cache-Control', 'no-cache'); // Prevent caching of downloads

    return new NextResponse(stream, { headers });

  } catch (error) {
    console.error('Error downloading file from R2:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
