import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"
require(`katex/dist/katex.min.css`)

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="My Notes" />
        <h1>My Notes</h1>
        <div>These are notes that I've made in the process of studying various subjects, most of the time through
            research papers or online courses. 
            Usually, I will read the subject matter (e.g. research papers) at least once, and try to summarise and
            collate key points and argument made in these notes. I will also frequently refer to videos or 
            secondary materials for more context. 
            The notes in this section, hence, acts like a collation of different insights from various
            sources on the subject matter. 
        </div>
        <h3>Structure of paper summary</h3>
        <p>
        For paper summaries, I try to prioritize understanding the intuitions behind the technology over 
        memorizing the nitty-gritty details. In particular, here are some questions I will focus on answering: 
        <br></br>
        <ol>
          <li>What is the problem the authors wish to solve? </li>
          <li>What is the big picture (architecture)?</li> 
          <li>How is the solution implemented in practice? (How does it differ from the theory?)</li>
          <li>What are the main advantages of the solution?</li>
          <li>What are some shortcomings of the solution?</li>
        </ol>
        </p>
        <br></br>
        <hr></hr>
        {/* <h3>1. MIT 6.824: Distributed Systems <a href="https://pdos.csail.mit.edu/6.824/schedule.html">[2020 Course Schedule]</a></h3> */}
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <div key={node.fields.slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
              <small>{node.frontmatter.date}</small>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt,
                }}
              />
            </div>
          )
        })}
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: {fileAbsolutePath: {regex: "/notes/"}}) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
