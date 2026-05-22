import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { rsvps } from "../../db/schema.js";
import { eq, sql } from "drizzle-orm";

export default async (req: Request) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      const { name, email, attendees, message } = body;

      if (!name || !email) {
        return new Response(
          JSON.stringify({ error: "Name and email are required" }),
          { status: 400, headers }
        );
      }

      const existing = await db
        .select()
        .from(rsvps)
        .where(eq(rsvps.email, email.toLowerCase().trim()));

      if (existing.length > 0) {
        const [updated] = await db
          .update(rsvps)
          .set({
            name: name.trim(),
            attendees: Math.max(1, Math.min(12, Number(attendees) || 1)),
            message: (message || "").trim(),
          })
          .where(eq(rsvps.email, email.toLowerCase().trim()))
          .returning();

        return new Response(
          JSON.stringify({ success: true, updated: true, rsvp: updated }),
          { status: 200, headers }
        );
      }

      const [rsvp] = await db
        .insert(rsvps)
        .values({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          attendees: Math.max(1, Math.min(12, Number(attendees) || 1)),
          message: (message || "").trim(),
        })
        .returning();

      return new Response(
        JSON.stringify({ success: true, rsvp }),
        { status: 201, headers }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Could not process RSVP" }),
        { status: 500, headers }
      );
    }
  }

  if (req.method === "GET") {
    try {
      const totalGuests = await db
        .select({ total: sql<number>`coalesce(sum(${rsvps.attendees}), 0)` })
        .from(rsvps);
      const totalRsvps = await db
        .select({ count: sql<number>`count(*)` })
        .from(rsvps);

      return new Response(
        JSON.stringify({
          rsvpCount: Number(totalRsvps[0].count),
          guestCount: Number(totalGuests[0].total),
        }),
        { status: 200, headers }
      );
    } catch {
      return new Response(
        JSON.stringify({ rsvpCount: 0, guestCount: 0 }),
        { status: 200, headers }
      );
    }
  }

  return new Response(
    JSON.stringify({ error: "Method not allowed" }),
    { status: 405, headers }
  );
};

export const config: Config = {
  path: "/api/rsvp",
};
