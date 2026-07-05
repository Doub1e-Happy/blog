/* eslint-disable @typescript-eslint/no-require-imports */
import path from "path";
import fs from "fs";

export const dynamic = "force-static";

export async function POST(request: Request) {
  try {
    const { slug, category, content } = await request.json();

    const filePath = path.join(
      process.cwd(),
      "content",
      "blog",
      category,
      `${slug}.mdx`,
    );

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content, "utf-8");

    return new Response(JSON.stringify({ success: true, path: filePath }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: (error as Error).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
