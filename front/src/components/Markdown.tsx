import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";

// Posts and comments are written by anyone: raw HTML in them is stripped down to safe tags.
export const safeMarkdown = [rehypeSanitize];

export function Markdown({ source }: { source: string }) {
  return <MDEditor.Markdown source={source} rehypePlugins={safeMarkdown} />;
}

const PREVIEW_LINES = 14;

/** Highlighted code. `clamp` keeps feed previews short and says how much is left. */
export function CodeBlock({
  code = "",
  language,
  clamp = false,
}: {
  code: string;
  language: string;
  clamp?: boolean;
}) {
  const lines = code.replace(/^\n+|\s+$/g, "").split("\n");
  const hidden = clamp ? Math.max(0, lines.length - PREVIEW_LINES) : 0;
  const shown = hidden ? lines.slice(0, PREVIEW_LINES) : lines;
  const lang = language === "python" ? "python" : "js";
  return (
    <div>
      {/* four backticks: the code itself may contain a ``` fence */}
      <Markdown source={`\`\`\`\`${lang}\n${shown.join("\n")}\n\`\`\`\``} />
      {hidden > 0 && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          {hidden} more {hidden === 1 ? "line" : "lines"}
        </p>
      )}
    </div>
  );
}
