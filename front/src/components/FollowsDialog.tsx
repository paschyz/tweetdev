import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchGetFollowUsers } from "@/api/user";
import { UserAvatar } from "@/components/Identity";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSession } from "@/services/sessionService";

type Tab = "following" | "followers";

/** Who `username` follows and who follows them. `tab` is the list to open on, or null when closed. */
export default function FollowsDialog({
  username,
  tab,
  onTabChange,
}: {
  username: string;
  tab: Tab | null;
  onTabChange: (tab: Tab | null) => void;
}) {
  const [lists, setLists] = useState<Record<Tab, UserResponse[]> | null>(null);

  useEffect(() => {
    if (!tab || !username) return;
    fetchGetFollowUsers(getSession(), encodeURIComponent(username))
      .then((info) =>
        setLists({ following: info.followingUsers ?? [], followers: info.followersUsers ?? [] })
      )
      .catch(() => setLists({ following: [], followers: [] }));
  }, [!!tab, username]);

  const list = (which: Tab, empty: string) => (
    <TabsContent value={which} className="max-h-[50dvh] overflow-y-auto pt-2">
      {lists?.[which].length === 0 && (
        <p className="px-2 py-8 text-center text-sm text-muted-foreground">{empty}</p>
      )}
      {lists?.[which].map((user) => (
        <Link
          key={user.username}
          to={"/profile/" + encodeURIComponent(user.username)}
          onClick={() => onTabChange(null)}
          className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
        >
          <UserAvatar name={user.username} src={user.profileImageUrl ?? ""} className="h-9 w-9" />
          <span className="truncate font-medium">{user.username}</span>
        </Link>
      ))}
    </TabsContent>
  );

  return (
    <Dialog open={!!tab} onOpenChange={(open) => !open && onTabChange(null)}>
      <DialogContent className="gap-2">
        <DialogHeader>
          <DialogTitle>{username}</DialogTitle>
          <DialogDescription className="sr-only">
            People {username} follows, and people following {username}.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={tab ?? "following"} onValueChange={(value) => onTabChange(value as Tab)}>
          <TabsList>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
          </TabsList>
          {list("following", `${username} isn't following anyone yet.`)}
          {list("followers", `Nobody follows ${username} yet.`)}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
