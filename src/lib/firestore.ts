// Server-only: connects to the lab's Firestore database.
import { Firestore } from "@google-cloud/firestore";

export function getDb() {
  // FIRESTORE_SERVICE_ACCOUNT holds the service-account JSON itself (for
  // hosts like Vercel); GOOGLE_APPLICATION_CREDENTIALS is a path to the file.
  const inline = process.env.FIRESTORE_SERVICE_ACCOUNT;
  if (!inline && !process.env.GOOGLE_APPLICATION_CREDENTIALS) return null;
  return new Firestore({
    projectId: "lilaqmetdata",
    databaseId: "lilaq-data",
    preferRest: true,
    ...(inline ? { credentials: JSON.parse(inline) } : {}),
  });
}
