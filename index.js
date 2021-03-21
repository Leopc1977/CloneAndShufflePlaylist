var SpotifyWebApi = require('spotify-web-api-node');

const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
  ];
  
// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: '30fe8ea66aca45188566454eacf1910a',
    clientSecret: '2aee24ce1d05403dbf6ad06cf7b7cc28',
    redirectUri: 'http://localhost:3000/callback'
  });

  const express = require('express');
const { DefaultDeserializer } = require('v8');
  const app = express();

  app.get('/playlists.html', (req, res) => {
    res.sendFile(__dirname +'/playlists.html');
  });
  app.get('/', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
  });

  app.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
  });
  
  app.get('/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;
  
    if (error) {
      console.error('Callback Error:', error);
      res.send(`Callback Error: ${error}`);
      return;
    }
  
    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];
  
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
  
        console.log('access_token:', access_token);

        console.log('refresh_token:', refresh_token);
        
        console.log(
          `Sucessfully retreived access token. Expires in ${expires_in} s.`
        );
        res.cookie('access_token', access_token);
        res.sendFile('/CloneAndShufflePlaylist/playlists.html');

        setInterval(async () => {
          const data = await spotifyApi.refreshAccessToken();
          const access_token = data.body['access_token'];
  
          console.log('The access token has been refreshed!');
          console.log('access_token:', access_token);
          spotifyApi.setAccessToken(access_token);
        }, expires_in / 2 * 1000);
      })
      .catch(error => {
        console.error('Error getting Tokens:', error);
        res.send(`Error getting Tokens: ${error}`);
      });
  });

  app.get('/css/main.css', (req, res) => {
    res.sendFile(__dirname +'/css/main.css');
  });
  app.get('/js/loadBuild.js', (req, res) => {
    res.sendFile(__dirname +'/js/loadBuild.js');
  });
  app.get('/js/createBuild.js', (req, res) => {
    res.sendFile(__dirname +'/js/createBuild.js');
  });

  const port = process.env['PORT'];
  const ip = process.env['IP'] 

  console.log(process.env['PORT'], process.env['port'], process.env.PORT,process.env.port)
  app.listen(port,ip, () => {
    console.log('serveur démarré sur le port', port,' IP ',ip);
  });