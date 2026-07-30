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
    return publicUrl && publicUrl.startsWith("http") ? `${publicUrl}/${key}` : "";
  },
};

export async function formatClipWithSignedUrls<
  T extends { id: string; projectId: string; thumbnailUrl: string | null; storageUrl: string | null }
>(clip: T): Promise<T> {
  let thumbnailUrl = clip.thumbnailUrl;
  let storageUrl = clip.storageUrl;

  const thumbKey = `projects/${clip.projectId}/clips/${clip.id}/thumb.jpg`;
  const clipKey = `projects/${clip.projectId}/clips/${clip.id}/clip.mp4`;

  if (!thumbnailUrl || thumbnailUrl.includes(".r2.dev") || !thumbnailUrl.startsWith("http")) {
    try {
      thumbnailUrl = await R2Storage.getSignedUrl(thumbKey, 86400);
    } catch {
      // Keep existing URL if signing fails
    }
  }

  if (!storageUrl || storageUrl.includes(".r2.dev") || !storageUrl.startsWith("http")) {
    try {
      storageUrl = await R2Storage.getSignedUrl(clipKey, 86400);
    } catch {
      // Keep existing URL if signing fails
    }
  }

  return {
    ...clip,
    thumbnailUrl,
    storageUrl,
  };
}
