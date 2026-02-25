import { NextResponse } from 'next/server';
import S3Service from '@/lib/aws-s3'

export async function GET(req) {

  const url = new URL(req.url);
  const filekey = url.searchParams.get('filekey');

  const fileUrl = await S3Service.getUrlFileByKey(filekey);
  return NextResponse.json({ fileUrl }, { status: 200 });
}