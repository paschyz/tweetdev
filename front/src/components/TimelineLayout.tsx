import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { fetchHubs } from "@/api/hub";
import { HubTile } from "@/components/HubTile";
import { HubIcon } from "@/components/Identity";
import { Button } from "@/components/ui/button";
import { IHub } from "@/interfaces/IHub";
import { useRefreshKey } from "@/lib/lookups";
import { getSession } from "@/services/sessionService";

/** Sticky title bar of a timeline page. `back` adds a back button. */
export function PageHeader({ title, back = false }: { title: string; back?: boolean }) {
  const navigate = useNavigate();
  return (
    <div className="sticky top-14 z-30 flex h-14 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur lg:top-0">
      {back && (
        <Button variant="ghost" size="icon" className="-ml-2" aria-label="Back" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
      )}
      <h1 className="truncate text-lg font-bold">{title}</h1>
    </div>
  );
}

/**
 * The reading column used by feed, profile, hub and post pages, with every hub in a rail beside it.
 * Below xl there is no room for the rail; `hubStrip` shows the hubs as a scrolling row instead.
 */
export default function TimelineLayout({
  children,
  hubStrip = false,
}: {
  children: React.ReactNode;
  hubStrip?: boolean;
}) {
  const refreshKey = useRefreshKey();
  const [hubs, setHubs] = useState<IHub[]>([]);

  useEffect(() => {
    fetchHubs(getSession()).then(setHubs).catch(() => {});
  }, [refreshKey]);

  return (
    <div className="mx-auto flex w-full max-w-[1040px] justify-center xl:justify-start">
      <div className="min-h-[calc(100dvh-3.5rem)] w-full min-w-0 max-w-[680px] sm:border-x lg:min-h-dvh">
        {hubStrip && hubs.length > 0 && (
          <div className="flex gap-2 overflow-x-auto border-b px-4 py-3 xl:hidden">
            {hubs.map((hub) => (
              <Link
                key={hub._id}
                to={"/hub/" + encodeURIComponent(hub.name)}
                className="flex shrink-0 items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                <HubIcon name={hub.name} src={hub.profileImageUrl ?? ""} className="h-6 w-6 rounded-full" />
                {hub.name}
              </Link>
            ))}
          </div>
        )}
        {children}
      </div>

      <aside className="sticky top-0 hidden h-dvh w-[320px] shrink-0 overflow-y-auto px-6 py-5 xl:block">
        <h2 className="mb-3 font-bold">Hubs</h2>
        {hubs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hubs yet. Create the first one from the sidebar.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {hubs.map((hub) => (
              <HubTile key={hub._id} hub={hub} />
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
