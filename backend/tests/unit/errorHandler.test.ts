import { handleError } from '../../src/utils/errorHandler.js';

describe('Error Handler Utilities - Unit Tests', () => {
  describe('handleError', () => {
    it('should return error message for Error instances', () => {
      const error = new Error('Test error message');
      const result = handleError(error);
      expect(result).toBe('Test error message');
    });

    it('should return error message for TypeError', () => {
      const error = new TypeError('Type error occurred');
      const result = handleError(error);
      expect(result).toBe('Type error occurred');
    });

    it('should return error message for RangeError', () => {
      const error = new RangeError('Range error occurred');
      const result = handleError(error);
      expect(result).toBe('Range error occurred');
    });

    it('should return default message for non-Error objects', () => {
      const result = handleError('string error');
      expect(result).toBe('An unknown error occurred');
    });

    it('should return default message for null', () => {
      const result = handleError(null);
      expect(result).toBe('An unknown error occurred');
    });

    it('should return default message for undefined', () => {
      const result = handleError(undefined);
      expect(result).toBe('An unknown error occurred');
    });

    it('should return default message for number', () => {
      const result = handleError(123);
      expect(result).toBe('An unknown error occurred');
    });

    it('should return default message for boolean', () => {
      const result = handleError(true);
      expect(result).toBe('An unknown error occurred');
    });

    it('should return default message for plain object', () => {
      const result = handleError({ message: 'error' });
      expect(result).toBe('An unknown error occurred');
    });

    it('should return default message for array', () => {
      const result = handleError(['error']);
      expect(result).toBe('An unknown error occurred');
    });

    it('should handle custom Error subclasses', () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'CustomError';
        }
      }
      const error = new CustomError('Custom error message');
      const result = handleError(error);
      expect(result).toBe('Custom error message');
    });

    it('should handle Error with empty message', () => {
      const error = new Error('');
      const result = handleError(error);
      expect(result).toBe('');
    });
  });
});
