import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

const BUCKET = process.env.R2_BUCKET_NAME ?? "clipper";

export const R2Storage = {
  async upload(key: string, body: Buffer, contentType: string) {
    return r2Client.send(
      new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType })
    );
  },

  async delete(key: string) {
    return r2Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  },

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    return getSignedUrl(r2Client, new GetObjectCommand({ Bucket: BUCKET, Key: key }), { expiresIn });
  },

  getPublicUrl(key: string): string {
    const publicUrl = process.env.R2_PUBLIC_URL;
    return publicUrl ? `${publicUrl}/${key}` : key;
  },
};
