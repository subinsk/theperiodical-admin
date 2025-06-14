import CreateGistView from "@/views/dashboard/gists/create";
import EditGistView from "@/views/dashboard/gists/edit";

export default function EditGistPage({
  params,
}: {
  params: { slug: string };
}): JSX.Element {
  return <EditGistView slug={params.slug} />;
}
