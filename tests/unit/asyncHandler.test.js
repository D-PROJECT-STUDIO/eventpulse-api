import { jest } from '@jest/globals';
import asyncHandler from '../../src/utils/asyncHandler.js';

describe('asyncHandler', () => {
  test('runs the wrapped function', async () => {
    const req = {};
    const res = {};
    const next = jest.fn();
    const fn = jest.fn(async () => 'done');
    asyncHandler(fn)(req, res, next);
    await new Promise(resolve => setImmediate(resolve));
    expect(fn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  test('passes rejected errors to next', async () => {
    const next = jest.fn();
    const error = new Error('failed');
    asyncHandler(async () => { throw error; })({}, {}, next);
    await new Promise(resolve => setImmediate(resolve));
    expect(next).toHaveBeenCalledWith(error);
  });
});
