import React from 'react';
import { borders } from '@material-ui/system';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import GithubIcon from '../../content/assets/github.png';

const classes = {
  card: {
    maxWidth: '40vh',
    padding: '1.5rem',
    margin: '1rem',
    background: '#64F58D',
  },
};

class ProjectCard extends React.Component {

  render() {
    const { title, description, github, more } = this.props;
    return (
      <Card style={classes.card} border={1} borderColor="text.primary">
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" component="h2">
            {description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" target="_blank" href={github}>Github</Button>
          <Button size="small" target="_blank" href={more}>Learn More</Button>
        </CardActions>
      </Card>
    );
  }
}

export default ProjectCard;