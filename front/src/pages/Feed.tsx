import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPosts } from "../api/post";
import { fetchPrograms } from "../api/programs";
import { fetchWorkflows } from "../api/workflow";
import { EmptyState, FeedSkeleton } from "../components/FeedItem";
import Post from "../components/Post";
import Program from "../components/Program";
import TimelineLayout from "../components/TimelineLayout";
import Workflow from "../components/Workflow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Items, without } from "../lib/utils";
import { getSession } from "../services/sessionService";

const Feed = () => {
  const [posts, setPosts] = useState<Items>(null);
  const [programs, setPrograms] = useState<Items>(null);
  const [workflows, setWorkflows] = useState<Items>(null);

  useEffect(() => {
    const token = getSession();
    fetchPosts(token, true).then(setPosts).catch(() => setPosts([]));
    fetchPrograms(token).then(setPrograms).catch(() => setPrograms([]));
    fetchWorkflows(token).then(setWorkflows).catch(() => setWorkflows([]));
  }, []);

  const link = "font-medium text-foreground underline underline-offset-4 hover:text-primary";

  return (
    <TimelineLayout hubStrip>
      <Tabs defaultValue="posts">
        <TabsList className="sticky top-14 z-30 bg-background/85 backdrop-blur lg:top-0">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          {!posts && <FeedSkeleton />}
          {posts?.length === 0 && (
            <EmptyState title="No posts yet">
              Be the first: <Link to="/create-post" className={link}>write a post</Link>.
            </EmptyState>
          )}
          {posts?.map((post) => (
            <Post
              key={post._id}
              postInfo={post}
              to={"/post/" + post._id}
              onDeleted={without(setPosts)}
            />
          ))}
        </TabsContent>

        <TabsContent value="programs">
          {!programs && <FeedSkeleton />}
          {programs?.length === 0 && (
            <EmptyState title="No programs yet">
              Programs are snippets anyone can run.{" "}
              <Link to="/program" className={link}>Create a program</Link>.
            </EmptyState>
          )}
          {programs?.map((program) => (
            <Program key={program._id} programInfo={program} onDeleted={without(setPrograms)} />
          ))}
        </TabsContent>

        <TabsContent value="workflows">
          {!workflows && <FeedSkeleton />}
          {workflows?.length === 0 && (
            <EmptyState title="No workflows yet">
              A workflow runs programs one after another.{" "}
              <Link to="/workflow" className={link}>Build a workflow</Link>.
            </EmptyState>
          )}
          {workflows?.map((workflow) => (
            <Workflow key={workflow._id} programInfo={workflow} onDeleted={without(setWorkflows)} />
          ))}
        </TabsContent>
      </Tabs>
    </TimelineLayout>
  );
};

export default Feed;
