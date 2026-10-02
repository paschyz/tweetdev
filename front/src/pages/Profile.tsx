import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { CalendarDays, KeyRound, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { fetchProfilePosts } from "../api/post";
import { fetchGetUserPrograms } from "../api/programs";
import { deleteSelf, fetchUserInfoByUsername } from "../api/user";
import { fetchGetUserWorkflows } from "../api/workflow";
import { ConfirmDialog } from "../components/DeleteMenu";
import EditPasswordDialog from "../components/EditPasswordDialog";
import EditProfileDialog from "../components/EditProfileDialog";
import { EmptyState, FeedSkeleton } from "../components/FeedItem";
import FollowButton from "../components/FollowButton";
import FollowsDialog from "../components/FollowsDialog";
import { UserAvatar } from "../components/Identity";
import Post from "../components/Post";
import Program from "../components/Program";
import TimelineLayout, { PageHeader } from "../components/TimelineLayout";
import Workflow from "../components/Workflow";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Skeleton } from "../components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { me, useRefreshKey } from "../lib/lookups";
import { Items, without } from "../lib/utils";
import { useAuth } from "../provider/AuthProvider";
import { getSession } from "../services/sessionService";
import { convertTimestampToMonthYear } from "../utils/utils";

function Profile() {
  const { username } = useParams();
  const self = me();
  const isSelf = username === self;
  const refreshKey = useRefreshKey();
  const { logoutAndClearToken } = useAuth();

  const [user, setUser] = useState<UserResponse | null | undefined>(undefined); // null: not found
  const [followers, setFollowers] = useState(0);
  const [posts, setPosts] = useState<Items>(null);
  const [programs, setPrograms] = useState<Items>(null);
  const [workflows, setWorkflows] = useState<Items>(null);
  const [dialog, setDialog] = useState<"edit" | "password" | "delete" | null>(null);
  const [followsTab, setFollowsTab] = useState<"following" | "followers" | null>(null);

  // another profile: back to loading. A refresh (follow, edit) updates in place instead.
  useEffect(() => {
    setUser(undefined);
    setPosts(null);
    setPrograms(null);
    setWorkflows(null);
  }, [username]);

  useEffect(() => {
    if (!username) return;
    const token = getSession();
    fetchUserInfoByUsername(token, username)
      .then((found) => {
        setUser(found);
        setFollowers(found.followers.length);
      })
      .catch(() => setUser(null));
    fetchProfilePosts(token, username)
      .then((list) => setPosts([...list].reverse())) // API returns oldest first
      .catch(() => setPosts([]));
    fetchGetUserPrograms(token, username).then(setPrograms).catch(() => setPrograms([]));
    fetchGetUserWorkflows(token, username).then(setWorkflows).catch(() => setWorkflows([]));
  }, [username, refreshKey]);

  if (!username) return <Navigate to={"/profile/" + encodeURIComponent(self)} replace />;

  const deleteAccount = async () => {
    try {
      await deleteSelf(getSession());
      toast.success("Account deleted");
      logoutAndClearToken();
    } catch {
      toast.error("Couldn't delete your account. Try again.");
    }
  };

  const stat = "rounded hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const nothing = isSelf ? "You haven't" : `${username} hasn't`;

  return (
    <TimelineLayout>
      <PageHeader title={username} back />

      {user === null && (
        <EmptyState title="This account doesn't exist">
          Check the spelling, or it may have been deleted.
        </EmptyState>
      )}

      {user === undefined && (
        <div className="border-b pb-5">
          <Skeleton className="h-36 rounded-none sm:h-48" />
          <div className="space-y-3 px-5 pt-16">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      )}

      {user && (
        <>
          <section className="border-b">
            <div
              className="h-36 bg-secondary bg-cover bg-center sm:h-48"
              style={
                user.backgroundImageUrl
                  ? { backgroundImage: `url("${user.backgroundImageUrl}")` }
                  : undefined
              }
            />
            <div className="px-4 pb-5 sm:px-5">
              <div className="flex items-end justify-between gap-3">
                <UserAvatar
                  name={user.username}
                  src={user.profileImageUrl ?? ""}
                  className="-mt-12 h-24 w-24 border-4 border-background sm:-mt-14 sm:h-28 sm:w-28 [&>span]:text-2xl"
                />
                <div className="flex items-center gap-2 pb-1">
                  {isSelf ? (
                    <>
                      <Button variant="outline" onClick={() => setDialog("edit")}>
                        Edit profile
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" aria-label="Account settings">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setDialog("password")}>
                            <KeyRound />
                            Change password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-400 focus:text-red-400"
                            onSelect={() => setDialog("delete")}
                          >
                            <Trash2 />
                            Delete account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  ) : (
                    <FollowButton
                      kind="user"
                      name={user.username}
                      onChange={(delta) => setFollowers((count) => count + delta)}
                    />
                  )}
                </div>
              </div>

              <h2 className="mt-3 text-2xl font-bold tracking-tight">{user.username}</h2>
              {user.description && (
                <p className="mt-2 max-w-prose whitespace-pre-wrap text-[15px] leading-relaxed">
                  {user.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <button type="button" className={stat} onClick={() => setFollowsTab("following")}>
                  <span className="font-semibold text-foreground">{user.following.length}</span>{" "}
                  Following
                </button>
                <button type="button" className={stat} onClick={() => setFollowsTab("followers")}>
                  <span className="font-semibold text-foreground">{followers}</span>{" "}
                  {followers === 1 ? "Follower" : "Followers"}
                </button>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  Joined {convertTimestampToMonthYear(user.joinDate)}
                </span>
              </div>
            </div>
          </section>

          <Tabs defaultValue="posts">
            <TabsList>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
              {!posts && <FeedSkeleton />}
              {posts?.length === 0 && <EmptyState title={`${nothing} posted yet`} />}
              {posts?.map((post) => (
                <Post
                  key={post._id}
                  postInfo={post}
                  to={"/post/" + post._id}
                  onDeleted={without(setPosts)}
                />
              ))}
            </TabsContent>
            <TabsContent value="programs">
              {!programs && <FeedSkeleton />}
              {programs?.length === 0 && (
                <EmptyState title={`${nothing} shared a program yet`} />
              )}
              {programs?.map((program) => (
                <Program key={program._id} programInfo={program} onDeleted={without(setPrograms)} />
              ))}
            </TabsContent>
            <TabsContent value="workflows">
              {!workflows && <FeedSkeleton />}
              {workflows?.length === 0 && (
                <EmptyState title={`${nothing} built a workflow yet`} />
              )}
              {workflows?.map((workflow) => (
                <Workflow
                  key={workflow._id}
                  programInfo={workflow}
                  onDeleted={without(setWorkflows)}
                />
              ))}
            </TabsContent>
          </Tabs>

          <FollowsDialog username={user.username} tab={followsTab} onTabChange={setFollowsTab} />
          <EditProfileDialog
            user={user}
            open={dialog === "edit"}
            onOpenChange={(open) => setDialog(open ? "edit" : null)}
          />
          <EditPasswordDialog
            open={dialog === "password"}
            onOpenChange={(open) => setDialog(open ? "password" : null)}
          />
          <ConfirmDialog
            open={dialog === "delete"}
            onOpenChange={(open) => setDialog(open ? "delete" : null)}
            title="Delete your account?"
            description="Your profile is removed and you are logged out. This can't be undone."
            confirmLabel="Delete account"
            onConfirm={deleteAccount}
          />
        </>
      )}
    </TimelineLayout>
  );
}

export default Profile;
