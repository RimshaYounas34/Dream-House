
import {
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getServiceAccount() {
  // Vercel environment variable
  const credentials = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (credentials) {
    const serviceAccount = JSON.parse(credentials);

    if (serviceAccount.private_key) {
      serviceAccount.private_key =
        serviceAccount.private_key.replace(/\\n/g, "\n");
    }

    return serviceAccount;
  }

  // Local development fallback
  const serviceAccountPath = path.join(
    __dirname,
    "serviceAccountKey.json"
  );

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      "Firebase credentials are not configured"
    );
  }

  return JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf8")
  );
}

const firebaseApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(getServiceAccount()),
      });

const firebaseAuth = getAuth(firebaseApp);

export default firebaseAuth;
