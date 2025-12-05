import { initializeApp } from "firebase/app";
import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
  onConfigUpdate,
} from "firebase/remote-config";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

export function initFirebase() {
  const app = initializeApp(firebaseConfig);
  const rc = getRemoteConfig(app);

  rc.settings = {
    minimumFetchIntervalMillis: 3600000,
    fetchTimeoutMillis: 60000,
  };
  rc.defaultConfig = {
    darkMode: false,
    animations: false,
    premiumBadge: false,
  };

  return rc;
}

export async function getAllFlags(rc: ReturnType<typeof initFirebase>) {
  await fetchAndActivate(rc);

  return {
    darkMode: getValue(rc, "darkMode").asBoolean(),
    animations: getValue(rc, "animations").asBoolean(),
    premiumBadge: getValue(rc, "premiumBadge").asBoolean(),
  };
}

export function subscribeToUpdates(
  rc: ReturnType<typeof initFirebase>,
  cb: () => void
) {
  return onConfigUpdate(rc, {
    complete: () => {
      console.log("Listening stopped.");
    },
    next: (configUpdate) => {
      console.log("updated keys", configUpdate.getUpdatedKeys());
      cb();
    },
    error: (err) => {
      console.error("Remote Config update listener error", err);
    },
  });
}
