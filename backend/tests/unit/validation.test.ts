import {
  validateUUID,
  validateTitle,
  validatePriority,
  validateDate,
} from '../../src/utils/validation.js';

describe('Validation Utilities - Unit Tests', () => {
  describe('validateUUID', () => {
    describe('Valid UUIDs', () => {
      it('should return true for valid lowercase UUID v4', () => {
        const validUUID = '550e8400-e29b-41d4-a716-446655440000';
        expect(validateUUID(validUUID)).toBe(true);
      });

      it('should return true for valid uppercase UUID', () => {
        const validUUID = '550E8400-E29B-41D4-A716-446655440000';
        expect(validateUUID(validUUID)).toBe(true);
      });

      it('should return true for valid mixed case UUID', () => {
        const validUUID = '550e8400-E29b-41D4-a716-446655440000';
        expect(validateUUID(validUUID)).toBe(true);
      });

      it('should return true for UUID with all zeros', () => {
        const validUUID = '00000000-0000-0000-0000-000000000000';
        expect(validateUUID(validUUID)).toBe(true);
      });

      it('should return true for UUID with all f characters', () => {
        const validUUID = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
        expect(validateUUID(validUUID)).toBe(true);
      });
    });

    describe('Invalid UUIDs', () => {
      it('should return false for empty string', () => {
        expect(validateUUID('')).toBe(false);
      });

      it('should return false for UUID without hyphens', () => {
        const invalidUUID = '550e8400e29b41d4a716446655440000';
        expect(validateUUID(invalidUUID)).toBe(false);
      });

      it('should return false for UUID with wrong hyphen positions', () => {
        const invalidUUID = '550e-8400-e29b-41d4-a716-446655440000';
        expect(validateUUID(invalidUUID)).toBe(false);
      });

      it('should return false for UUID that is too short', () => {
        const invalidUUID = '550e8400-e29b-41d4-a716-44665544000';
        expect(validateUUID(invalidUUID)).toBe(false);
      });

      it('should return false for UUID that is too long', () => {
        const invalidUUID = '550e8400-e29b-41d4-a716-4466554400000';
        expect(validateUUID(invalidUUID)).toBe(false);
      });

      it('should return false for UUID with invalid characters', () => {
        const invalidUUID = '550e8400-e29b-41d4-a716-44665544000g';
        expect(validateUUID(invalidUUID)).toBe(false);
      });

      it('should return false for UUID with special characters', () => {
        const invalidUUID = '550e8400-e29b-41d4-a716-44665544000@';
        expect(validateUUID(invalidUUID)).toBe(false);
      });

      it('should return false for completely invalid string', () => {
        expect(validateUUID('not-a-uuid')).toBe(false);
      });

      it('should return false for number', () => {
        expect(validateUUID('123456')).toBe(false);
      });

      it('should return false for string with spaces', () => {
        const invalidUUID = '550e8400-e29b-41d4-a716-446655440000 ';
        expect(validateUUID(invalidUUID)).toBe(false);
      });
    });
  });

  describe('validateTitle', () => {
    describe('Valid Titles', () => {
      it('should return valid for normal title', () => {
        const result = validateTitle('Buy groceries');
        expect(result.isValid).toBe(true);
        expect(result.trimmedTitle).toBe('Buy groceries');
        expect(result.error).toBeUndefined();
      });

      it('should return valid and trim leading/trailing whitespace', () => {
        const result = validateTitle('  Task with spaces  ');
        expect(result.isValid).toBe(true);
        expect(result.trimmedTitle).toBe('Task with spaces');
      });

      it('should return valid for title with exactly 255 characters', () => {
        const title = 'a'.repeat(255);
        const result = validateTitle(title);
        expect(result.isValid).toBe(true);
        expect(result.trimmedTitle).toBe(title);
      });

      it('should return valid for title with single character', () => {
        const result = validateTitle('a');
        expect(result.isValid).toBe(true);
        expect(result.trimmedTitle).toBe('a');
      });

      it('should return valid for title with special characters', () => {
        const title = 'Task @#$%^&*()_+-=[]{}|;:\'",.<>?/~`';
        const result = validateTitle(title);
        expect(result.isValid).toBe(true);
        expect(result.trimmedTitle).toBe(title);
      });

      it('should return valid for title with unicode characters', () => {
        const title = '你好世界 🌍 café';
        const result = validateTitle(title);
        expect(result.isValid).toBe(true);
        expect(result.trimmedTitle).toBe(title);
      });

      it('should return valid for title with numbers', () => {
        const result = validateTitle('Task 123');
        expect(result.isValid).toBe(true);
        expect(result.trimmedTitle).toBe('Task 123');
      });

      it('should return valid for title with newlines and tabs (after trim)', () => {
        const result = validateTitle('Task\nwith\nnewlines');
        expect(result.isValid).toBe(true);
        expect(result.trimmedTitle).toBe('Task\nwith\nnewlines');
      });
    });

    describe('Invalid Titles - Missing or Empty', () => {
      it('should return invalid for undefined', () => {
        const result = validateTitle(undefined);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Title is required and cannot be empty');
        expect(result.trimmedTitle).toBeUndefined();
      });

      it('should return invalid for null', () => {
        const result = validateTitle(null);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Title is required and cannot be empty');
      });

      it('should return invalid for empty string', () => {
        const result = validateTitle('');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Title is required and cannot be empty');
      });

      it('should return invalid for whitespace only', () => {
        const result = validateTitle('   ');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Title is required and cannot be empty');
      });

      it('should return invalid for tabs only', () => {
        const result = validateTitle('\t\t\t');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Title is required and cannot be empty');
      });

      it('should return invalid for newlines only', () => {
        const result = validateTitle('\n\n\n');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Title is required and cannot be empty');
      });

      it('should return invalid for mixed whitespace', () => {
        const result = validateTitle('  \t\n  ');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Title is required and cannot be empty');
      });
    });

    describe('Invalid Titles - Wrong Type', () => {
      it('should return invalid for number', () => {
        const result = validateTitle(123 as any);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Title is required and cannot be empty');
      });

      it('should return invalid for boolean', () => {
        const result = validateTitle(true as any);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Title is required and cannot be empty');
      });

      it('should return invalid for object', () => {
        const result = validateTitle({} as any);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Title is required and cannot be empty');
      });

      it('should return invalid for array', () => {
        const result = validateTitle([] as any);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Title is required and cannot be empty');
      });
    });

    describe('Invalid Titles - Too Long', () => {
      it('should return invalid for title with 256 characters', () => {
        const title = 'a'.repeat(256);
        const result = validateTitle(title);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Title cannot exceed 255 characters');
        expect(result.trimmedTitle).toBeUndefined();
      });

      it('should return invalid for title with 300 characters', () => {
        const title = 'a'.repeat(300);
        const result = validateTitle(title);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Title cannot exceed 255 characters');
      });

      it('should return invalid for title with 1000 characters', () => {
        const title = 'a'.repeat(1000);
        const result = validateTitle(title);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Title cannot exceed 255 characters');
      });
    });
  });

  describe('validatePriority', () => {
    describe('Valid Priorities', () => {
      it('should return valid for "low" priority', () => {
        const result = validatePriority('low');
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should return valid for "medium" priority', () => {
        const result = validatePriority('medium');
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should return valid for "high" priority', () => {
        const result = validatePriority('high');
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    describe('Invalid Priorities', () => {
      it('should return invalid for null', () => {
        const result = validatePriority(null);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Priority must be one of: low, medium, high');
      });

      it('should return invalid for empty string', () => {
        const result = validatePriority('');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Priority must be one of: low, medium, high');
      });

      it('should return invalid for "urgent"', () => {
        const result = validatePriority('urgent');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Priority must be one of: low, medium, high');
      });

      it('should return invalid for "critical"', () => {
        const result = validatePriority('critical');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Priority must be one of: low, medium, high');
      });

      it('should return invalid for "LOW" (wrong case)', () => {
        const result = validatePriority('LOW');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Priority must be one of: low, medium, high');
      });

      it('should return invalid for "Medium" (wrong case)', () => {
        const result = validatePriority('Medium');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Priority must be one of: low, medium, high');
      });

      it('should return invalid for "HIGH" (wrong case)', () => {
        const result = validatePriority('HIGH');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Priority must be one of: low, medium, high');
      });

      it('should return invalid for number', () => {
        const result = validatePriority(1 as any);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Priority must be one of: low, medium, high');
      });

      it('should return invalid for boolean', () => {
        const result = validatePriority(true as any);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Priority must be one of: low, medium, high');
      });

      it('should return invalid for undefined', () => {
        const result = validatePriority(undefined);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Priority must be one of: low, medium, high');
      });

      it('should return invalid for object', () => {
        const result = validatePriority({} as any);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Priority must be one of: low, medium, high');
      });

      it('should return invalid for whitespace string', () => {
        const result = validatePriority('   ');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Priority must be one of: low, medium, high');
      });
    });
  });

  describe('validateDate', () => {
    describe('Valid Dates', () => {
      it('should return valid for ISO 8601 date string', () => {
        const dateString = '2025-12-31T23:59:59.999Z';
        const result = validateDate(dateString);
        expect(result.isValid).toBe(true);
        expect(result.date).toBeInstanceOf(Date);
        expect(result.date?.toISOString()).toBe(dateString);
        expect(result.error).toBeUndefined();
      });

      it('should return valid for simple date string', () => {
        const dateString = '2025-12-31';
        const result = validateDate(dateString);
        expect(result.isValid).toBe(true);
        expect(result.date).toBeInstanceOf(Date);
      });

      it('should return valid for date in the past', () => {
        const dateString = '2020-01-01T00:00:00.000Z';
        const result = validateDate(dateString);
        expect(result.isValid).toBe(true);
        expect(result.date).toBeInstanceOf(Date);
      });

      it('should return valid for date in the future', () => {
        const dateString = '2030-12-31T23:59:59.999Z';
        const result = validateDate(dateString);
        expect(result.isValid).toBe(true);
        expect(result.date).toBeInstanceOf(Date);
      });

      it('should return valid for Date object', () => {
        const date = new Date('2025-12-31');
        const result = validateDate(date);
        expect(result.isValid).toBe(true);
        expect(result.date).toBeInstanceOf(Date);
      });

      it('should return valid for timestamp number', () => {
        const timestamp = Date.now();
        const result = validateDate(timestamp);
        expect(result.isValid).toBe(true);
        expect(result.date).toBeInstanceOf(Date);
      });

      it('should return valid for various date formats', () => {
        const formats = ['2025/12/31', 'Dec 31, 2025', '31 Dec 2025', '2025-12-31T12:00:00+08:00'];

        formats.forEach((format) => {
          const result = validateDate(format);
          expect(result.isValid).toBe(true);
          expect(result.date).toBeInstanceOf(Date);
        });
      });
    });

    describe('Invalid Dates', () => {
      it('should return invalid for "not-a-date"', () => {
        const result = validateDate('not-a-date');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid date format');
        expect(result.date).toBeUndefined();
      });

      it('should return invalid for empty string', () => {
        const result = validateDate('');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid date format');
      });

      it('should return invalid for invalid date string', () => {
        const result = validateDate('2025-13-45');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid date format');
      });

      it('should return invalid for malformed ISO date', () => {
        const result = validateDate('2025-12-31T25:99:99');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid date format');
      });

      it('should return invalid for "Invalid Date" string', () => {
        const result = validateDate('Invalid Date');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid date format');
      });

      it('should return invalid for NaN', () => {
        const result = validateDate(NaN);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid date format');
      });

      it('should return invalid for invalid Date object', () => {
        const invalidDate = new Date('invalid');
        const result = validateDate(invalidDate);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid date format');
      });

      it('should return invalid for random string', () => {
        const result = validateDate('abc123xyz');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid date format');
      });

      it('should return invalid for whitespace', () => {
        const result = validateDate('   ');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid date format');
      });
    });

    describe('Edge Cases', () => {
      it('should handle leap year dates correctly', () => {
        const result = validateDate('2024-02-29');
        expect(result.isValid).toBe(true);
        expect(result.date).toBeInstanceOf(Date);
      });

      it('should auto-adjust invalid leap year date (JavaScript behavior)', () => {
        // JavaScript Date auto-adjusts 2023-02-29 to 2023-03-01
        const result = validateDate('2023-02-29');
        expect(result.isValid).toBe(true);
        expect(result.date).toBeInstanceOf(Date);
        // The date will be adjusted to March 1, 2023
      });

      it('should handle January 1, 1970', () => {
        const result = validateDate('1970-01-01T00:00:00.000Z');
        expect(result.isValid).toBe(true);
      });

      it('should handle very old dates', () => {
        const result = validateDate('1900-01-01');
        expect(result.isValid).toBe(true);
      });

      it('should handle far future dates', () => {
        const result = validateDate('2100-12-31');
        expect(result.isValid).toBe(true);
      });
    });
  });
});
