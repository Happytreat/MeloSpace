import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
class BlogAbout extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="Contact" />
        <h2>Contact Me</h2>
        <h5>Add me on: </h5>
        <p style={{ alignContent: "center" }}>
          LinkedIn:{" "}
          <a href="https://www.linkedin.com/in/melodies-sim-69b805100/">
            @MelodiesSim
          </a>
        </p>
        <p>
          Follow me on <a href="https://medium.com/@melodiessim98">Medium</a> to
          stay updated to my latest posts!{" "}
        </p>
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
