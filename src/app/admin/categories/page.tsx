"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Category type
interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get<Category[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`
        );
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="rounded-lg border">
        <p className="font-medium border-b">
          Total Category: {filteredCategories.length}
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Input
                placeholder="Search category..."
                className="max-w-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              Add Category
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 font-medium">Category</th>
                  <th className="py-2 px-4 font-medium">Created At</th>
                  <th className="py-2 px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b">
                    <td className="py-2 px-4">{category.name}</td>
                    <td className="py-2 px-4">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 space-x-4">
                      <button className="text-blue-600 underline hover:text-blue-800">
                        Edit
                      </button>
                      <button className="text-red-600 underline hover:text-red-800">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredCategories.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-4 px-4 text-center text-muted-foreground"
                    >
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
