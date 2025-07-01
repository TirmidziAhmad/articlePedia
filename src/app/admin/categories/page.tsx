import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CategoriesPage() {
  const totalArticles = 42;
  const articles = [
    {
      id: 1,
      thumbnail: "/article.jpg",
      title: "Getting Started with Next.js",
      category: "Technology",
      createdAt: "2023-05-15",
    },
    {
      id: 2,
      thumbnail: "/article.jpg",
      title: "The Future of AI",
      category: "Technology",
      createdAt: "2023-06-20",
    },
    {
      id: 3,
      thumbnail: "/article.jpg",
      title: "Healthy Eating Habits",
      category: "Health",
      createdAt: "2023-07-10",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 border rounded-lg">
      <div className="flex flex-col gap-4">
        {/* Stats and search/filter section */}
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Total Categories: {totalArticles}
          </p>

          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <Input placeholder="Search articles..." className="max-w-sm" />
            </div>

            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              Add Article
            </Button>
          </div>
        </div>

        {/* Articles table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>{article.category}</TableCell>
                  <TableCell>{article.createdAt}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="underline text-blue-600"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="underline text-red-600"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
