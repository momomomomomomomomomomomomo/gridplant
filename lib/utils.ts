import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from 'query-string';

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

// Shorten ID
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

// Format Date and Time in various styles
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};


export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = qs.parse(params);

  query[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query,
    },
    { skipNull: true }
  );
}

//  Format Numbers
const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}