# Iteration Whiteboard

**Change request:** on the lesson the speech still cuts out mid sentence

**Subtasks planned:** 2

1. **Engineer**: Fix speech cutting out mid-sentence in lessons. Root cause: Chrome's speechSynthesis API silently stops after ~15 seconds of continuous speech. Fix in src/hooks/useAudio.ts by adding a periodic pause()/resume() keep-alive timer (every ~10 seconds) while speech is active — start it when speaking begins, clear it when speech ends or is cancelled. Also review src/components/animations/QuickLessonCard.tsx step durations: ensure getStepDuration() doesn't advance to the next step before the current step's speech finishes (especially steps 5 and 6 which have longer sentences but only 3200ms allocated). Consider making step transitions wait for the utterance's onend event rather than relying solely on fixed timers, or increase STEP_DURATIONS for steps with longer speech. Test with larger numbers (e.g. 5+4) where counting takes longer.
2. **QA**: After the Engineer's fix, verify speech no longer cuts out mid-sentence during lessons. Test: (1) Full lesson playback with small numbers (1+1) and large numbers (5+4, 5-3) — speech should complete every sentence in all 7 steps. (2) Test counting-only and sequence concepts which have different speech paths. (3) Test rapid lesson dismiss and re-open — speech should reset cleanly. (4) Test on Chrome specifically since that's where the speechSynthesis bug manifests. (5) Verify the isSpeaking visual indicator (sound wave bars) stays in sync with actual audio. Update or add tests in src/test/SoundWave.test.tsx to cover the keep-alive timer behavior.

---

