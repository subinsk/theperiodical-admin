import { DataTable } from "@/components";
import { columns } from "./columns";
import { useGetGists } from "@/services/gist.service";

export default function GistListTableSection() {
  const {
    gists: data,
    gistsLoading: isLoading,
    gistsError: error,
    gistsValidating: isValidating,
    gistsEmpty: isEmpty,
  } = useGetGists();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
