import * as firebaseAdmin from "firebase-admin";
import { Log } from "../utils/Log";

const privateKey = process.env["PRIVATE_KEY"]
  ? process.env["PRIVATE_KEY"].replace(/\\n/gm, "\n")
  : undefined;
const clientEmail = process.env["CLIENT_EMAIL"];
const projectId = process.env["PROJECT_ID"];

if (!privateKey || !clientEmail || !projectId) {
  Log(
    `Failed to load Firebase credentials. Follow the instructions in the README to set your Firebase credentials inside environment variables.`,
    'critical'
  );
  throw new Error('Failed to load Firebase credentials.');
}

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: privateKey,
      clientEmail,
      projectId,
    }),
    databaseURL: 'https://weedpro-d6fb8-default-rtdb.firebaseio.com',
  });
}

export { firebaseAdmin };
