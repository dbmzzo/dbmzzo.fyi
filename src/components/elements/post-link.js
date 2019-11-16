import React from 'react';
import { Link } from 'gatsby';
import './post-link.css';

const PostLink = ({ post }) => (
  <div className="post-link">
    <div className="post-date">
      <Link to={post.frontmatter.path}>
        {post.frontmatter.date}
      </Link>
    </div>
    <div className="post-title">
      <h3>
        <Link to={post.frontmatter.path}>
          {post.frontmatter.title}
        </Link>
      </h3>
    </div>
  </div>
);

export default PostLink;
