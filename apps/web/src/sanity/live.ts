import { defineLive } from "next-sanity/live";
import { client } from "@/sanity/client";

const token = process.env.SANITY_API_READ_TOKEN;

if (!token) {
  throw new Error(
    "Missing SANITY_API_READ_TOKEN. Add a Viewer token to apps/web/.env.local so SanityLive can subscribe to live updates."
  );
}

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
});
