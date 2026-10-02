import { useEffect, useState } from "react";
import { fetchHubByName } from "@/api/hub";
import { fetchUserProfilePictureByUsername } from "@/api/user";
import {
  getLocalStorageItemByName,
  getSession,
} from "@/services/sessionService";

export const me = (): string => getLocalStorageItemByName("username");

// A feed shows the same few authors and hubs over and over: one request per name, not per card.
const cached = (load: (key: string) => Promise<string>) => {
  const cache = new Map<string, Promise<string | undefined>>();
  const get = (key: string) => {
    if (!cache.has(key)) cache.set(key, load(key).catch(() => undefined));
    return cache.get(key)!;
  };
  get.clear = () => cache.clear();
  return get;
};

export const userAvatar = cached((username) =>
  fetchUserProfilePictureByUsername(getSession(), username)
);

export const hubIcon = cached((name) =>
  fetchHubByName(getSession(), encodeURIComponent(name)).then(
    (hub) => hub.profileImageUrl
  )
);

const REFRESH = "tweetdev:refresh";

/** Call after anything that changes who/what the user follows, or a profile or hub's identity. */
export const refresh = () => {
  userAvatar.clear();
  hubIcon.clear();
  window.dispatchEvent(new Event(REFRESH));
};

/** Changes whenever refresh() is called; use it as an effect dependency. */
export const useRefreshKey = () => {
  const [key, setKey] = useState(0);
  useEffect(() => {
    const bump = () => setKey((k) => k + 1);
    window.addEventListener(REFRESH, bump);
    return () => window.removeEventListener(REFRESH, bump);
  }, []);
  return key;
};
