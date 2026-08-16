import AppError from '../../src/utils/AppError.js';

describe('AppError', () => {
  test('creates a fail error for status 404', () => {
    const error = new AppError('Not found', 404);
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
    expect(error).toBeInstanceOf(Error);
  });

  test('creates an error status for status 500', () => {
    const error = new AppError('Server error', 500);
    expect(error.status).toBe('error');
  });
});
