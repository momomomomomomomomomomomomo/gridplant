import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { prisma } from '@/db/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { authConfig } from './auth.config';
import { cookies } from 'next/headers';

export const config = {
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null

        // Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        })
        // Check if user exists and password is correct
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          )
          // If password is correct, return user object
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
        }
        // If user doesn't exist or password is incorrect, return null
        return null
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const email = user?.email ?? profile?.email;
        if (!email) return false;

        const existingUser = await prisma.user.findUnique({ where: { email } });

        const sessionState = account.session_state
          ? String(account.session_state)
          : null;

        if (existingUser) {
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            create: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at ?? null,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: sessionState,
            },
            update: {
              userId: existingUser.id,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at ?? null,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: sessionState,
            },
          });
        }
      }

      return true;
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token, trigger }: any) {
      // Map the token data to the session object
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.role = token.role;

      // Optionally handle session updates (like name change)
      if (trigger === 'update' && token.name) {
        session.user.name = token.name;
      }

      // Return the updated session object
      return session;
    },


    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        if (trigger === 'signIn' || trigger === 'signUp') {
        const cookiesObject = await cookies();
        const sessionCartId = cookiesObject.get('sessionCartId')?.value;

        if (sessionCartId) {
          const sessionCart = await prisma.cart.findFirst({
            where: { sessionCartId },
          });

          if (sessionCart) {
            // Overwrite any existing user cart
            await prisma.cart.deleteMany({
              where: { userId: user.id },
            });

            // Assign the guest cart to the logged-in user
            await prisma.cart.update({
              where: { id: sessionCart.id },
              data: { userId: user.id },
            });
          }
        }
      }

        // If user has no name, use email as their default name
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];

          // Update the user in the database with the new name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }

      if (!token.id && token.sub) {
        token.id = token.sub;
      }

      // Handle session updates (e.g., name change)
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name;
      }

      return token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
