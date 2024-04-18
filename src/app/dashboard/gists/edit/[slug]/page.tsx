import CreateGistView from "@/views/dashboard/gists/create";

export default function EditGistPage({
  params,
}: {
  params: { slug: string };
}): JSX.Element {
  return <CreateGistView slug={params.slug} />;
}
