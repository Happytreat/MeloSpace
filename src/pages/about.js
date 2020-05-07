import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
// import { rhythm } from "../utils/typography"
import JSImg from '../../content/assets/js.png';
import NodeImg from '../../content/assets/nodejs.png';
import ExpressImg from '../../content/assets/expressjs.png';
import SwiftImg from '../../content/assets/swift.png';
import ReactImg from '../../content/assets/react.png';
import AWSImg from '../../content/assets/lambda.png';

class BlogAbout extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="About The Author" />
        <h2>
          About Me
        </h2>
        <p style={{alignContent: 'center'}}>
          Highly independent and motivated. Passionate about turning novel ideas into reality. 
          A Third year Math and CS undergrad at National University of Singapore.
        </p>
        <h4>Languages/Tech Stack</h4>
        <p>
        Swift, Javascript, Python, Java, C++
        </p>
        <img alt="NodeJS" src={NodeImg} style={{ maxWidth: '20vh', padding: '1rem 2rem' }}/>
        <img alt="Languages" src={SwiftImg} style={{ maxWidth: '20vh', padding: '1rem 2rem' }}/>
        <img alt="Languages" src={ReactImg} style={{ maxWidth: '20vh', padding: '1rem 2rem' }}/>
        <img alt="Languages" src={AWSImg} style={{ maxWidth: '20vh', padding: '1rem 2rem' }}/>
        <p>
          Web Development: NodeJS, ExpressJS, SQL, ReQL, ReactJS, Gatsby, Serverless Framework using AWS Lambda, Cognito, IAM, DynamoDB
        </p>
        <p>
          Mobile Development: Swift (iOS)
        </p>
        <p>
          Blockchain Tech: Truffle, Drizzle, Ganache, Solidity
        </p>


        <h4>Awards and Competition</h4>
        <ul>
          <li> Runner Up National Blockchain Challenge 2019</li>
          <li> AWS Challenge Winner at Angel Hack 2019</li>
          <li> Awardee of the NUS Global Merit Scholarship 2017-2022</li>
          <li> Awardee of the Lee Kuan Yew Mathematics and Science Award 2015</li>
          <li> Gold Award of Singapore Mathematical Olympiad 2014</li>
        </ul>

        <h4>My Publications</h4>
        <li><a href="http://ircset.org/anand/2015papers/IRC-SET-2015_submission_46.pdf">Generalisation of bishop polynomial derived from
          conventional rook polynomial</a></li>
        <li><a href="https://www.researchgate.net/scientific-contributions/2050116807_Sim_Ming_Hui_Melodies">Solution Structures and Model Membrane Interactions of Ctriporin, an Anti-Methicillin-Resistant Staphylococcus aureus Peptide from Scorpion Venom</a></li>


        <h4>My Resume</h4>

        <iframe title="Resume" src="https://drive.google.com/file/d/123ZHBZ9dZn1RQm5Iym8gZjLE4fKLNAX7/preview" width="1000" height="1400"></iframe>
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