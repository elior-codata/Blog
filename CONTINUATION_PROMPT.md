# Continuation Prompt — Itinerant Pixels Travel Blog

## Project Location
`/Users/elior/Applications/Blog/Blog/`

## What This Project Is
A static HTML/CSS/JS travel blog called **"Itinerant Pixels"** with a full account platform. All data is stored in **localStorage** (no backend). Served via `python3 -m http.server 8000`.

---

## Current User Request (what we're implementing)
> "in the account page it should only be my trips and feed. in the trip it can be share option to the feed. i can search and follow my friends. and the album is still not getting the images from the photos of the trip. it doesn't need to ask me to upload new images"

---

## What's DONE (do NOT redo these)

### 1. Account page simplified (account.html + account.css) ✅
- Side panel shows only 2 features: "Plan & manage your trips" and "Share trips & follow friends on the Feed"
- Added link buttons: "My Trips" → my-trips.html, "Travel Feed" → travel-feed.html
- CSS classes: `.auth-side-links`, `.auth-side-link`

### 2. Share to Feed button in trip detail (trip-detail.html + trip-detail.css + trip-detail.js) ✅
- Button in trip hero: `<button class="trip-share-btn" id="shareToFeed" onclick="shareToFeed()">`
- Glass morphism CSS with `.shared` state (green tint)
- JS at bottom of trip-detail.js:
  - `SHARED_KEY = 'ip_shared_trips'`
  - `getSharedTrips()`, `saveSharedTrips()`, `isTripShared()`, `updateShareBtn()`
  - `window.shareToFeed()` — toggles share/unshare
  - Shared trip entry: `{ tripId, userId, userName, sharedAt }`

### 3. Album picker empty text fix (trip-detail.html + trip-detail.js) ✅
- Changed from "Upload photos first to add them to albums" to "No photos in this trip yet. Go to Photos tab to upload some first."
- The `openAlbumModal` function already correctly populates the picker grid from `trip.photos` — it maps each photo as a clickable `.picker-thumb` with `data-id` and `img src=p.dataUrl`

### 4. Search & Follow UI (travel-feed.html + travel-feed.css) ✅
- **HTML added to travel-feed.html:**
  - Search section: `<section class="feed-search-section">` with `#friendSearch` input and `#searchResults` dropdown
  - Following bar: `<div class="feed-following-bar" id="followingBar">` with `#followingChips`
  - View tabs: Feed (`data-view="feed"`) / My Trips (`data-view="mine"`) toggle buttons
  - Feed section title has `id="feedSectionTitle"`
  - Empty state: "No trips in your feed" / "Share your trips or follow friends to see their journeys!"

- **CSS added to travel-feed.css (~250 lines):**
  - `.feed-search-section`, `.feed-search-bar`, `.feed-search-input-wrap` (with focus-within accent border)
  - `.feed-search-results` (absolute dropdown), `.search-result-item` (flex: avatar, info, follow button)
  - `.search-result-avatar`, `.search-result-name`, `.search-result-email`
  - `.search-result-btn` (outline) / `.search-result-btn.following` (filled accent, hover = red)
  - `.search-no-results` (centered text)
  - `.feed-following-bar`, `.following-label`, `.following-chips`, `.following-chip` (pill with avatar, name, × remove)
  - `.feed-tabs-section`, `.feed-view-tabs`, `.feed-view-tab` / `.feed-view-tab.active` (dark filled)

---

## What NEEDS TO BE DONE

### 5. Rewrite travel-feed.js to add search/follow/shared-trips logic ❌ (CRITICAL)

The current `travel-feed.js` only shows the current user's own trips. It needs to be **rewritten** to support:

1. **Search users**: Query `ip_users` localStorage by name/email, render results in `#searchResults` dropdown
2. **Follow/unfollow**: Store following list in `ip_following_{userId}` localStorage key
3. **Following bar**: Render followed users as chips in `#followingChips` with remove (unfollow) buttons
4. **Feed view**: Show shared trips from followed users + own shared trips (read `ip_shared_trips` + their `ip_trips_{userId}`)
5. **My Trips view**: Show only current user's own trips (existing behavior)
6. **View tab switching**: `.feed-view-tab` click handlers, update `#feedSectionTitle` text
7. **Preserve all existing features**: profile stats, world map with pins, timeline post cards, year highlights, filter pills

### 6. Fix `user.name` bug in travel-feed.js ❌

**IMPORTANT BUG**: The session object stored in `ip_auth_user` has `firstName` and `lastName` — NOT `name`. The current travel-feed.js references `user.name` everywhere (avatar, profile, post cards). This needs to be fixed to use `user.firstName` / `user.lastName`.

Session object shape (from account.js login):
```js
{ id, email, firstName, lastName, avatar }
```

### 7. Verify JS syntax ❌
Run `node --check travel-feed.js` after changes.

---

## localStorage Data Model

| Key | Shape | Description |
|-----|-------|-------------|
| `ip_auth_user` | `{ id, email, firstName, lastName, avatar }` | Current logged-in session |
| `ip_users` | `[{ id, email, firstName, lastName, password, avatar, createdAt }]` | All registered users (searchable) |
| `ip_trips_{userId}` | `[{ id, name, destination, startDate, endDate, coverImage, notes, bookings:[], plan:[], photos:[], albums:[], createdAt }]` | Trips per user |
| `ip_shared_trips` | `[{ tripId, userId, userName, sharedAt }]` | Global list of shared trips (written by trip-detail.js) |
| `ip_following_{userId}` | `[{ id, firstName, lastName, email }]` | **NEW — needs to be created by travel-feed.js** |

