import { useState } from "react";
import { Heart, SmilePlus } from "lucide-react";
import { toast } from "sonner";
import { patchToggleLikePost } from "@/api/post";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { me } from "@/lib/lookups";
import { cn } from "@/lib/utils";
import { getSession } from "@/services/sessionService";

// index = the emojiIndex stored with each like
const REACTIONS = ["❤️", "👏", "🔥", "🤯", "😂", "🥵", "🥶", "😭", "🤮", "💩"];

type Likeable = { _id: string; like?: { username: string; emojiIndex: number }[] };

/** Works for posts, programs and workflows: the API resolves the id across all three. */
export default function LikeButton({ item }: { item: Likeable }) {
  const mine = item.like?.find((like) => like.username === me());
  const [liked, setLiked] = useState(!!mine);
  const [reaction, setReaction] = useState(mine?.emojiIndex ?? 0);
  const [count, setCount] = useState(item.like?.length ?? 0);
  const [picking, setPicking] = useState(false);

  // the API toggles: reacting while liked removes the like, whatever the emoji
  const toggle = async (index: number) => {
    setPicking(false);
    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    if (next) setReaction(index);
    try {
      await patchToggleLikePost(getSession(), {
        post_id: item._id,
        emojiIndex: index,
      });
    } catch {
      setLiked(!next);
      setCount((c) => c + (next ? -1 : 1));
      toast.error("Couldn't save your reaction. Try again.");
    }
  };

  const pill =
    "flex h-8 items-center gap-1.5 text-sm tabular-nums transition-[color,background-color,transform] duration-150 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border text-muted-foreground",
        liked && "border-primary/40 bg-primary/10 text-primary"
      )}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        aria-pressed={liked}
        aria-label={liked ? "Remove your reaction" : "Like"}
        onClick={() => toggle(liked ? reaction : 0)}
        className={cn(
          pill,
          "rounded-l-full pl-3 hover:text-foreground",
          liked ? "rounded-r-full pr-3 hover:text-primary" : "pr-2"
        )}
      >
        {liked ? (
          <span className="text-base leading-none">{REACTIONS[reaction]}</span>
        ) : (
          <Heart className="h-4 w-4" />
        )}
        {count}
      </button>
      {!liked && (
        <Popover open={picking} onOpenChange={setPicking}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="React with an emoji"
              className={cn(pill, "rounded-r-full border-l pl-2 pr-2.5 hover:text-foreground")}
            >
              <SmilePlus className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="start"
            className="grid w-auto grid-cols-5 gap-0.5 p-1.5 sm:grid-cols-10"
          >
            {REACTIONS.map((emoji, index) => (
              <button
                key={emoji}
                type="button"
                onClick={() => toggle(index)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-xl transition-transform duration-150 ease-out hover:scale-125 hover:bg-accent focus-visible:bg-accent focus-visible:outline-none active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
