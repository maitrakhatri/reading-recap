/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

interface Category {
  name: string;
  value: number;
}

const CirclePackingChart = () => {
  const [categories, setCategories] = useState<Category[]>([
    { name: "Fiction", value: 20 },
    { name: "Non-Fiction", value: 10 },
    { name: "Mystery", value: 8 },
  ]);
  const [username, setUsername] = useState("User");
  const [customTotal, setCustomTotal] = useState<number | null>(null);
  const [autoTotal, setAutoTotal] = useState(true); // Toggle for auto total
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const width = 800;
    const height = 950; // Adjusted height to include additional text for total

    const data = {
      name: "Books",
      children: categories,
    };

    const pastelColors = [
      "#FFB3BA",
      "#FFDFBA",
      "#FFFFBA",
      "#BAFFC9",
      "#BAE1FF",
      "#D3BFFF",
      "#FFC8C8",
      "#B9FBC4",
    ];

    const parentBubbleColor = "#AFCBFF";

    const pack = d3
      .pack()
      .size([width, height - 150]) // Adjusted for additional text space
      .padding(10);

    const root = d3.hierarchy(data).sum((d: any) => d.value);

    //@ts-ignore
    const nodes = pack(root).descendants();

    d3.select(ref.current).select("svg").remove();

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("width", "100%")
      .style("height", "100%");

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text(`${username}'s 2024 Reading Recap`);

    // Add total books read
    const totalBooks = autoTotal
      ? categories.reduce((sum, category) => sum + category.value, 0)
      : customTotal || 0;

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 70)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("fill", "#000")
      .text(`Total Books Read: ${totalBooks}`);

    // Draw circles
    svg
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y + 100) // Offset for the title and total
      .attr("r", (d) => d.r)
      .style("fill", (d, i) =>
        d.children ? parentBubbleColor : pastelColors[i % pastelColors.length]
      );

    // Add text inside circles
    svg
      .selectAll("text.circle-text")
      .data(nodes)
      .join("text")
      .attr("class", "circle-text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + 100)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "#333")
      .style("pointer-events", "none")
      //@ts-ignore
      .text((d) => (d.children ? "" : `${d.data.name} - ${d.data.value}`));

    // Add footer
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "normal")
      .style("fill", "#000")
      .text(`Made with ❤️ by Maitra Khatri`);
  }, [categories, username, customTotal, autoTotal]);

  const handleCategoryChange = (
    index: number,
    field: "name" | "value",
    value: string | number
  ) => {
    const updatedCategories = [...categories];
    if (field === "name") {
      updatedCategories[index].name = value as string;
    } else {
      updatedCategories[index].value = Number(value);
    }
    setCategories(updatedCategories);
  };

  const handleRemoveCategory = (index: number) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
  };

  const handleAddCategory = () => {
    setCategories([...categories, { name: "New Category", value: 1 }]);
  };

  const handleCustomTotalChange = (value: string) => {
    setCustomTotal(value === "" ? null : Number(value));
  };

  const downloadChart = () => {
    const svgElement = d3.select(ref.current).select("svg").node();
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    //@ts-ignore
    const svgString = serializer.serializeToString(svgElement);

    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 950;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = pngUrl;
      link.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(
      unescape(encodeURIComponent(svgString))
    )}`;
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-6">
      {/* Editor Section */}
      <div className="flex-1 w-full lg:w-1/3 rounded p-6">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded w-full mb-4"
          placeholder="Enter your name"
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full"
        >
          Add Category
        </button>
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={index} className="flex gap-4 items-center">
              <input
                type="text"
                value={category.name}
                onChange={(e) =>
                  handleCategoryChange(index, "name", e.target.value)
                }
                className="p-2 border rounded w-full"
                placeholder="Category Name"
              />
              <input
                type="number"
                value={category.value}
                onChange={(e) =>
                  handleCategoryChange(index, "value", e.target.value)
                }
                className="p-2 border rounded w-full"
                placeholder="Book Count"
              />
              <button
                onClick={() => handleRemoveCategory(index)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 font-medium mb-2">
            Total Books Read:
          </label>
          <input
            type="number"
            value={
              autoTotal
                ? categories.reduce((sum, cat) => sum + cat.value, 0)
                : customTotal || ""
            }
            onChange={(e) => handleCustomTotalChange(e.target.value)}
            className="p-2 border rounded w-full"
            placeholder="Enter total books read"
            disabled={autoTotal}
          />
          <label className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={autoTotal}
              onChange={() => setAutoTotal(!autoTotal)}
              className="mr-2"
            />
            Auto-calculate from categories
          </label>
        </div>
        <button
          onClick={downloadChart}
          className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full"
        >
          Download Chart
        </button>
      </div>

      {/* Chart Section */}
      <div className="flex-1 w-full lg:w-2/3">
        <div ref={ref} className="w-full h-full p-6"></div>
      </div>
    </div>
  );
};

export default CirclePackingChart;
