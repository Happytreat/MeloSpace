import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const classes = {
  blue: {
    maxWidth: '40vh',
    minHeight: '40vh',
    padding: '1.5rem',
    margin: '1rem',
    background: '#9DFFF9', // 4281A4 9DFFF9
  },
  green: {
    maxWidth: '40vh',
    minHeight: '40vh',
    padding: '1.5rem',
    margin: '1rem',
    background: '#BCD8B7', //C0C781 BCD8B7 64F58D
  },
  pink: {
    maxWidth: '40vh',
    minHeight: '40vh',
    padding: '1.5rem',
    margin: '1rem',
    background: '#FE938C', // FFDBDA DCB6D5 FE938C
  },
  yellow: {
    maxWidth: '40vh',
    minHeight: '40vh',
    padding: '1.5rem',
    margin: '1rem',
    background: '#EAD2AC', //
  },
};

class ProjectCard extends React.Component {

  render() {
    const {
      title, subtitle, description, github, website, more, color,
    } = this.props;

    const buttons = [];
    if (github) {
      buttons.push(
        <div>
          <Button size="small" target="_blank" href={github}>Github</Button>
        </div>
      )
    }

    if (website) {
      buttons.push(
        <div>
          <Button size="small" target="_blank" href={website}>Website</Button>
        </div>
      )
    }

    if (more) {
      buttons.push(
        <div>
          <Button size="small" target="_blank" href={more}>Learn More</Button>
        </div>
      )
    }

    return (
      <Card style={classes[color]} border={1} borderColor="text.primary">
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" component="h2">
            {subtitle}
          </Typography>
          <br />
          <Typography variant="body2" component="h2">
            {description}
          </Typography>
        </CardContent>
        <CardActions>
          {buttons}
        </CardActions>
      </Card>
    );
  }
}

export default ProjectCard;