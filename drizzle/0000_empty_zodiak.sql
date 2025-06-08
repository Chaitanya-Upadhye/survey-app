CREATE TABLE "survey_responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"survey_id" varchar NOT NULL,
	"response" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_survey_unique" UNIQUE("user_id","survey_id")
);
