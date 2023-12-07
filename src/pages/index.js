import React from 'react';
import { graphql } from 'gatsby';
import PostLink from '../components/elements/post-link';

import SEO from '../components/tools/seo';

const IndexPage = ({ data: { allMdx } }) => {
  const Posts = allMdx.edges
    .filter((edge) => !!edge.node.frontmatter.date)
    .map((edge) => <PostLink key={edge.node.id} post={edge.node} />);
  return (
    <div className="post-list">
      <SEO title="Home" />
      {Posts}
    </div>
  );
};

export default IndexPage;

export const pageQuery = graphql`
  query {
    allMdx(
    filter: {fileAbsolutePath: {regex: "/toots/"}}
    sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          id
          excerpt(pruneLength: 100)
          tableOfContents
          frontmatter {
            date(formatString: "MMM DD")
            path
            title
          }
        }
      }
    }
  }
`;
