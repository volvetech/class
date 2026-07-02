import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  username: varchar('username', { length: 100 }),
  authProvider: varchar('auth_provider', { length: 50 }).default('email'),
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
})

export const personImages = pgTable('person_images', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  fileUrl: text('file_url').notNull(),
  width: integer('width'),
  height: integer('height'),
  fileSize: integer('file_size'),
  status: varchar('status', { length: 20 }).default('active'),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

export const garmentCategories = pgTable('garment_categories', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 50 }).unique().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})

export const garmentImages = pgTable('garment_images', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  fileUrl: text('file_url').notNull(),
  detectedCategory: varchar('detected_category', { length: 50 }),
  userSelectedCategory: varchar('user_selected_category', { length: 50 }),
  width: integer('width'),
  height: integer('height'),
  fileSize: integer('file_size'),
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const tryOnJobs = pgTable('try_on_jobs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  personImageId: integer('person_image_id').references(() => personImages.id),
  garmentImageId: integer('garment_image_id').references(() => garmentImages.id),
  garmentCategory: varchar('garment_category', { length: 50 }).notNull(),
  status: varchar('status', { length: 20 }).default('pending'),
  modelName: varchar('model_name', { length: 100 }).default('agnes-image-2.0-flash'),
  modelVersion: varchar('model_version', { length: 50 }).default('2.0'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow(),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
})

export const tryOnResults = pgTable('try_on_results', {
  id: serial('id').primaryKey(),
  jobId: integer('job_id').references(() => tryOnJobs.id).notNull(),
  resultImageUrl: text('result_image_url'),
  thumbnailUrl: text('thumbnail_url'),
  qualityScore: integer('quality_score'),
  isSaved: boolean('is_saved').default(false),
  isDownloaded: boolean('is_downloaded').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

export const resultFeedback = pgTable('result_feedback', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  jobId: integer('job_id').references(() => tryOnJobs.id),
  resultId: integer('result_id').references(() => tryOnResults.id),
  rating: integer('rating'),
  feedbackTags: jsonb('feedback_tags'),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const usageLogs = pgTable('usage_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  jobId: integer('job_id').references(() => tryOnJobs.id),
  usageType: varchar('usage_type', { length: 50 }).notNull(),
  creditChange: integer('credit_change').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})