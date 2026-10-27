import store from "@/pages/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BlogsView = () => {
  const params = useParams();
  const blogId = params.blogId;
  const { blog } = useSelector((store) => store.blog);
  const selectedBlog = blog?.find(
    (item) => String(item._id) === String(blogId),
  );
  if (!selectedBlog) {
    return <div className="p-10">Blog not found!</div>;
  }

  const changeTimeFormat = (isDate) => {
    const date = new Date(isDate);
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options);
    return formattedDate;
  };

  return (
    <div className="pt-8 pl-10">
      <div className="max-w-6xl mx-auto p-6 border-2">
        {/* breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<a href="/" />}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/dashboard/your-blog" />}>
                Blogs
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{selectedBlog.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* blog header */}
        <div className="my-8 border-2">
          <h1 className="text-4xl font-bold tracking-tight mb-5 mt-5 ml-5">
            {selectedBlog.title}
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-4 border-2">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={selectedBlog.author.photoUrl}
                  alt="@shadcn"
                  className=" cursor-pointer"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="text-xl ">
                <p>
                  {selectedBlog.author.firstName} {selectedBlog.author.lastName}
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Published on {changeTimeFormat(selectedBlog.createdAt)} . 8 min
              read
            </div>
          </div>
        </div>
        {/* featured image */}
      </div>
    </div>
  );
};
export default BlogsView;
