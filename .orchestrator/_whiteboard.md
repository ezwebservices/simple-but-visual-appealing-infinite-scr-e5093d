# Iteration Whiteboard

**Change request:** we need a custom subscription  method versus checkout work through this first though commit and push

**Subtasks planned:** 3

1. **Engineer**: Commit and push all current uncommitted changes to main. Stage the modified files (src/App.tsx, src/components/SubscriptionGate.tsx, .orchestrator/_whiteboard.md, .orchestrator/build.json) and the new file (src/components/LoadingScreen.tsx). Write a clear commit message summarizing: added LoadingScreen with dancing characters, removed 14-day trial from SubscriptionGate (instant payment required), added Stripe test-mode banner and CLI status indicator, integrated LoadingScreen into App.tsx auth check. Push to origin/main.
2. **Architect**: Design the custom subscription flow to replace the current Stripe Checkout redirect in SubscriptionGate.tsx. The current approach redirects users to a Stripe Payment Link (STRIPE_CHECKOUT_URL). We need an in-app subscription experience instead. Evaluate: (1) Using Stripe Elements / @stripe/react-stripe-js to embed a payment form directly in the SubscriptionGate paywall UI, (2) What backend/serverless endpoint is needed to create a Stripe PaymentIntent or Subscription (e.g., an AWS Amplify Lambda function), (3) How to handle subscription confirmation without leaving the app (webhook vs client-side confirmation), (4) How this integrates with the existing Cognito auth (linking Stripe customerId to the authenticated user). Output a concrete technical spec with the component structure, API endpoints needed, and env vars required.
3. **Engineer**: Implement the custom in-app subscription flow based on the Architect's design. Replace the Stripe Checkout redirect in SubscriptionGate.tsx with an embedded Stripe Elements payment form. Key changes: (1) Install @stripe/stripe-js and @stripe/react-stripe-js, (2) Create an embedded payment form component within the paywall UI (card input, submit button, error handling), (3) Add a serverless API endpoint (Amplify Lambda or API route) that creates a Stripe Subscription with a PaymentIntent for $14.99/year, (4) On successful payment, update the subscription status in-app and cache it, (5) Maintain the existing dev-mode Stripe test banner and CLI status indicator. Keep the same visual style (colors, fonts, rounded cards) from the current paywall design.

---

