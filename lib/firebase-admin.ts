import {
  initializeApp,
  applicationDefault,
  getApps,
  App,
} from "firebase-admin/app";
import { getRemoteConfig, RemoteConfig } from "firebase-admin/remote-config";

let adminAppInstance: App | undefined;

export function initAdmin(): RemoteConfig {
  if (!getApps().length) {
    adminAppInstance = initializeApp({
      credential: applicationDefault(),
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    });
    console.log("Firebase Admin app initialized for the first time.");
  } else {
    adminAppInstance = getApps()[0];
    console.log("Firebase Admin app already initialized.");
  }

  if (!adminAppInstance) {
    throw new Error("Failed to initialize Firebase Admin app.");
  }

  return getRemoteConfig(adminAppInstance);
}
