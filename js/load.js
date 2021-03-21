const SpotifyWebApi = require('spotify-web-api-node');
const token = "";
const spotifyApi = new SpotifyWebApi();

const getCookie = (name) => {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
};

let dataCookie = getCookie('access_token');
if (dataCookie) {
    const token = dataCookie;
    spotifyApi.setAccessToken(token);
} else {

}

var lstPlaylist = document.getElementById('lst_playlist');

//GET MY PROFILE DATA
function getMyData() {
    (async () => {
      const me = await spotifyApi.getMe();
      // console.log(me.body);
      getUserPlaylists(me.body.id);
    })().catch(e => {
      console.error(e);
    });
}
//GET MY PLAYLISTS
async function getUserPlaylists(userName) {
    const data = await spotifyApi.getUserPlaylists(userName)
    var i=0
    for (let playlist of data.body.items) {
      var p = {
          name:playlist.name,
          id:playlist.id
      }
      var input = document.createElement('input');
      input.setAttribute('type','radio');
      input.setAttribute('name','playlist');
      input.setAttribute('id',`playlist#${i}`);

      input.setAttribute('value',p.name);
      input.setAttribute('id',p.id);

      var label = document.createElement('label');
      label.setAttribute('for',`playlist#${i}`);
      label.innerHTML = p.name;

      var div = document.createElement('div');

      div.appendChild(input);
      div.appendChild(label);
      lstPlaylist.appendChild(div);
      i+=1
    }
}
getMyData();