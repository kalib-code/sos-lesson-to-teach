# Field CRM — Future Feature

A team-based contact management system for evangelism fieldwork.

## Overview

Teams assigned to geographic areas (e.g., "Bulacan") can track contacts, lesson progress, daily updates, and Bible study schedules — all from the same app they use to read/teach lessons.

## Core Features

### Authentication & Teams
- Team members sign up with email/password
- Each user belongs to a **team** assigned to an **area**
- Admin can create teams and invite members
- Team members only see their area's data

### Contacts
- Add a contact: name, phone, address, notes
- **Google Maps pin** — paste coordinates or a Maps link to save location
- **Household grouping** — link multiple contacts as one household (e.g., husband + wife + children)
- Household view shows all members and combined progress
- Contact status: new, active, inactive, converted, baptized

### Lesson Progress Tracking
- Per-contact checklist of all lessons (from the existing MDX content)
- Mark lessons as: not started, in progress, completed
- Completion date recorded automatically
- **Household progress** — see which lessons are done for the whole household at a glance
- Visual progress bar per contact and per household
- Filter contacts by: "hasn't started baptism lessons", "completed all conversion lessons", etc.

### Daily Updates / Activity Log
- Team members log visits and notes per contact
- Timestamped entries: "Visited Maria, finished Lesson 3, she has questions about baptism"
- Team feed: see all recent activity across the area
- Useful for handoffs between team members

### Bible Study Scheduling
- Set a recurring schedule per contact/household (e.g., "every Tuesday 3pm")
- Dashboard shows upcoming Bible studies for the week
- Optional: simple reminder notifications

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Supabase** | PostgreSQL database + Auth + Row Level Security |
| **Supabase JS client** | Client-side data access |
| **Next.js API routes** | Server-side operations if needed |
| **Vercel** | Hosting (already set up) |

Supabase free tier: 500MB database, 50K monthly active users, unlimited API requests.

## Database Schema (Draft)

```sql
-- Teams / Areas
teams (
  id uuid PK,
  name text,           -- "Bulacan Team"
  area text,           -- "Bulacan"
  created_at timestamp
)

-- Users (extends Supabase auth.users)
profiles (
  id uuid PK FK -> auth.users,
  team_id uuid FK -> teams,
  full_name text,
  role text             -- "admin" | "member"
)

-- Households
households (
  id uuid PK,
  team_id uuid FK -> teams,
  name text,            -- "Santos Family"
  address text,
  latitude double,
  longitude double,
  notes text,
  created_at timestamp
)

-- Contacts
contacts (
  id uuid PK,
  team_id uuid FK -> teams,
  household_id uuid FK -> households (nullable),
  name text,
  phone text,
  status text,          -- "new" | "active" | "inactive" | "converted" | "baptized"
  notes text,
  created_at timestamp
)

-- Lesson progress per contact
lesson_progress (
  id uuid PK,
  contact_id uuid FK -> contacts,
  lesson_slug text,     -- matches MDX file slug, e.g. "belief-based-on-Gods-word"
  category_slug text,   -- e.g. "lessons-to-teach"
  status text,          -- "not_started" | "in_progress" | "completed"
  completed_at timestamp,
  updated_by uuid FK -> profiles
)

-- Daily updates / activity log
activity_log (
  id uuid PK,
  contact_id uuid FK -> contacts,
  user_id uuid FK -> profiles,
  note text,
  visit_date date,
  created_at timestamp
)

-- Bible study schedules
schedules (
  id uuid PK,
  contact_id uuid FK -> contacts (nullable),
  household_id uuid FK -> households (nullable),
  day_of_week int,      -- 0=Sunday, 6=Saturday
  time time,
  location text,
  notes text,
  active boolean
)
```

## UI Pages (Draft)

```
/[locale]/field/                    -- Dashboard: upcoming studies, recent activity
/[locale]/field/contacts            -- Contact list with search & filters
/[locale]/field/contacts/new        -- Add contact form
/[locale]/field/contacts/[id]       -- Contact detail: info, progress, log
/[locale]/field/households          -- Household list
/[locale]/field/households/[id]     -- Household detail: members, combined progress
/[locale]/field/schedule            -- Weekly calendar view
/[locale]/field/activity            -- Team activity feed
```

## Implementation Phases

### Phase 1: Foundation
- Set up Supabase project
- Add environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- Install @supabase/supabase-js
- Create database tables and Row Level Security policies
- Auth: login/signup pages, session management

### Phase 2: Contacts & Households
- Contact list page with search
- Add/edit contact form with Google Maps coordinate input
- Household creation and member linking
- Contact detail page

### Phase 3: Lesson Progress
- Per-contact lesson checklist (reads lesson slugs from existing content)
- Progress bars and completion tracking
- Household combined progress view
- Filter contacts by lesson completion

### Phase 4: Activity Log & Scheduling
- Daily update form on contact detail page
- Team activity feed
- Schedule creation per contact/household
- Weekly dashboard with upcoming studies

### Phase 5: Polish
- Offline support for field data (queue updates when offline)
- Map view of all contacts in the area
- Export/reports for team leaders
- Push notifications for scheduled studies
