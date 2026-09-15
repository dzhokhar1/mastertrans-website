CREATE TABLE "counterparties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ref_1c" uuid NOT NULL,
	"name" text NOT NULL,
	"inn" varchar(12),
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "counterparties_ref_1c_unique" UNIQUE("ref_1c")
);
--> statement-breakpoint
CREATE TABLE "direction_prices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"direction_ref" uuid NOT NULL,
	"nomenclature_ref" uuid NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"price_unit" varchar(32),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "directions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ref_1c" uuid NOT NULL,
	"city_from" text NOT NULL,
	"city_to" text NOT NULL,
	"transit_days" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "directions_ref_1c_unique" UNIQUE("ref_1c")
);
--> statement-breakpoint
CREATE TABLE "nomenclature" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ref_1c" uuid NOT NULL,
	"name" text NOT NULL,
	"kind" varchar(32) DEFAULT 'service' NOT NULL,
	"unit" varchar(32),
	"base_price" numeric(12, 2),
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "nomenclature_ref_1c_unique" UNIQUE("ref_1c")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" varchar(16) DEFAULT 'new' NOT NULL,
	"ref_1c" uuid,
	"number_1c" varchar(32),
	"payload" jsonb NOT NULL,
	"created_by_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"acked_at" timestamp with time zone,
	CONSTRAINT "orders_ref_1c_unique" UNIQUE("ref_1c")
);
--> statement-breakpoint
CREATE TABLE "pickup_points" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ref_1c" uuid NOT NULL,
	"city" text NOT NULL,
	"address" text NOT NULL,
	"phone" varchar(32),
	"schedule" text,
	"lat" numeric(9, 6),
	"lon" numeric(9, 6),
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pickup_points_ref_1c_unique" UNIQUE("ref_1c")
);
--> statement-breakpoint
CREATE TABLE "shipment_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shipment_ref" uuid NOT NULL,
	"status_1c" varchar(64) NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ref_1c" uuid NOT NULL,
	"track_code" varchar(16) NOT NULL,
	"status_1c" varchar(64) NOT NULL,
	"direction_ref" uuid,
	"sender_ref" uuid,
	"receiver_ref" uuid,
	"payer_ref" uuid,
	"places_count" integer,
	"weight_kg" numeric(10, 3),
	"volume_m3" numeric(10, 3),
	"total_amount" numeric(12, 2),
	"services_detail" jsonb,
	"status_updated_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shipments_ref_1c_unique" UNIQUE("ref_1c"),
	CONSTRAINT "shipments_track_code_unique" UNIQUE("track_code")
);
--> statement-breakpoint
CREATE TABLE "status_map" (
	"code_1c" varchar(64) PRIMARY KEY NOT NULL,
	"public_code" varchar(32) NOT NULL,
	"public_label" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sync_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"direction" varchar(8) NOT NULL,
	"endpoint" text NOT NULL,
	"payload" jsonb,
	"status" varchar(16) NOT NULL,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "direction_prices" ADD CONSTRAINT "direction_prices_direction_ref_directions_ref_1c_fk" FOREIGN KEY ("direction_ref") REFERENCES "public"."directions"("ref_1c") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "direction_prices" ADD CONSTRAINT "direction_prices_nomenclature_ref_nomenclature_ref_1c_fk" FOREIGN KEY ("nomenclature_ref") REFERENCES "public"."nomenclature"("ref_1c") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment_events" ADD CONSTRAINT "shipment_events_shipment_ref_shipments_ref_1c_fk" FOREIGN KEY ("shipment_ref") REFERENCES "public"."shipments"("ref_1c") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_direction_ref_directions_ref_1c_fk" FOREIGN KEY ("direction_ref") REFERENCES "public"."directions"("ref_1c") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_sender_ref_counterparties_ref_1c_fk" FOREIGN KEY ("sender_ref") REFERENCES "public"."counterparties"("ref_1c") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_receiver_ref_counterparties_ref_1c_fk" FOREIGN KEY ("receiver_ref") REFERENCES "public"."counterparties"("ref_1c") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_payer_ref_counterparties_ref_1c_fk" FOREIGN KEY ("payer_ref") REFERENCES "public"."counterparties"("ref_1c") ON DELETE no action ON UPDATE no action;