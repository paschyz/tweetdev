import { useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteProgram, getIsProgramDeletable } from "@/api/programs";
import { DeleteMenu } from "@/components/DeleteMenu";
import { FeedItem, ItemHeader } from "@/components/FeedItem";
import LikeButton from "@/components/LikeButton";
import { CodeBlock } from "@/components/Markdown";
import { FileTypes, LanguageTag } from "@/components/workflow/nodes";
import { getSession } from "@/services/sessionService";

export default function Program({
  programInfo,
  onDeleted,
}: {
  programInfo: any;
  onDeleted?: (id: string) => void;
}) {
  const [deletable, setDeletable] = useState(false);

  useEffect(() => {
    getIsProgramDeletable(getSession(), programInfo._id)
      .then((can) => setDeletable(!!can))
      .catch(() => {});
  }, [programInfo._id]);

  const remove = async () => {
    try {
      await deleteProgram(getSession(), programInfo._id);
      toast.success("Program deleted");
      onDeleted?.(programInfo._id);
    } catch {
      toast.error("Couldn't delete the program. Try again.");
    }
  };

  return (
    <FeedItem to={"/program/" + programInfo._id}>
      <ItemHeader
        username={programInfo.username}
        date={programInfo.creationDate}
        menu={deletable && <DeleteMenu what="program" onDelete={remove} />}
      />
      <div className="mt-3 sm:pl-[52px]">
        <div className="mb-2 flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <LanguageTag language={programInfo.language} />
          <h2 className="font-semibold">{programInfo.name}</h2>
          <FileTypes
            input={programInfo.inputFileType}
            output={programInfo.outputFileType}
          />
        </div>
        <CodeBlock code={programInfo.content} language={programInfo.language} clamp />
        <div className="mt-4">
          <LikeButton item={programInfo} />
        </div>
      </div>
    </FeedItem>
  );
}
