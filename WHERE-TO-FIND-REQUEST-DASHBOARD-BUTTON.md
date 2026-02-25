# Where to Find the "Request Dashboard" Button

## Location 1: On Service Cards in the Marketplace

### Step-by-Step:

1. **Navigate to Digital Intelligence Marketplace**
   - URL: `/marketplaces/digital-intelligence`
   - Or click "Marketplaces" in header → "Digital Intelligence"

2. **Browse Services**
   - You'll see three tabs:
     - Systems Portfolio & Lifecycle (12 services)
     - Digital Maturity (8 services)
     - Projects Portfolio & Lifecycle (10 services)

3. **Find the Button on Each Card**
   - Each service card displays:
     - Service icon (top left)
     - Service title and description
     - AI capabilities (if AI-powered)
     - Service features (data source, update frequency)
     - Key insights
     - **"Request Dashboard" button** (bottom right) ← HERE!

### Visual Layout of Card:

```
┌─────────────────────────────────────────────┐
│  [Icon]              [Analytics Type] [AI]  │
│                                              │
│  Service Title                               │
│  Service description...                      │
│                                              │
│  AI Capabilities:                            │
│  [Capability 1] [Capability 2]              │
│                                              │
│  Service Features:                           │
│  📊 Data Source                              │
│  🕐 Update Frequency                         │
│  📈 Visualization Type                       │
│                                              │
│  Key Insights:                               │
│  [Insight 1] [Insight 2]                    │
│                                              │
│  ─────────────────────────────────────────  │
│  [95% Accuracy]    [Request Dashboard →]    │ ← BUTTON HERE!
└─────────────────────────────────────────────┘
```

### What Happens When You Click:

1. **If you click the card itself** (anywhere except the button):
   - You go to the detail page: `/marketplaces/digital-intelligence/:tab/:serviceId`
   - Example: `/marketplaces/digital-intelligence/projects-portfolio/delivery-velocity-analytics`

2. **If you click the "Request Dashboard" button**:
   - Same as clicking the card - goes to detail page
   - The button is just a more prominent call-to-action

---

## Location 2: On the Service Detail Page

### Step-by-Step:

1. **Click on any service card** (or the "Request Dashboard" button on the card)
   - This takes you to the detail page

2. **Scroll to the Service Header Section**
   - You'll see:
     - Service icon and title
     - Full description
     - Badges (AI-Powered, Complexity, Analytics Type)
     - Key metadata (Accuracy, Update Frequency, etc.)
     - **"Request Dashboard" button** (large purple button) ← HERE!

### Visual Layout of Detail Page Header:

```
┌─────────────────────────────────────────────────────────┐
│  [Analytics Type] [AI-Powered] [Medium Complexity]      │
│                                                          │
│  [Icon]  Delivery Velocity Analytics                    │
│          Track and predict project delivery velocity... │
│                                                          │
│  Accuracy: 91%  |  Complexity: Medium  |  Real-time     │
│                                                          │
│  ┌──────────────────────────────────┐                   │
│  │  📊 Request Dashboard            │  ← BUTTON HERE!   │
│  └──────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

### What Happens When You Click:

1. **Login Modal Appears**
   - Title: "Login Required"
   - Description: "Please log in to access the [Service Name] dashboard"
   - Email and password fields
   - "Log In" button

2. **After Login**
   - You're automatically redirected to Stage 2
   - URL: `/stage2/intelligence/services/:serviceId`
   - Example: `/stage2/intelligence/services/delivery-velocity-analytics`
   - You see the interactive dashboard with charts, metrics, and AI insights

---

## Complete User Flow

```
Marketplace Card
     ↓
[Request Dashboard] button clicked
     ↓
Detail Page
     ↓
[Request Dashboard] button clicked (in header)
     ↓
Login Modal appears
     ↓
User enters credentials
     ↓
Clicks "Log In"
     ↓
Redirected to Stage 2 Dashboard
     ↓
Interactive dashboard with:
  - Charts (velocity trends)
  - Metrics (current velocity, predictions)
  - AI Insights (alerts, recommendations)
  - Actions (export, schedule, request updates)
```

---

## Quick Test

To quickly test the flow:

1. Go to: `http://localhost:5173/marketplaces/digital-intelligence`
2. Click on the "Projects Portfolio & Lifecycle" tab
3. Find the "Delivery Velocity Analytics" card
4. Look at the bottom right of the card
5. You should see: **[Request Dashboard →]** button in purple
6. Click it → goes to detail page
7. On detail page, look for the large purple **[📊 Request Dashboard]** button
8. Click it → login modal appears
9. Enter any email/password → click "Log In"
10. You're redirected to: `/stage2/intelligence/services/delivery-velocity-analytics`
11. You see the interactive dashboard! 🎉

---

## Troubleshooting

### "I don't see the button on the cards"

- Make sure you're on the Digital Intelligence marketplace page
- Check that you're looking at the bottom right of each card
- The button should be purple with white text
- Try refreshing the page

### "The button doesn't do anything"

- Check browser console for errors
- Make sure the onClick handler is working
- Try clicking directly on the button text

### "I see 'View Analytics' instead of 'Request Dashboard'"

- The code has been updated to show "Request Dashboard"
- Run `npm run build` to rebuild
- Clear browser cache and refresh

### "Login modal doesn't appear"

- Check that the LoginModal component is imported
- Verify the modal state is being set correctly
- Check browser console for errors

---

## Summary

The **"Request Dashboard"** button appears in TWO places:

1. **Bottom right of each service card** in the marketplace
2. **Large button in the header** of the service detail page

Both buttons lead to the same flow: Detail page → Login → Stage 2 Dashboard

The button is styled in purple (`bg-purple-600`) with white text and an arrow icon (→).
