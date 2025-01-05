import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

async function getAllExpenses() {
  // await new Promise((r) => setTimeout(r, 2000));
  const res = await api.expenses.$get();
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data.expenses;
}

function Expenses() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-all-spent"],
    queryFn: getAllExpenses,
  });

  if (error) return "An error has ocurred: " + error.message;

  return (
    <Table className="p-2 max-w-3xl m-auto">
      <TableCaption>A list of your recent expenses.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isPending
          ? Array(3)
              .fill(0)
              .map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4" />
                  </TableCell>
                </TableRow>
              ))
          : data?.map(({ id, amount, title }) => (
              <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell>{title}</TableCell>
                <TableCell className="text-right">{amount}</TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}

export const Route = createFileRoute("/expenses")({
  component: Expenses,
});
