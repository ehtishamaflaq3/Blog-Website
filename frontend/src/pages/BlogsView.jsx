import store from '@/redux/store';
import React from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'

const BlogsView = () => {
  const params = useParams();
  const blogId = params.blogId
  const {blog} =useSelector(store=>store.blog)
  const selectedBlog = blog.find(blog=>blog._id === blogId)
  return (
    <div>BlogsView</div>
  )
}
export default BlogsView;