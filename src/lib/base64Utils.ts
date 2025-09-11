/**
 * Converts base64url encoded string to standard base64 format
 * @param b64url - base64url encoded string
 * @returns standard base64 encoded string
 */
export function base64UrlToBase64(b64url: string | null | undefined): string | null | undefined {
  if (!b64url) return b64url;
  
  let s = b64url.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) {
    s += '=';
  }
  return s;
}

/**
 * Safely decodes base64url or base64 data
 * @param data - base64url or base64 encoded string
 * @returns decoded string
 */
export function safeDecodeBase64(data: string | null | undefined): string | null {
  if (!data) return null;
  
  try {
    const base64Data = base64UrlToBase64(data);
    if (!base64Data) return null;
    
    return atob(base64Data);
  } catch (error) {
    console.error('Failed to decode base64 data:', error);
    return null;
  }
}