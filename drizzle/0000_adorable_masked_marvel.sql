DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'auth_provider') THEN
    ALTER TABLE "users" ADD COLUMN "auth_provider" varchar(50) DEFAULT 'email';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'status') THEN
    ALTER TABLE "users" ADD COLUMN "status" varchar(20) DEFAULT 'active';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_login_at') THEN
    ALTER TABLE "users" ADD COLUMN "last_login_at" timestamp;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "person_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"file_url" text NOT NULL,
	"width" integer,
	"height" integer,
	"file_size" integer,
	"status" varchar(20) DEFAULT 'active',
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "person_images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

CREATE TABLE IF NOT EXISTS "garment_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "garment_categories_code_unique" UNIQUE("code")
);

CREATE TABLE IF NOT EXISTS "garment_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"file_url" text NOT NULL,
	"detected_category" varchar(50),
	"user_selected_category" varchar(50),
	"width" integer,
	"height" integer,
	"file_size" integer,
	"status" varchar(20) DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "garment_images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

CREATE TABLE IF NOT EXISTS "try_on_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"person_image_id" integer,
	"garment_image_id" integer,
	"garment_category" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'pending',
	"model_name" varchar(100) DEFAULT 'agnes-image-2.0-flash',
	"model_version" varchar(50) DEFAULT '2.0',
	"error_message" text,
	"created_at" timestamp DEFAULT now(),
	"started_at" timestamp,
	"completed_at" timestamp,
	CONSTRAINT "try_on_jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id"),
	CONSTRAINT "try_on_jobs_person_image_id_fkey" FOREIGN KEY ("person_image_id") REFERENCES "person_images"("id"),
	CONSTRAINT "try_on_jobs_garment_image_id_fkey" FOREIGN KEY ("garment_image_id") REFERENCES "garment_images"("id")
);

CREATE TABLE IF NOT EXISTS "try_on_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"result_image_url" text,
	"thumbnail_url" text,
	"quality_score" integer,
	"is_saved" boolean DEFAULT false,
	"is_downloaded" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "try_on_results_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "try_on_jobs"("id")
);

CREATE TABLE IF NOT EXISTS "result_feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"job_id" integer,
	"result_id" integer,
	"rating" integer,
	"feedback_tags" jsonb,
	"comment" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "result_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id"),
	CONSTRAINT "result_feedback_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "try_on_jobs"("id"),
	CONSTRAINT "result_feedback_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "try_on_results"("id")
);

CREATE TABLE IF NOT EXISTS "usage_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"job_id" integer,
	"usage_type" varchar(50) NOT NULL,
	"credit_change" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "usage_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id"),
	CONSTRAINT "usage_logs_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "try_on_jobs"("id")
);

INSERT INTO "garment_categories" ("code", "name", "sort_order") VALUES 
('top', '上装', 1),
('bottom', '下装', 2),
('dress', '连衣裙', 3)
ON CONFLICT ("code") DO NOTHING;