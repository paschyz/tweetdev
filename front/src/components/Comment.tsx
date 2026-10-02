import { useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteComment, getIsCommentDeletable } from "@/api/comment";
import { DeleteMenu } from "@/components/DeleteMenu";
import { FeedItem, ItemHeader } from "@/components/FeedItem";
import { Markdown } from "@/components/Markdown";
import { getSession } from "@/services/sessionService";

export default function Comment({
  programInfo,
  onDeleted,
}: {
  programInfo: any;
  onDeleted?: (id: string) => void;
}) {
  const [deletable, setDeletable] = useState(false);

  useEffect(() => {
    getIsCommentDeletable(getSession(), programInfo._id)
      .then((can) => setDeletable(!!can))
      .catch(() => {});
  }, [programInfo._id]);

  const remove = async () => {
    try {
      await deleteComment(getSession(), programInfo._id);
      toast.success("Comment deleted");
      onDeleted?.(programInfo._id);
    } catch {
      toast.error("Couldn't delete the comment. Try again.");
    }
  };

  return (
    <FeedItem>
      <ItemHeader
        username={programInfo.username}
        date={programInfo.creationDate}
        menu={deletable && <DeleteMenu what="comment" onDelete={remove} />}
      />
      <div className="mt-2 sm:pl-[52px]">
        <Markdown source={programInfo.description} />
      </div>
    </FeedItem>
  );
}
