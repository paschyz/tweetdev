import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CalendarDays, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deleteHubByName,
  fetchHubByName,
  fetchHubPosts,
  fetchIsAdminHub,
} from "../api/hub";
import { ConfirmDialog } from "../components/DeleteMenu";
import { EmptyState, FeedSkeleton } from "../components/FeedItem";
import FollowButton from "../components/FollowButton";
import HubFormDialog from "../components/HubFormDialog";
import { HubIcon } from "../components/Identity";
import Post from "../components/Post";
import TimelineLayout, { PageHeader } from "../components/TimelineLayout";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Skeleton } from "../components/ui/skeleton";
import { IHub } from "../interfaces/IHub";
import { refresh, useRefreshKey } from "../lib/lookups";
import { Items, without } from "../lib/utils";
import { getSession } from "../services/sessionService";
import { convertTimestampToMonthYear } from "../utils/utils";

function Hub() {
  const { name } = useParams();
  const navigate = useNavigate();
  const refreshKey = useRefreshKey();
  const [hub, setHub] = useState<IHub | null | undefined>(undefined); // null: not found
  const [posts, setPosts] = useState<Items>(null);
  const [followers, setFollowers] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dialog, setDialog] = useState<"edit" | "delete" | null>(null);

  // another hub: back to loading. A refresh (follow, edit) updates in place instead.
  useEffect(() => {
    setHub(undefined);
    setPosts(null);
    setIsAdmin(false);
  }, [name]);

  useEffect(() => {
    const token = getSession();
    const encoded = encodeURIComponent(name); // these endpoints build their own query string
    fetchHubByName(token, encoded)
      .then((found) => {
        setHub(found || null);
        setFollowers(found?.users?.length ?? 0);
      })
      .catch(() => setHub(null));
    fetchHubPosts(token, encoded).then(setPosts).catch(() => setPosts([]));
    fetchIsAdminHub(token, encoded)
      .then((admin) => setIsAdmin(!!admin))
      .catch(() => setIsAdmin(false));
  }, [name, refreshKey]);

  const deleteHub = async () => {
    try {
      await deleteHubByName(getSession(), encodeURIComponent(name));
      toast.success("Hub deleted");
      refresh();
      navigate("/");
    } catch {
      toast.error("Couldn't delete the hub. Try again.");
    }
  };

  const owner = hub?.admins?.[0];

  return (
    <TimelineLayout>
      <PageHeader title={name} back />

      {hub === null && (
        <EmptyState title="This hub doesn't exist">
          Check the spelling, or it may have been deleted.
        </EmptyState>
      )}

      {hub === undefined && (
        <div className="border-b pb-5">
          <Skeleton className="h-36 rounded-none sm:h-48" />
          <div className="space-y-3 px-5 pt-16">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      )}

      {hub && (
        <>
          <section className="border-b">
            <div
              className="h-36 bg-secondary bg-cover bg-center sm:h-48"
              style={hub.coverImageUrl ? { backgroundImage: `url("${hub.coverImageUrl}")` } : undefined}
            />
            <div className="px-4 pb-5 sm:px-5">
              <div className="flex items-end justify-between gap-3">
                <HubIcon
                  name={hub.name}
                  src={hub.profileImageUrl ?? ""}
                  className="-mt-12 h-24 w-24 rounded-2xl border-4 border-background sm:-mt-14 sm:h-28 sm:w-28 [&>span]:text-2xl"
                />
                <div className="flex items-center gap-2 pb-1">
                  <FollowButton
                    kind="hub"
                    name={hub.name}
                    onChange={(delta) => setFollowers((count) => count + delta)}
                  />
                  {isAdmin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" aria-label="Hub settings">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setDialog("edit")}>
                          <Pencil />
                          Edit hub
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-400 focus:text-red-400"
                          onSelect={() => setDialog("delete")}
                        >
                          <Trash2 />
                          Delete hub
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>

              <h2 className="mt-3 text-2xl font-bold tracking-tight">{hub.name}</h2>
              {hub.description && (
                <p className="mt-2 max-w-prose whitespace-pre-wrap text-[15px] leading-relaxed">
                  {hub.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <span>
                  <span className="font-semibold text-foreground">{followers}</span>{" "}
                  {followers === 1 ? "Member" : "Members"}
                </span>
                {owner && (
                  <span>
                    Run by{" "}
                    <Link
                      to={"/profile/" + encodeURIComponent(owner)}
                      className="font-medium text-foreground hover:underline"
                    >
                      {owner}
                    </Link>
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  Created {convertTimestampToMonthYear(hub.creationDate)}
                </span>
              </div>
            </div>
          </section>

          {!posts && <FeedSkeleton />}
          {posts?.length === 0 && (
            <EmptyState title="Nothing posted here yet">
              Follow the hub, then pick it under "Post in" when you{" "}
              <Link
                to="/create-post"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
              >
                write a post
              </Link>
              .
            </EmptyState>
          )}
          {posts?.map((post) => (
            <Post
              key={post._id}
              postInfo={post}
              to={"/post/" + post._id}
              onDeleted={without(setPosts)}
            />
          ))}

          <HubFormDialog
            hub={hub}
            open={dialog === "edit"}
            onOpenChange={(open) => setDialog(open ? "edit" : null)}
          />
          <ConfirmDialog
            open={dialog === "delete"}
            onOpenChange={(open) => setDialog(open ? "delete" : null)}
            title={`Delete ${hub.name}?`}
            description="The hub is removed for everyone who follows it. This can't be undone."
            confirmLabel="Delete hub"
            onConfirm={deleteHub}
          />
        </>
      )}
    </TimelineLayout>
  );
}

export default Hub;
