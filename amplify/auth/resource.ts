import { defineAuth } from '@aws-amplify/backend';

/**
 * NumPals auth — parent accounts with email/password.
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    email: { required: true, mutable: true },
    fullName: { required: true, mutable: true },
  },
});
