export function normalizeMovioWebUrl(rawUrl: string | undefined): string | null {
  const value = rawUrl?.trim();

  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }

    return url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

export function getMovioWebUrl(): string | null {
  return normalizeMovioWebUrl(process.env.EXPO_PUBLIC_MOVIO_WEB_URL);
}
