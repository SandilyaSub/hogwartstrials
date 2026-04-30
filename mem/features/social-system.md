---
name: Social System (Owl Post)
description: Friending, 1-on-1 + group chats, reporting and auto-blocking
type: feature
---
- Owl Post screen (`src/components/game/Social.tsx`) opened from WorldMap (🦉 button) — screen key `social`.
- Friend discovery: search by username via `search_users_by_username` RPC. Returns only `user_id` + `username` (never email/progress).
- Friendships table with status `pending` | `accepted`. Realtime subscribed.
- Conversations support both 1-on-1 and group chats (`is_group`, optional `title`). Membership via `conversation_members`. Helper `is_conversation_member` (SECURITY DEFINER) avoids recursive RLS.
- Messages: 2000 char limit, realtime per-conversation subscription on insert.
- Reporting: `user_reports` table; trigger `handle_new_report` auto-inserts a `user_blocks` row for the reporter once they file 3 reports against the same user, and inserts a system block (blocker_id all-zero UUID) once a user gets 5 distinct reporters (admin signal).
- Manual blocks also supported via `user_blocks`. Blocked user IDs hide from search results, friends list, and DM conversation list.
- Helper `get_usernames(uuid[])` used to map sender/member ids to display names.
