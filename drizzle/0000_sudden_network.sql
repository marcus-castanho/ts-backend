CREATE TABLE "auth" (
	"id" serial PRIMARY KEY NOT NULL,
	"credentials" json,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "auth_blacklist" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"expiresAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "auth_blacklist_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "biometric_keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"public_key" text NOT NULL,
	"challenge" text NOT NULL,
	"enrolled_at" timestamp DEFAULT now() NOT NULL,
	"last_used_at" timestamp,
	"device_info" json,
	CONSTRAINT "biometric_keys_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"email" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "auth" ADD CONSTRAINT "auth_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biometric_keys" ADD CONSTRAINT "biometric_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;