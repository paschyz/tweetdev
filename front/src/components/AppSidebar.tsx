import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ChevronsUpDown,
  Code2,
  Home,
  LogOut,
  PenLine,
  Plus,
  User,
  Workflow,
} from "lucide-react";
import { fetchGetFollowing, fetchUserHubs } from "@/api/user";
import HubFormDialog from "@/components/HubFormDialog";
import { HubIcon, UserAvatar } from "@/components/Identity";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IHub } from "@/interfaces/IHub";
import { me, useRefreshKey } from "@/lib/lookups";
import { cn } from "@/lib/utils";
import { getSession } from "@/services/sessionService";

export function Wordmark() {
  return (
    <Link to="/" className="font-mono text-lg font-bold tracking-tight">
      tweetdev<span className="text-primary">_</span>
    </Link>
  );
}

const item =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const followed =
  "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const groupLabel = "px-3 pb-1 pt-4 text-xs font-medium text-muted-foreground";

/** Navigation, what you follow, and your account. Left column on desktop, a sheet on mobile. */
export default function AppSidebar() {
  const username = me();
  const profile = "/profile/" + encodeURIComponent(username);
  const refreshKey = useRefreshKey();
  const [hubs, setHubs] = useState<IHub[]>([]);
  const [people, setPeople] = useState<UserResponse[]>([]);
  const [creatingHub, setCreatingHub] = useState(false);

  useEffect(() => {
    const token = getSession();
    fetchUserHubs(token).then(setHubs).catch(() => {});
    fetchGetFollowing(token).then(setPeople).catch(() => {});
  }, [refreshKey]);

  const nav = [
    { to: "/", label: "Feed", icon: Home, end: true },
    { to: "/program", label: "New program", icon: Code2, end: true },
    { to: "/workflow", label: "Workflows", icon: Workflow, end: false },
    { to: profile, label: "Profile", icon: User, end: true },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="px-6 pb-2 pt-5">
        <Wordmark />
      </div>

      <nav className="flex flex-col gap-0.5 px-3 pt-2" aria-label="Main">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(item, isActive && "bg-accent font-semibold text-foreground")
            }
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </NavLink>
        ))}
        <Button asChild className="mt-3">
          <Link to="/create-post">
            <PenLine />
            New post
          </Link>
        </Button>
      </nav>

      <div className="mt-2 min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        <p className={groupLabel}>Hubs you follow</p>
        {hubs.map((hub) => (
          <Link key={hub._id} to={"/hub/" + encodeURIComponent(hub.name)} className={followed}>
            <HubIcon name={hub.name} src={hub.profileImageUrl ?? ""} className="h-6 w-6 rounded-md" />
            <span className="truncate">{hub.name}</span>
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setCreatingHub(true)}
          className={cn(followed, "w-full text-muted-foreground hover:text-foreground")}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md border border-dashed">
            <Plus className="h-3.5 w-3.5" />
          </span>
          Create a hub
        </button>

        <p className={groupLabel}>People you follow</p>
        {people.length === 0 && (
          <p className="px-3 py-1.5 text-sm text-muted-foreground">
            Follow someone and they show up here.
          </p>
        )}
        {people.map((user) => (
          <Link
            key={user.username}
            to={"/profile/" + encodeURIComponent(user.username)}
            className={followed}
          >
            <UserAvatar name={user.username} src={user.profileImageUrl ?? ""} className="h-6 w-6" />
            <span className="truncate">{user.username}</span>
          </Link>
        ))}
      </div>

      <div className="border-t p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <UserAvatar name={username} className="h-9 w-9" key={refreshKey} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{username}</span>
                <span className="block text-xs text-muted-foreground">Your account</span>
              </span>
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            className="w-[--radix-dropdown-menu-trigger-width]"
          >
            <DropdownMenuItem asChild>
              <Link to={profile}>
                <User />
                View profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/logout">
                <LogOut />
                Log out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <HubFormDialog open={creatingHub} onOpenChange={setCreatingHub} />
    </div>
  );
}
