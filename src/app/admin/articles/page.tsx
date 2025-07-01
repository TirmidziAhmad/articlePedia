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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

export default function ArticlesPage() {
  // Mock data - replace with your actual data fetching
  const totalArticles = 42;
  const categories = ["All", "Technology", "Business", "Health", "Science"];
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
            Total Articles: {totalArticles}
          </p>

          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <TableHead className="w-[100px]">Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <Image
                      src={article.thumbnail}
                      alt={article.title}
                      width={200}
                      height={200}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>{article.category}</TableCell>
                  <TableCell>{article.createdAt}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="underline text-blue-600"
                    >
                      Preview
                    </Button>
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
