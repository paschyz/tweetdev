import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { hubIcon, userAvatar } from "@/lib/lookups";
import { cn } from "@/lib/utils";

type Props = { name: string; src?: string; className?: string };

// `src` known (profile header, lists that already carry the URL) → used as is; otherwise looked up by name.
const useImage = (
  name: string,
  src: string | undefined,
  lookup: (name: string) => Promise<string | undefined>
) => {
  const [url, setUrl] = useState(src);
  useEffect(() => {
    if (src !== undefined || !name) return setUrl(src);
    let live = true;
    lookup(name).then((found) => live && setUrl(found));
    return () => {
      live = false;
    };
  }, [name, src]);
  return url;
};

export function UserAvatar({ name, src, className }: Props) {
  const url = useImage(name, src, userAvatar);
  return (
    <Avatar className={className}>
      <AvatarImage src={url || undefined} alt="" className="object-cover" />
      <AvatarFallback className="bg-secondary text-xs font-semibold uppercase">
        {name?.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}

/** Hubs are squares, people are circles. */
export function HubIcon({ name, src, className }: Props) {
  const url = useImage(name, src, hubIcon);
  return (
    <Avatar className={cn("rounded-lg bg-secondary", className)}>
      <AvatarImage src={url || undefined} alt="" className="object-cover" />
      <AvatarFallback className="rounded-[inherit] bg-secondary text-xs font-semibold uppercase">
        {name?.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}
