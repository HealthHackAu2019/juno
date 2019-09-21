import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Container,
  Menu,
  Input,
  Segment,
  Grid,
  Header,
} from "semantic-ui-react";
import Pusher from 'pusher-js';
import axios from 'axios';
import styles from './styles.module.css';

const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
  cluster: process.env.REACT_APP_PUSHER_CLUSTER,
  forceTLS: true,
});

const models = {
  model1: 'Model 1',
  model2: 'Model 2',
  model3: 'Model 3',
};

const textures = {
  texture1: 'Texture 1',
  texture2: 'Texture 2',
  texture3: 'Texture 3',
};

const modelKeys = Object.keys(models);
const textureKeys = Object.keys(textures);

const publish = ({ channelName, model, texture }) => {
  axios.post(`${process.env.REACT_APP_API_URL}/publish`, {
    channel: channelName,
    event: 'trainer-event',
    message: JSON.stringify({
      model,
      texture,
    }),
  });
};

const Trainer = () => {
  const [connected, setConnected] = useState(false);
  const [channelName, setChannelName] = useState(Math.random().toString(36).substring(7));
  const [model, setModel] = useState('');
  const [texture, setTexture] = useState('');

  // Update channel name
  const handleUpdateChannelName = useCallback(e => setChannelName(e.target.value), []);
  useEffect(() => {
    if (!channelName) return;
    publish({ channelName, model, texture });
  }, [channelName, model, texture]);

  // Start the training session
  const handleStartSession = useCallback(() => (async () => {
    pusher.subscribe(channelName);
    pusher.bind('trainee-event', () => {
      publish({ channelName, model, texture });
    });
    setConnected(true);
  })(), [channelName]);

  return (
    <div className={styles.root}>
      <Menu
        fixed="top"
        size='large'
        inverted
      >
        <Container>
          <Menu.Item as='div' className="ui input">
            <Input value={channelName} readOnly={connected} onChange={handleUpdateChannelName} />
          </Menu.Item>
          <Menu.Item as='div'>
            <Button as="div" primary disabled={connected} onClick={handleStartSession}>Start training session</Button>
          </Menu.Item>
        </Container>
      </Menu>

      <Segment id={styles.content} vertical>
        <Grid container stackable verticalAlign='middle'>
          <Grid.Row>
            <Grid.Column width={8} className={styles.column}>
              <Header as='h3'>Models</Header>
              {modelKeys.map(m => (
                <Button
                  key={m}
                  onClick={() => setModel(m)}
                  primary={m === model}
                >
                  {models[m]}
                </Button>
              ))}
            </Grid.Column>
            <Grid.Column width={8} className={styles.column}>
              <Header as='h3'>Textures</Header>
              {textureKeys.map(t => (
                <Button
                  key={t}
                  onClick={() => setTexture(t)}
                  primary={t === texture}
                >
                  {textures[t]}
                </Button>
              ))}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}>
              <div className={styles.imagePlaceholder} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  );
};

export default Trainer;
