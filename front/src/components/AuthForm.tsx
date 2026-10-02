import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Wordmark } from "@/components/AppSidebar";
import { Field } from "@/components/Field";
import { CodeBlock } from "@/components/Markdown";
import { PipelineStrip } from "@/components/Workflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileTypes, LanguageTag } from "@/components/workflow/nodes";
import { CODE_SNIPPETS } from "@/constants";
import { passwordProblem } from "@/utils/utils";

const sampleFlow = {
  nodes: [
    { id: "run", type: "run-node", data: { label: "Run" } },
    { id: "code", type: "code-node", data: { label: "greet.py", codeData: { language: "python" } } },
    { id: "finish", type: "finish-node", data: { label: "Finish" } },
  ],
  edges: [
    { source: "run", target: "code" },
    { source: "code", target: "finish" },
  ],
};

/** What the product does, shown with the product's own parts: a program, its output, a workflow. */
function Showcase() {
  return (
    <div className="hidden flex-col justify-center border-l bg-card px-12 py-10 lg:flex xl:px-20">
      <h2 className="max-w-lg text-balance text-5xl font-extrabold leading-[1.05] tracking-tight">
        Post code that runs.
      </h2>
      <p className="mt-5 max-w-md text-lg text-muted-foreground">
        Share a program, run it in Python or JavaScript right on the page, then
        chain programs into a workflow.
      </p>

      <div className="mt-10 max-w-md overflow-hidden rounded-xl border bg-background shadow-2xl">
        <div className="flex items-center gap-2.5 border-b px-4 py-2.5">
          <LanguageTag language="python" />
          <span className="text-sm font-medium">greet.py</span>
          <span className="ml-auto">
            <FileTypes />
          </span>
        </div>
        <div className="px-4 py-3 [&_pre]:!border-0 [&_pre]:!bg-transparent [&_pre]:!p-0">
          <CodeBlock code={CODE_SNIPPETS.python} language="python" />
        </div>
        <div className="border-t bg-well px-4 py-3 font-mono text-[13px]">
          <p className="mb-1 font-sans text-xs text-muted-foreground">Output</p>
          <span className="text-success">Hello, Alex!</span>
          <span className="cursor-blink ml-0.5 text-primary" aria-hidden>
            ▍
          </span>
        </div>
      </div>

      <div className="mt-6 max-w-md">
        <PipelineStrip flow={sampleFlow} />
      </div>
    </div>
  );
}

function AuthForm({
  title,
  buttonText,
  onSubmit,
  isSignup,
}: {
  title: string;
  buttonText: string;
  onSubmit: (formData: any) => Promise<void> | void;
  isSignup: boolean;
}) {
  const [formData, setFormData] = useState({ login: "", password: "", username: "" });
  const [passwordError, setPasswordError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const problem = passwordProblem(formData.password);
    setPasswordError(problem);
    if (problem) return;
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-6 py-6 sm:px-10">
        <Wordmark />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground lg:hidden">
            Post code that runs, in Python or JavaScript.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            <Field label="Email">
              <Input
                name="login"
                inputMode="email"
                autoComplete="username"
                autoCapitalize="none"
                value={formData.login}
                onChange={handleChange}
                required
                autoFocus
              />
            </Field>
            {isSignup && (
              <Field label="Username" hint="Shown on everything you post.">
                <Input
                  name="username"
                  autoComplete="nickname"
                  autoCapitalize="none"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  maxLength={40}
                />
              </Field>
            )}
            <Field
              label="Password"
              hint={isSignup ? "At least 8 characters, no spaces." : undefined}
              error={passwordError}
            >
              <Input
                name="password"
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Field>
            <Button type="submit" size="lg" className="mt-2" disabled={submitting}>
              {buttonText}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            {isSignup ? "Already have an account? " : "New to tweetdev? "}
            <Link
              to={isSignup ? "/login" : "/signup"}
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
            >
              {isSignup ? "Log in" : "Create an account"}
            </Link>
          </p>
        </div>
      </div>
      <Showcase />
    </div>
  );
}

export default AuthForm;
