import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { HubIcon, UserAvatar } from "@/components/Identity";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { convertTimeToPostTime } from "@/utils/utils";

/** One row of a timeline. With `to`, the whole row opens that page; links and buttons inside keep working. */
export function FeedItem({
  to,
  children,
}: {
  to?: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  if (!to) return <article className="border-b px-4 py-4 sm:px-5">{children}</article>;

  const open = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    if (window.getSelection()?.toString()) return; // selecting text is not a click
    navigate(to);
  };
  return (
    <article
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target === e.currentTarget) navigate(to);
      }}
      className={cn(
        "cursor-pointer border-b px-4 py-4 transition-colors sm:px-5",
        "hover:bg-accent/40 focus-visible:bg-accent/40 focus-visible:outline-none"
      )}
    >
      {children}
    </article>
  );
}

/** Who posted it, where, and when. `menu` sits on the right. */
export function ItemHeader({
  username,
  hubname,
  date,
  menu,
}: {
  username: string;
  hubname?: string;
  date: string;
  menu?: React.ReactNode;
}) {
  const profile = `/profile/${encodeURIComponent(username)}`;
  return (
    <div className="flex items-start gap-3">
      <Link to={profile} className="shrink-0 rounded-full" tabIndex={-1} aria-hidden>
        <UserAvatar name={username} className="h-10 w-10" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-1.5 text-[15px] leading-5">
          <Link to={profile} className="truncate font-semibold hover:underline">
            {username}
          </Link>
          {hubname && (
            <>
              <span className="text-muted-foreground">in</span>
              <Link
                to={`/hub/${encodeURIComponent(hubname)}`}
                className="inline-flex items-center gap-1.5 font-medium hover:underline"
              >
                <HubIcon name={hubname} className="h-4 w-4 rounded" />
                {hubname}
              </Link>
            </>
          )}
        </div>
        <time className="text-[13px] text-muted-foreground">
          {convertTimeToPostTime(date)}
        </time>
      </div>
      {menu}
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      {[72, 40, 56].map((height) => (
        <div key={height} className="flex gap-3 border-b px-4 py-4 sm:px-5">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="w-full" style={{ height }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <p className="text-lg font-semibold">{title}</p>
      {children && (
        <div className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          {children}
        </div>
      )}
    </div>
  );
}
