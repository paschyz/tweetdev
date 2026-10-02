import React, { useEffect, useState } from "react";
import Favorites from "../components/Favorites";
import { getSession } from "../services/sessionService";
import { useParams } from "react-router-dom";
import { fetchGetComments, fetchPostById } from "../api/post"; // Ensure you have the postComment function
import { IPost } from "../interfaces";
import Post from "../components/Post";
import Comment from "../components/Comment";
import { createComment } from "../api/comment";

function DetailsPost() {
  const { id } = useParams<{ id: string }>();
  const [notFoundPost, setNotFoundPost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<IPost>({
    authorName: "",
    content: "",
    like: [],
    comments: [],
    creationDate: "",
    username: "",
    hubname: undefined,
  });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(""); // State to manage new comment text
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionToken = getSession();
        if (sessionToken && id) {
          const postData = await fetchPostById(sessionToken, id);
          if (postData) {
            setPost(postData);
            setLoading(false);
          } else {
            setNotFoundPost(true);
            setLoading(false);
          }
        }
      } catch (error) {
        setNotFoundPost(true);
        setLoading(false);
        console.error("Error fetching post:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const sessionToken = getSession();
        if (sessionToken && id) {
          const comments = await fetchGetComments(sessionToken, id);
          // loading is cleared by fetchData only: clearing it here mounted <Post>
          // with the empty placeholder whenever comments arrived first
          if (comments) {
            setComments(comments);
          }
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
    fetchData();
  }, [id]);

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const sessionToken = getSession();
      if (sessionToken && id) {
        const commentCreate = {
          postId: id,
          description: newComment,
        };
        const result = await createComment(sessionToken, commentCreate);
        if (result) {
          setComments((prevComments: any[]) => [...prevComments, result]);
          setNewComment("");
        }
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="profile-container grid grid-cols-[1fr_3.5fr] gap-4 p-12 mt-6">
      <div className="hidden lg:block">
        <Favorites />
      </div>
      <div className="profile-card rounded-xl mr-6 col-span-2 lg:col-span-1">
        {loading ? (
          <p>Loading...</p>
        ) : notFoundPost ? (
          <p>This post doesn’t exist</p>
        ) : (
          <Post postInfo={post} />
        )}

        <form
          onSubmit={handleCommentSubmit}
          className="pt-4 mr-12 text-sm font-medium "
        >
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Write a comment..."
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        {/* Comments Section */}
        <div className="pt-2 flex flex-col gap-1 mr-12">
          {comments.map((comment: any, key) => (
            <Comment key={key} programInfo={comment} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DetailsPost;
