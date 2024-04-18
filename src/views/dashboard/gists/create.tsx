"use client";

import { Stack, Typography } from "@/components";
import { useEffect, useState } from "react";
import CreateGistForm from "@/sections/gists/create/create-gist-form";
import { useGetGists } from "@/services/gist.service";
import { Loader2 } from "lucide-react";
import EditTopicsForm from "@/sections/gists/create/edit-topics-form";

export default function CreateGistView({
  slug,
}: {
  slug?: string;
}): JSX.Element {
  // hooks
  const {
    gists: data,
    gistsLoading: isLoading,
    gistsError: error,
    gistsValidating: isValidating,
    gistsEmpty: isEmpty,
  } = useGetGists(slug);

  // states
  const [topics, setTopics] = useState<
    {
      id: string;
      title: string;
      content: string;
    }[]
  >([]);

  const [gistId, setGistId] = useState<string>("");
  const [gistDetails, setGistDetails] = useState<{
    id: string;
    title: string;
    description: string;
    from: Date;
    to: Date;
  } | null>(null);

  // effects
  useEffect(() => {
    if (slug && data[0]) {
      setGistId(data[0].id as string);
      setGistDetails(data[0]);
      setTopics((data[0]?.topics as any) || []);
    }
  }, [data, slug]);

  if (isLoading) {
    return (
      <Stack align="center" justify="center" className="h-screen w-full">
        <Stack direction="row" gap={4} align="center">
          <Loader2 className="mr-2 h-10 w-10 animate-spin" />
          <Typography variant="h4">Loading...</Typography>
        </Stack>
      </Stack>
    );
  }

  return (
    <div>
      {!gistId ? (
        <Stack gap={3}>
          <Typography variant="h3">Create Gist</Typography>
          <CreateGistForm
            setGistId={setGistId}
            setGistDetails={setGistDetails}
          />
        </Stack>
      ) : (
        <EditTopicsForm
          gistDetails={gistDetails}
          topics={topics}
          setTopics={setTopics}
        />
      )}
    </div>
  );
}
