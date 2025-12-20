export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'GRIDPLANT';
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'AI PLANT CARE & SHOP';
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;  

export const signInDefaultValues = {
  email: 'mohamed@gmail.com',
  password: '123456',
};  

export const signUpDefaultValues = {
    name: 'Moustafa Ismail',
  email: 'Moustafa@example.com',
  password: 'password',
  confirmPassword: 'password',
};

export const shippingAddressDefaultValues = {
  fullName: 'Moustafa Ismail',
  streetAddress: 'Hadayek Helwan',
  city: 'Cairo',
  postalCode: '11431',
  country: 'Egypt',
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(', ')
  : ['PayPal', 'Stripe', 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || 'PayPal';

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;
