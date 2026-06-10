import { can } from '../permissions';

describe('cms permissions', () => {
  it('lets Admin do everything', () => {
    expect(can('Admin', 'manage_roles')).toBe(true);
    expect(can('Admin', 'delete_article')).toBe(true);
  });

  it('lets Editor publish but not manage roles', () => {
    expect(can('Editor', 'publish_article')).toBe(true);
    expect(can('Editor', 'manage_roles')).toBe(false);
  });

  it('lets Author draft but not publish', () => {
    expect(can('Author', 'create_article')).toBe(true);
    expect(can('Author', 'publish_article')).toBe(false);
  });

  it('lets SEO Manager edit SEO but not publish', () => {
    expect(can('SEO Manager', 'edit_seo')).toBe(true);
    expect(can('SEO Manager', 'publish_article')).toBe(false);
  });

  it('lets Analyst view analytics only', () => {
    expect(can('Analyst', 'view_analytics')).toBe(true);
    expect(can('Analyst', 'manage_ads')).toBe(false);
  });

  it('lets Advertiser manage ads only', () => {
    expect(can('Advertiser', 'manage_ads')).toBe(true);
    expect(can('Advertiser', 'edit_article')).toBe(false);
  });
});
