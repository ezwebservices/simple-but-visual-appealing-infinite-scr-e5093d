# Iteration Whiteboard

**Change request:** simple fix the index html pals are the old and not updated ones

**Subtasks planned:** 2

1. **Engineer**: Update index.html so the pal illustrations/markup match the current canonical pal designs used in the app (the same set referenced by the recent landing resync in commit bf281c3). Steps: (1) Identify the current source of truth for pal SVGs in the codebase (component/assets used by the live app). (2) Replace the stale pal SVGs/names/labels in index.html with the updated versions. (3) Ensure names, colors, and any alt text/labels are consistent with the in-app versions (e.g. 'Rex Robot' not 'Rex Dino'). Do not change layout or unrelated markup. Keep the file backward-compatible — this is a static content refresh.
2. **QA**: Open index.html in a browser and visually verify every pal illustration and label matches the current in-app pal designs. Confirm no stale names (e.g. 'Rex Dino'), no broken SVGs, and no layout regressions on desktop and mobile widths. Report any mismatches with a screenshot or precise description.

---

