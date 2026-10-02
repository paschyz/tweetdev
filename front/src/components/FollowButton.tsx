import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchIsHubFollowedBySelf, toggleFollowHub } from "@/api/hub";
import { fetchIsUserFollowed, followUser } from "@/api/user";
import { Button } from "@/components/ui/button";
import { refresh } from "@/lib/lookups";
import { getSession } from "@/services/sessionService";

const API = {
  user: { isFollowed: fetchIsUserFollowed, toggle: followUser },
  // hub endpoints build their own query string
  hub: {
    isFollowed: (token: string, name: string) =>
      fetchIsHubFollowedBySelf(token, encodeURIComponent(name)),
    toggle: (token: string, name: string) =>
      toggleFollowHub(token, encodeURIComponent(name)),
  },
};

/** Follow / unfollow a person or a hub. `onChange` gets +1 or -1 for the follower count. */
export default function FollowButton({
  kind,
  name,
  onChange,
}: {
  kind: "user" | "hub";
  name: string;
  onChange?: (delta: number) => void;
}) {
  const [followed, setFollowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (!name) return;
    setFollowed(null);
    API[kind]
      .isFollowed(getSession(), name)
      .then((response) => setFollowed(!!response.isFollowed))
      .catch(() => setFollowed(false));
  }, [kind, name]);

  const toggle = async () => {
    const next = !followed;
    setFollowed(next);
    onChange?.(next ? 1 : -1);
    try {
      await API[kind].toggle(getSession(), name);
      refresh();
    } catch {
      setFollowed(!next);
      onChange?.(next ? -1 : 1);
      toast.error(`Couldn't ${next ? "follow" : "unfollow"} ${name}. Try again.`);
    }
  };

  return (
    <Button
      variant={followed ? "outline" : "default"}
      disabled={followed === null}
      onClick={toggle}
      className="min-w-24"
    >
      {followed ? "Unfollow" : "Follow"}
    </Button>
  );
}
