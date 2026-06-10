export type CmsRole = 'Admin' | 'Editor' | 'Author' | 'SEO Manager' | 'Analyst' | 'Advertiser';
export type CmsAction =
  | 'create_article'
  | 'edit_article'
  | 'publish_article'
  | 'schedule_article'
  | 'archive_article'
  | 'delete_article'
  | 'edit_seo'
  | 'manage_categories'
  | 'manage_tags'
  | 'manage_media'
  | 'view_analytics'
  | 'manage_ads'
  | 'manage_users'
  | 'manage_roles';

const ROLE_MATRIX: Record<CmsRole, CmsAction[]> = {
  Admin: [
    'create_article',
    'edit_article',
    'publish_article',
    'schedule_article',
    'archive_article',
    'delete_article',
    'edit_seo',
    'manage_categories',
    'manage_tags',
    'manage_media',
    'view_analytics',
    'manage_ads',
    'manage_users',
    'manage_roles',
  ],
  Editor: [
    'create_article',
    'edit_article',
    'publish_article',
    'schedule_article',
    'archive_article',
    'delete_article',
    'edit_seo',
    'manage_categories',
    'manage_tags',
    'manage_media',
    'view_analytics',
  ],
  Author: ['create_article', 'edit_article', 'schedule_article'],
  'SEO Manager': ['edit_seo', 'manage_categories', 'manage_tags'],
  Analyst: ['view_analytics'],
  Advertiser: ['manage_ads'],
};

export function can(role: CmsRole | string | undefined, action: CmsAction) {
  if (!role) return false;
  const normalized = role as CmsRole;
  return ROLE_MATRIX[normalized]?.includes(action) ?? false;
}

export function assertCan(role: CmsRole | string | undefined, action: CmsAction) {
  if (!can(role, action)) {
    throw new Error(`Forbidden: ${String(role)} cannot ${action}`);
  }
}

export const CMS_ROLE_MATRIX = ROLE_MATRIX;
