# Iteration Whiteboard

**Change request:** commit and push  but fore you need to update the meet the pals on the landging oage the logo to reflect the ones being used int he game vuew that are more up to date

**Subtasks planned:** 2

1. **Designer**: Update the 'Meet the Pals' section in landing/index.html (around lines 546-900+) to replace the old simplified inline SVG characters (Bloo Bear, Sunny Bug, Rosie Owl, Milo Frog, Pip Zebra, Rex Robot) with SVGs that match the newer, more detailed character designs used in the game view components (src/components/characters/BlooBear.tsx, SunnyBug.tsx, RosieOwl.tsx, MiloFrog.tsx, PipZebra.tsx, RexRobot.tsx). Extract the SVG paths, gradients, and shapes from those TSX components and adapt them as static inline SVGs for the landing page. Keep the existing .hero-dancer CSS animation class structure (.h-left-leg, .h-right-leg, .h-torso, .h-head, .h-left-arm, .h-right-arm) so the dancing animations still work. The characters should look visually consistent with the game view but remain as inline HTML SVGs sized appropriately for the landing page layout.
2. **Engineer**: After the Designer updates the landing page character SVGs: review the changes for correctness, then stage all modified files (including any other pending changes), commit with a descriptive message like 'Update Meet the Pals landing page characters to match game view designs', and push to the remote repository.

---

