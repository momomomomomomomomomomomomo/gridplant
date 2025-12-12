import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert complex objects to plain objects
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}


// Format Errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any): string {
  // Zod errors
  if (error?.name === 'ZodError') {
    const issues =
      (Array.isArray(error.errors) && error.errors) ||
      (Array.isArray(error.issues) && error.issues) ||
      [];

    if (issues.length === 0) {
      return typeof error.message === 'string'
        ? error.message
        : 'Validation failed';
    }

    const messages = issues.map((issue: { message?: unknown }) => {
      const msg = issue?.message;
      return typeof msg === 'string' ? msg : JSON.stringify(msg);
    });

    return messages.join('. ');
  }

  // Prisma unique constraint
  if (
    error?.name === 'PrismaClientKnownRequestError' &&
    error?.code === 'P2002'
  ) {
    const target = error.meta?.target;
    const message: string | undefined = error?.message;

    const field = Array.isArray(target)
      ? target[0]
      : typeof target === 'string'
        ? target
        : undefined;

    const lower = field?.toLowerCase() ?? '';

    const isEmail = lower.includes('email') || (message?.toLowerCase() ?? '').includes('email');

    const label = isEmail
      ? 'Email'
      : field
        ? field.charAt(0).toUpperCase() + field.slice(1)
        : 'Field';

    return `${label} already exists`;
  }

  // Fallback
  return typeof error?.message === 'string'
    ? error.message
    : JSON.stringify(error?.message ?? error);
}


// Round to 2 decimal places
export const round2 = (value: number | string) => {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100; // avoid rounding errors
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('value is not a number nor a string');
  }
};

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,
});

// Format currency
export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return 'NaN';
  }
}


