import { methodSeverity } from './http-method';

describe('methodSeverity', () => {
  it('should map each method to its color', () => {
    expect(methodSeverity('GET')).toBe('info');
    expect(methodSeverity('POST')).toBe('success');
    expect(methodSeverity('PUT')).toBe('warn');
    expect(methodSeverity('PATCH')).toBe('warn');
    expect(methodSeverity('DELETE')).toBe('danger');
  });

  it('should fall back to secondary for unknown or missing methods', () => {
    expect(methodSeverity('OPTIONS')).toBe('secondary');
    expect(methodSeverity(undefined)).toBe('secondary');
  });
});
