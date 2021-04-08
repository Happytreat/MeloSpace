import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import UnderConstructionImg from "../../content/assets/under-construction.png"

class BlogAbout extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="Contact" />
        <img alt="UnderConstruction" src={UnderConstructionImg} />
        <p>Recently under the recommendation of some friends, I've decided to be more deliberate in 
        tracking my Fitness routine and progress. This page will serve as my personal fitness diary, and may include 
        some tips I've learnt in my fitness journey.</p>
      </Layout>
    );
  }
}

export default BlogAbout;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
