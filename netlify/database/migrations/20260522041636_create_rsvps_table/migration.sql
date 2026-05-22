CREATE TABLE "rsvps" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"attendees" integer DEFAULT 1 NOT NULL,
	"message" text DEFAULT '',
	"attending" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now()
);