### Photo object shape (inside trip.photos[]):
```js
{ id, name, dataUrl, uploadedAt }
```

### Album object shape (inside trip.albums[]):
```js
{ id, name, description, photoIds: [photoId, ...], createdAt }
```

---

## HTML Elements in travel-feed.html That Need JS Wiring

```
#friendSearch          — input for searching users
#searchResults         — dropdown div for search results (display:none by default)
#followingBar          — container for following chips (display:none by default)
#followingChips        — div where chips go
.feed-view-tab[data-view="feed"]   — Feed tab button
.feed-view-tab[data-view="mine"]   — My Trips tab button  
#feedSectionTitle      — h2 title ("Travel Feed" vs "My Trips")
#feedTimeline          — timeline container for post cards
#feedEmpty             — empty state div
#worldMap              — canvas for map
#mapPins               — div for map pin overlays
#feedHighlights        — year highlights section
#highlightsScroll      — highlights scroll container
.feed-pill[data-filter] — filter pills (all/upcoming/ongoing/past)

Profile elements:
#feedAvatarBig, #feedProfileName
#statTrips, #statCountries, #statPhotos, #statDays
```

## CSS Classes Available for Search Results Rendering

```html
<!-- Search result item template -->
<div class="search-result-item">
    <div class="search-result-avatar">E</div>
    <div class="search-result-info">
        <div class="search-result-name">Elior Smith</div>
        <div class="search-result-email">elior@example.com</div>
    </div>
    <button class="search-result-btn">Follow</button>
    <!-- OR if already following: -->
    <button class="search-result-btn following">Following</button>
</div>

<!-- No results -->
<div class="search-no-results">No travelers found</div>

<!-- Following chip template -->
<div class="following-chip">
    <span class="following-chip-avatar">E</span>
    <span class="following-chip-name">Elior</span>
    <button class="following-chip-remove" title="Unfollow">&times;</button>
</div>
```

---

## Design System

- **CSS Variables**: `--color-primary: #2c3e50`, `--color-secondary: #8b7355`, `--color-accent: #d4a574`, `--color-cream: #faf8f5`
- **Fonts**: `'Cormorant Garamond'` (headings), `'Montserrat'` (body)
- **Style**: Warm, elegant travel aesthetic with glass morphism effects

---

## Key Files to Modify

| File | What to do |
|------|-----------|
| `travel-feed.js` | Full rewrite — add search, follow, shared trips feed, view tabs, fix `user.name` → `user.firstName`/`user.lastName` |

## Key Files for Reference (DO NOT modify)

| File | Why |
|------|-----|
| `account.js` | Shows user registration shape, `ip_users` and `ip_auth_user` keys |
| `trip-detail.js` | Shows share system (`ip_shared_trips` key, share data shape) |
| `travel-feed.html` | Already has all the HTML elements for search/follow/tabs |
| `travel-feed.css` | Already has all CSS styles for search/follow/tabs |

---

## Detailed Implementation Plan for travel-feed.js

The rewrite should:

1. **Fix user name references**: Replace all `user.name` with computed `(user.firstName + ' ' + (user.lastName || '')).trim() || 'Traveler'`

2. **Add following system**:
   - `FOLLOWING_KEY = 'ip_following_' + user.id`
   - `getFollowing()` → returns array of `{ id, firstName, lastName, email }`
   - `saveFollowing(list)` → saves to localStorage
   - `isFollowing(userId)` → boolean check
   - `followUser(userObj)` / `unfollowUser(userId)` → add/remove from list

3. **Add search functionality**:
   - Listen to `#friendSearch` input events (debounced ~300ms)
   - Search `ip_users` by firstName, lastName, or email (case-insensitive, partial match)
   - Exclude current user from results
   - Render results in `#searchResults` using the CSS classes above
   - Each result has a Follow/Following toggle button
   - Hide dropdown when input is empty or on outside click

4. **Render following bar**:
   - `renderFollowingBar()` — show/hide `#followingBar`, populate `#followingChips`
   - Each chip has × button that calls `unfollowUser()` and re-renders

5. **View tab switching**:
   - `currentView` variable: `'feed'` or `'mine'`
   - Click handlers on `.feed-view-tab` buttons
   - When `'feed'`: title = "Travel Feed", load shared trips from followed users + own
   - When `'mine'`: title = "My Trips", load only own trips (current behavior)

6. **Feed data aggregation** (for `'feed'` view):
   - Read `ip_shared_trips` global list
   - Filter to: entries where `userId` is in the user's following list OR is the user themselves
   - For each shared entry, load the actual trip from `ip_trips_{entry.userId}`
   - Pass these aggregated trips to `renderFeed()` with the owner info attached
   - In `buildPostCard()`, show the trip owner's name/avatar (not always the current user)

7. **Update `buildPostCard()`**:
   - Accept an optional `owner` parameter `{ name, initial }` for feed view posts from other users
   - Default to current user info for "My Trips" view

8. **Keep all existing features working**:
   - Profile banner (own stats only)
   - World map (show pins for all visible trips)
   - Timeline cards with photos
   - Year highlights (own trips only)
   - Filter pills (all/upcoming/ongoing/past)

---

## How to Test

1. Register 2+ accounts at `localhost:8000/account.html`
2. In each account, create trips with photos and click "Share to Feed"
3. In the Feed page, search for the other account, follow them
4. Switch between Feed / My Trips tabs — Feed should show followed users' shared trips
5. Unfollow via chip × button, verify trips disappear from feed

---

## Run After Changes
```bash
node --check travel-feed.js && echo "OK"
```
