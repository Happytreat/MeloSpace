import React from "react"
import { graphql } from "gatsby"
import Grid from '@material-ui/core/Grid';

import Layout from "../components/layout"
import SEO from "../components/seo"
import Card from "../components/projectCard";
import Projects from '../../content/projects/projects';


class BlogAbout extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const projects = [];
    Projects.forEach(p => {
      projects.push(
        <Grid item md={6} xs={12}>
          <Card title={p.title}
                subtitle={p.subtitle}
                description={p.description}
                github={p.github}
                website={p.website}
                more={p.more}
                color={p.color} />
        </Grid>
      )
    });

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="Projects" />
        <h2>
          Projects
        </h2>
        <Grid container>
          {projects}
        </Grid>
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