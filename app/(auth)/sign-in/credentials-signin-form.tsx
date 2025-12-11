'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInDefaultValues } from '@/lib/constants';
import Link from 'next/link';

const CredentialsSignInForm = () => {
  const searchParams = useSearchParams();
const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [data, action] = useActionState(signInWithCredentials, {
    message: '',
    success: false,
  });

  const SignInButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button
        disabled={pending}
        className='w-full'
        variant='default'
      >
        {pending ? 'Signing In...' : 'Continue with Email'}
      </Button>
    );
  };
  return (
    <form action={action} className='space-y-4'>
      <input type='hidden' name='callbackUrl' value={callbackUrl} />
      <div className='grid gap-4'>
        <div className='grid gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            required
            type='email'
            defaultValue={signInDefaultValues.email}
            autoComplete='email'
          />
        </div>
        <div className='grid gap-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='password'>Password</Label>
          </div>
          <Input
            id='password'
            name='password'
            required
            type='password'
            defaultValue={signInDefaultValues.password}
            autoComplete='current-password'
          />
        </div>
        <SignInButton />
        {data && !data.success && data.message && (
          <div className='rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive text-center'>
            {data.message}
          </div>
        )}
        <div className='text-sm text-center text-muted-foreground'>
          Don&apos;t have an account?{' '}
          <Link target='_self' className='link' href='/sign-up'>
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
