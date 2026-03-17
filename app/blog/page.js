// @flow strict

import BlogCard from "../components/homepage/blog/blog-card";
import { getHashnodeBlogs } from "@/utils/data/blog-data";

function toDevtoLikeShape(hashnodePost) {
  return {
    // BlogCard in this template usually uses: title, description, cover_image, url, readable_publish_date
    title: hashnodePost.title,
    description: hashnodePost.description,
    cover_image: hashnodePost.image || null,
    url: hashnodePost.url,
    // optional: BlogCard sometimes shows date
    readable_publish_date: hashnodePost.publishedAt
      ? new Date(hashnodePost.publishedAt).toDateString()
      : "",
  };
}

async function Page() {
  const posts = await getHashnodeBlogs();
  const blogs = posts.map(toDevtoLikeShape);

  return (
    <div className="py-8">
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-2xl rounded-md">
            All Blog
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 xl:gap-10">
        {blogs
          .filter((b) => b?.cover_image && b?.url)
          .map((blog, i) => (
            <BlogCard blog={blog} key={i} />
          ))}
      </div>
    </div>
  );
}

export default Page;