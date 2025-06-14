"use client";

import {
  Stack, Typography,

} from "@/components";

import CreateGistForm from "@/sections/gists/create/create-gist-form";

export default function CreateGistView(): JSX.Element {
  return (
    <Stack direction="col" gap={8}>
      <Stack gap={3}>
        <Typography variant="h3">Create Gist</Typography>
        <CreateGistForm />
      </Stack>
    </Stack>
  );
}
