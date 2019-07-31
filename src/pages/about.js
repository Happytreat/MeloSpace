import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

class BlogAbout extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="About The Author" />
      </Layout>
    )
  }
}

export default BlogAbout


export const pageQuery = graphql`
    query {
        site {
            siteMetadata {
                title
            }
        }
    }
`