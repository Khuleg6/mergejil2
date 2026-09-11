# Talent milestones

## Milestone 1 — Database

- [x] PostgreSQL Prisma schema for MVP and future learning-domain relationships
- [x] Prisma client singleton and migration-ready configuration
- [x] Environment variable example
- [ ] Create and apply the first migration (requires a configured PostgreSQL database)

## Milestone 2 — Authentication

- [x] Teacher registration, login, and password hashing
- [x] Student phone-number and one-time OTP flow
- [x] Database-backed, HttpOnly sessions valid for at least seven days
- [x] Reusable role authorization helpers
- [x] Connect teacher and student login UI to APIs
- [x] Logout API
- [ ] Connect production Redis and SMS providers

Future assignment, grading, reporting, practice, avatar, and streak functionality is intentionally not implemented yet.

## Milestone 3 — Class and student management

- [x] Teacher-owned class create, list, view, rename, and delete APIs
- [x] Add students by normalized phone number without duplicating accounts
- [x] View and remove class memberships without deleting student accounts
- [x] Server-side ownership and teacher-role authorization
- [x] Database-backed teacher dashboard with loading, empty, success, and error states
- [ ] Send production SMS during student onboarding (requires Redis/SMS providers)

## Milestone 4 — Reading materials and vocabulary

- [x] Teacher-owned reading material create, list, view, edit, and delete APIs
- [x] Preserve text formatting while selecting individual word occurrences
- [x] Validate and save vocabulary using character-start positions
- [x] Clear vocabulary safely when unused material text changes
- [x] Block destructive edits when a material is referenced by an assignment
- [x] Database-backed material and vocabulary teacher UI

## Milestone 5 — Assignment phases

- [x] Create DRAFT assignments from a class material and selected vocabulary
- [x] Teacher assignment list, detail, status, and independent phase controls
- [x] Student-only active assignment list scoped by class membership
- [x] Immutable Predict, Confirm, and Apply response submission
- [x] Server-side phase locking and Predict → Confirm → Apply sequencing
- [x] Teacher read-only comparison of student responses
