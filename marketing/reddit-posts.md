# NumPals Reddit Launch Posts

---

## Post 1: r/Parenting

**Title:** We made a math app for our 4-year-old because every other app felt like a worksheet with cartoons

**Body:**

Hey r/Parenting,

My kid loves swiping on our phones (as all kids do), but every "educational" app we tried was the same thing: tiny buttons, text instructions she can't read, and a worksheet disguised as a game.

So we built NumPals.

The idea is simple: what if a math app worked like TikTok, but for preschoolers? Every swipe is a new card. Each card is a 10-15 second mini-lesson with an animal character. No reading required — everything is visual and audio-driven.

**What makes it different:**

- Infinite scroll format — no menus, no friction, just swipe and learn
- 5 animal characters that teach different skills (counting, addition, subtraction)
- Every number is spoken aloud with sound effects on every tap
- No negative feedback — wrong answers get "Almost! Try again!" and gentle hints
- Covers counting 1-20 and basic addition/subtraction (sums to 10)
- No ads, no links out, no social features, no text input

My daughter's favorite is Rosie the Bunny (subtraction). She doesn't know she's doing math. She thinks she's helping Rosie find her missing carrots.

We have an optional parent dashboard if you want to peek at progress, but honestly the best feedback is hearing your kid giggle at Milo the Monkey's silly sounds.

Would love to hear what you think and what features would matter most to you.

[Link]

---

## Post 2: r/toddlers

**Title:** Finally found screen time I don't feel guilty about — it's a swipeable math app with animal characters

**Body:**

My 4yo has been obsessed with this for two weeks and I just need to share.

It's called NumPals. Imagine TikTok but every video is a 10-second counting lesson with cute animals. She swipes through cards where a blue bear helps her count, a yellow lion teaches addition, and a pink bunny does subtraction.

The key thing: she navigates it entirely by herself. No text to read, buttons are huge, and everything talks to her. Every tap makes a fun sound (she loves the boings).

No ads. No surprise links. No "ask your parent" pop-ups breaking the flow.

She calls the characters by name now. "Mama, Sunny says three plus two!" 

Full disclosure: I helped build this, so I'm biased. But the reaction from her and her friends has been wild. They literally fight over whose turn it is.

---

## Post 3: r/edtech

**Title:** We applied infinite scroll UX to preschool math education — here's what we learned

**Body:**

We just launched NumPals, a math app for ages 3-5 that uses a TikTok-style infinite scroll format instead of traditional menu-based navigation.

**The thesis:** Preschoolers already know how to swipe. They don't know how to navigate menus, read labels, or tap small icons. So we made swiping the entire UX.

**Key design decisions:**

1. **Each card is a complete scene.** Full-screen, no chrome, no nav. One micro-lesson per card (10-15 seconds).

2. **Sound-first, visuals-second.** At 3-5, audio comprehension > visual comprehension. Every number is narrated. Every interaction has audio feedback. Background music is soft xylophone in major key (90-110 BPM) — energizing but not overstimulating.

3. **Touch targets minimum 64x64px.** We tested with actual 4-year-olds. Anything smaller = frustration = abandonment.

4. **Zero negative feedback.** No red X marks, no "wrong" sounds, no score deductions. Wrong answers get a gentle redirect with character encouragement. This was non-negotiable.

5. **Character-driven, not curriculum-driven.** Kids don't think "I want to practice addition." They think "I want to play with Sunny the Lion." Each character maps to a math skill, but the kid just sees a friend.

**The 5 characters:**
- Bloo (Bear, blue) — counting
- Sunny (Lion, yellow) — addition
- Rosie (Bunny, pink) — subtraction
- Milo (Monkey, orange) — mixed challenges
- Pip (Penguin, teal) — number recognition

**Results so far:**
- Average session length is significantly higher than traditional flashcard apps
- Kids voluntarily return without prompting
- Parents report kids "don't know they're learning"

Scope: counting 1-20, addition and subtraction with sums to 10.

Happy to dive deeper into any design decisions. We learned a LOT about designing for pre-readers.

---

## Post 4: r/daddit (or r/Mommit)

**Title:** My kid thinks she's playing with animal friends. She's actually learning addition.

**Body:**

Quick share for parents of 3-5 year olds.

We've been using this app called NumPals. It's like TikTok but for learning math — you swipe through full-screen cards where animal characters teach counting, addition, and subtraction.

What sold me:
- My 4yo uses it completely independently. No "DADDY WHAT DOES THIS SAY"
- Absolutely no ads or sketchy links
- When she gets an answer wrong it says "Almost! Try again!" instead of making her feel bad
- She now counts everything in the house and tells me "Sunny says 3 plus 2 is 5"

What sold HER:
- The animals (especially Milo the Monkey — "he's SO silly daddy")
- The sounds (every tap goes boing or pop or squeak)
- The confetti when she gets answers right

It covers counting to 20 and basic addition/subtraction. Nothing crazy advanced, but that's exactly where she's at.

Worth checking out if you're looking for screen time that actually teaches something.

---

## Post 5: r/IndieHackers or r/SideProject

**Title:** Launched NumPals: a TikTok-style infinite scroll math app for preschoolers

**Body:**

**What:** NumPals is a math app for kids aged 3-5. It uses infinite scroll (think TikTok/Reels) where each card is a 10-15 second micro-lesson starring animal characters.

**Why:** Every kids' math app we tested was built like a shrunken adult app — menus, text labels, small buttons. None of it works for a pre-reader. We designed from scratch for a user who can't read, has a 15-second attention span, and is motivated entirely by color, sound, and silly animals.

**Interesting design constraints:**

- **No text in the UI** (except numbers). Everything communicates through visuals and audio.
- **64px minimum touch targets.** We user-tested with actual 4-year-olds. This was the minimum for reliable tapping.
- **Sound is the primary interface**, not visuals. Audio narrates every interaction.
- **Zero negative feedback.** Never tell a preschooler they're wrong. Redirect and encourage.
- **Infinite scroll creates flow state.** No menu decisions = no friction = no drop-off.

**Tech:** Built as a web app with audio playback, designed for mobile-first interaction.

**Characters:** 5 animal characters, each mapped to a math skill. Kids form attachments to characters, which drives retention better than any gamification mechanic.

Would love feedback from anyone who's built for very young users. The UX constraints are fascinating.
