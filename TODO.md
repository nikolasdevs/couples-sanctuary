# Hydration Fix Plan

## Root Cause

In `app/experience/play/PlayContent.tsx`, the `useState` initialization uses `generateCard()` which calls `Math.random()` via `randomItem()`. This causes a hydration mismatch because:

- Server renders: random card A
- Client hydrates: random card B (different!)

## Fix Steps

- [x] 1. Identify the hydration mismatch issue
- [x] 2. Review relevant files (PlayContent.tsx, lib/random.ts)
- [x] 3. Fix useState initialization in PlayContent.tsx
- [x] 4. Add loading state to prevent hydration mismatch
- [x] 5. Test the fix

## Code Changes Applied

### PlayContent.tsx

1. Changed `currentCard` useState initialization from `useState(() => generateCard())` to `useState<{category: string; text: string} | null>(null)`
2. Added `const [isLoading, setIsLoading] = useState(true);`
3. Modified the useEffect to set `setIsLoading(false)` after initializing the card
4. Added loading state check before rendering the card:

```tsx
if (isLoading || !currentCard) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-amber-400 animate-pulse">Loading...</div>
    </main>
  );
}
```

This ensures:

- Server renders null (loading state)
- Client hydrates null (loading state)
- Client generates random card after hydration
- No hydration mismatch!

## Result

✅ Hydration mismatch fixed! The app now renders a loading state on both server and client, ensuring consistent HTML. The random card is generated only on the client side after hydration.
