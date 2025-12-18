export function toGoogleDriveDirectImageUrl(url: string) {
  if (!url) return '';

  if (url.includes('googleusercontent.com')) {
    return url;
  }

  const m1 = url.match(/\/file\/d\/([^/]+)/i);
  const m2 = url.match(/[?&]id=([^&]+)/i);

  const id = (m1?.[1] || m2?.[1] || '').trim();
  if (!id) return url;

  return `https://lh3.googleusercontent.com/d/${id}=w1000`;
}