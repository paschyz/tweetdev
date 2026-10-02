import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, SquareTerminal } from "lucide-react";
import { toast } from "sonner";
import {
  deletePostById,
  fetchGetComments,
  getIsPostDeletable,
} from "@/api/post";
import { fetchProgramById } from "@/api/programs";
import { DeleteMenu } from "@/components/DeleteMenu";
import { FeedItem, ItemHeader } from "@/components/FeedItem";
import LikeButton from "@/components/LikeButton";
import { CodeBlock, Markdown } from "@/components/Markdown";
import { LanguageTag } from "@/components/workflow/nodes";
import { getSession } from "@/services/sessionService";

/**
 * `to` makes the whole post open its page (feeds); leave it out on the post page itself.
 * `commentCount` is passed by the post page, which already has the comments.
 */
function Post({
  postInfo,
  to,
  commentCount,
  onDeleted,
}: {
  postInfo: any;
  to?: string;
  commentCount?: number;
  onDeleted?: (id: string) => void;
}) {
  const [deletable, setDeletable] = useState(false);
  const [program, setProgram] = useState<any>(null);
  const [fetchedCount, setFetchedCount] = useState<number | null>(null);
  const comments = commentCount ?? fetchedCount;

  useEffect(() => {
    const token = getSession();
    let live = true;
    getIsPostDeletable(token, postInfo._id)
      .then((can) => live && setDeletable(!!can))
      .catch(() => {});
    if (commentCount === undefined) {
      fetchGetComments(token, postInfo._id)
        .then((list) => live && setFetchedCount(list?.length ?? 0))
        .catch(() => {});
    }
    if (postInfo.program) {
      fetchProgramById(token, postInfo.program)
        .then((found) => live && setProgram(found))
        .catch(() => {});
    }
    return () => {
      live = false;
    };
  }, [postInfo._id]);

  const remove = async () => {
    try {
      await deletePostById(getSession(), postInfo._id);
      toast.success("Post deleted");
      onDeleted?.(postInfo._id);
    } catch {
      toast.error("Couldn't delete the post. Try again.");
    }
  };

  return (
    <FeedItem to={to}>
      <ItemHeader
        username={postInfo.username}
        hubname={postInfo.hubname}
        date={postInfo.creationDate}
        menu={deletable && <DeleteMenu what="post" onDelete={remove} />}
      />
      <div className="mt-3 sm:pl-[52px]">
        <Markdown source={postInfo.content} />

        {program && (
          <div className="mt-3">
            <CodeBlock code={program.content} language={program.language} clamp={!!to} />
            <Link
              to={"/program/" + postInfo.program}
              className="mt-2 inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              <LanguageTag language={program.language} />
              {program.name}
              <SquareTerminal className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Open in the editor</span>
            </Link>
          </div>
        )}

        <div className="mt-4 flex items-center gap-4">
          <LikeButton item={postInfo} />
          <span className="inline-flex items-center gap-1.5 text-sm tabular-nums text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            {comments ?? ""}
            <span className="sr-only">comments</span>
          </span>
        </div>
      </div>
    </FeedItem>
  );
}

export default Post;
