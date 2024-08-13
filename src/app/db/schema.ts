import { pgTable, serial, text, uuid, timestamp, time, integer, boolean, date } from 'drizzle-orm/pg-core';

export const staff = pgTable('staff', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  staffId: text('staff_id'),
  clerkUserId: text('clerk_user_id').notNull(),
  clerkOrgId: text('clerk_org_id').notNull(),
  status: text('status'),
  docUrl: text('docUrl'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
});

export const hour = pgTable('hour', {
  id: uuid('id').primaryKey(),
  hour: text('hour')
});

export const branch = pgTable('branch', {
  id: uuid('id').primaryKey(),
  name: text('name'),
  institutionId: uuid('institution_id')
});

export const semester = pgTable('semester', {
  id: uuid('id').primaryKey(),
  institutionId: uuid('institution_id'),
  number: integer('number'),
  status: text('status')
});

export const section = pgTable('section', {
  id: uuid('id').primaryKey(),
  semesterId: uuid('semester_id').references(() => semester.id),
  name: text('name'),
  batchSize: integer('batch_size'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
});

export const batch = pgTable('batch', {
  id: uuid('id').primaryKey(),
  sectionId: uuid('section_id').references(() => section.id),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
});

export const subject = pgTable('subject', {
  id: uuid('id').primaryKey(),
  code: text('code'),
  name: text('name'),
  branchId: uuid('branch_id').references(() => branch.id),
  semesterId: uuid('semester_id').references(() => semester.id)
});

export const timetableSession = pgTable('timetable_session', {
  id: uuid('id').primaryKey(),
  branchId: uuid('branch_id').references(() => branch.id),
  semesterId: uuid('semester_id').references(() => semester.id),
  sectionId: uuid('section_id').references(() => section.id),
  batchId: uuid('batch_id').references(() => batch.id),
  subjectId: uuid('subject_id').references(() => subject.id),
  staffId: integer('staff_id').references(() => staff.id),
  day: text('day'),
  hourId: uuid('hour_id').references(() => hour.id),
  startTime: time('start_time'),
  endTime: time('end_time'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
});

export const timetableHistory = pgTable('timetable_history', {
  id: uuid('id').primaryKey(),
  timetableSessionId: uuid('timetable_session_id').references(() => timetableSession.id),
  changedBy: integer('changed_by').references(() => staff.id),
  changeType: text('change_type'), // 'create', 'update', 'delete'
  oldData: text('old_data'), // JSON string of old data
  newData: text('new_data'), // JSON string of new data
  changeDate: timestamp('change_date').defaultNow(),
  effectiveFrom: date('effective_from'),
  effectiveTo: date('effective_to')
});