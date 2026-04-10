const DEFAULT_SITE_URL = "https://www.islaglass.com";

function normalizeSiteUrl(siteUrl: string) {
  const withProtocol =
    siteUrl.startsWith("http://") || siteUrl.startsWith("https://")
      ? siteUrl
      : `https://${siteUrl}`;

  return withProtocol.replace(/\/+$/, "");
}

export function getSiteUrl() {
  const configuredSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    DEFAULT_SITE_URL;

  return normalizeSiteUrl(configuredSiteUrl);
}
