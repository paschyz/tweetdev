import { Link } from "react-router-dom";
import { HubIcon } from "@/components/Identity";

const members = (count: number) =>
  `${new Intl.NumberFormat("en", { notation: "compact" }).format(count)} ${
    count === 1 ? "member" : "members"
  }`;

/** A hub as its banner with the icon and name on top. Without `link` it is a plain preview. */
export function HubTile({
  hub,
  link = true,
}: {
  hub: { name: string; profileImageUrl?: string; coverImageUrl?: string; users?: string[] };
  link?: boolean;
}) {
  const body = (
    <>
      <div
        className="absolute inset-0 bg-secondary bg-cover bg-center opacity-70 transition-opacity duration-200 group-hover:opacity-100"
        style={hub.coverImageUrl ? { backgroundImage: `url("${hub.coverImageUrl}")` } : undefined}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
      <div className="relative flex h-full items-end gap-3 p-3">
        <HubIcon name={hub.name} src={hub.profileImageUrl ?? ""} className="h-10 w-10" />
        <div className="min-w-0">
          <p className="truncate font-semibold leading-5">{hub.name || "Hub name"}</p>
          <p className="text-xs text-muted-foreground">{members(hub.users?.length ?? 1)}</p>
        </div>
      </div>
    </>
  );
  const className = "group relative block h-24 overflow-hidden rounded-xl border";
  return link ? (
    <Link to={"/hub/" + encodeURIComponent(hub.name)} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
