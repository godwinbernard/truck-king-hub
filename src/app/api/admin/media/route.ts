import { db } from '@/lib/db/client';
import { cmsMedia } from '@/lib/db/schema';
import { getSession } from '@/lib/admin/session';
import { can } from '@/lib/admin/permissions';
import { writeAuditLog } from '@/lib/admin/audit';
import { desc } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { put } from '@vercel/blob';

function safeFilename(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/(^-|-$)/g, '');
}

export async function GET() {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db.select().from(cmsMedia).orderBy(desc(cmsMedia.createdAt)).limit(50);
  return Response.json({ media: rows });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.adminId) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!can(session.role, 'manage_media')) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get('file');
  const altText = String(formData.get('altText') ?? '').trim();

  if (!(file instanceof File)) {
    return Response.json({ error: 'file is required' }, { status: 400 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json({ error: 'BLOB_READ_WRITE_TOKEN is not configured' }, { status: 500 });
  }

  const blobName = `cms-media/${crypto.randomUUID()}-${safeFilename(file.name || 'upload')}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { url } = await put(blobName, buffer, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
    contentType: file.type || 'application/octet-stream',
  });
  const mediaType = file.type.startsWith('image/') ? 'image' : 'file';
  const [row] = await db.insert(cmsMedia).values({
    filename: file.name,
    url,
    altText: altText || null,
    mediaType,
    fileSizeKb: Math.max(1, Math.round(file.size / 1024)),
    uploadedBy: session.email ?? 'admin',
    status: 'ready',
  }).returning();

  await writeAuditLog(session.email ?? 'admin', 'uploaded_media', 'media', file.name, {
    id: row.id,
    mediaType,
    fileSizeKb: row.fileSizeKb,
  });

  return Response.json({ media: row }, { status: 201 });
}
