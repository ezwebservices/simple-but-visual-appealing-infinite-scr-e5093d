# Iteration Whiteboard

**Change request:** did you commit and push to github i have this error. Authpool not configured

**Subtasks planned:** 2

1. **Engineer**: Fix the 'Authpool not configured' error. The root cause is that amplify_outputs.json is empty ({}), so Amplify.configure() in src/main.tsx has no auth/Cognito config. Either: (a) run 'npx ampx sandbox' or 'npx ampx generate outputs' to populate amplify_outputs.json with real backend config, or (b) if the backend hasn't been deployed yet, add a runtime guard in src/main.tsx that only calls Amplify.configure() when outputs has actual config, and show a fallback UI in AuthFlow when auth isn't available. Also commit all pending changes (including .orchestrator files) and push to GitHub.
2. **Installer**: After the Engineer pushes, verify the Amplify build succeeds by checking amplify.yml pipeline config and the GitHub remote. Confirm that amplify_outputs.json is either properly populated or that the app gracefully handles the missing auth config without crashing. Check that the build/deploy pipeline in AWS Amplify Console is connected and triggering on push.

---

