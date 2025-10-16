// UUID validation
export const validateUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Title validation
export const validateTitle = (
  title: unknown
): { isValid: boolean; error?: string; trimmedTitle?: string } => {
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return {
      isValid: false,
      error: 'Title is required and cannot be empty',
    };
  }

  const trimmedTitle = title.trim();
  if (trimmedTitle.length > 255) {
    return {
      isValid: false,
      error: 'Title cannot exceed 255 characters',
    };
  }

  return {
    isValid: true,
    trimmedTitle,
  };
};

// Priority validation
export const validatePriority = (priority: unknown): { isValid: boolean; error?: string } => {
  const validPriorities = ['low', 'medium', 'high'];
  if (priority === null || priority === '' || !validPriorities.includes(priority as string)) {
    return {
      isValid: false,
      error: 'Priority must be one of: low, medium, high',
    };
  }
  return { isValid: true };
};

// Date validation
export const validateDate = (date: unknown): { isValid: boolean; error?: string; date?: Date } => {
  const parsedDate = new Date(date as string);
  if (isNaN(parsedDate.getTime())) {
    return {
      isValid: false,
      error: 'Invalid date format',
    };
  }
  return {
    isValid: true,
    date: parsedDate,
  };
};
