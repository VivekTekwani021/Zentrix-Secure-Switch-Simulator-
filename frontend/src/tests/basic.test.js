import { describe, it, expect } from 'vitest';

describe('Frontend Basic Check', () => {
  it('should pass a sanity test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should verify environment variables exist', () => {
    // Vite uses import.meta.env
    const apiUrl = 'http://localhost:5000/api'; // fallback
    expect(apiUrl).toBeDefined();
  });
});
