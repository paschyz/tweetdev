import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { createComment } from "../api/comment";
import { fetchGetComments, fetchPostById } from "../api/post";
import Comment from "../components/Comment";
import { EmptyState, FeedSkeleton } from "../components/FeedItem";
import { UserAvatar } from "../components/Identity";
import Post from "../components/Post";
import TimelineLayout, { PageHeader } from "../components/TimelineLayout";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { me } from "../lib/lookups";
import { getSession } from "../services/sessionService";

function DetailsPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(undefined); // undefined: loading, null: not found
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = getSession();
    setPost(undefined);
    fetchPostById(token, id)
      .then((found) => setPost(found || null))
      .catch(() => setPost(null));
    fetchGetComments(token, id)
      .then((list) => setComments(list ?? []))
      .catch(() => setComments([]));
  }, [id]);

  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const created = await createComment(getSession(), {
        postId: id,
        description: newComment,
      });
      setComments((previous) => [...previous, created]);
      setNewComment("");
    } catch {
      toast.error("Couldn't post your comment. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <TimelineLayout>
      <PageHeader title="Post" back />
      {post === undefined && <FeedSkeleton />}
      {post === null && (
        <EmptyState title="This post doesn't exist">
          It may have been deleted by its author.
        </EmptyState>
      )}
      {post && (
        <>
          <Post postInfo={post} commentCount={comments.length} onDeleted={() => navigate("/")} />

          <form onSubmit={handleCommentSubmit} className="flex gap-3 border-b px-4 py-4 sm:px-5">
            <UserAvatar name={me()} className="hidden h-10 w-10 sm:flex" />
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment. Markdown works."
                aria-label="Your comment"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <Button type="submit" disabled={submitting || !newComment.trim()}>
                  Comment
                </Button>
              </div>
            </div>
          </form>

          {comments.map((comment) => (
            <Comment
              key={comment._id}
              programInfo={comment}
              onDeleted={(removed) =>
                setComments((list) => list.filter((c) => c._id !== removed))
              }
            />
          ))}
        </>
      )}
    </TimelineLayout>
  );
}

export default DetailsPost;
