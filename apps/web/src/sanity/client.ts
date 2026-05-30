import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "ish86r1l",
  dataset: "production",
  apiVersion: "2026-05-30",
  useCdn: false,
});