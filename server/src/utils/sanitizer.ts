/**
 * Recursively strips keys starting with $ or containing . from object keys
 * preventing MongoDB operator injection without mutating prototype
 */
export function sanitizeMongoInput(data: any): any {
  if (!data || typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map(sanitizeMongoInput);
  }

  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    clean[key] = sanitizeMongoInput(value);
  }
  return clean;
}

/**
 * Strips dangerous HTML script tags
 */
export function sanitizeString(val: string): string {
  if (typeof val !== 'string') return val;
  return val.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
}
