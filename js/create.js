var createButton = document.getElementById('createButton');
var playlist = document.getElementsByName("playlist");
var input = document.getElementById('nameInput');
let currentPlaylist;

const SpotifyWebApi = require('spotify-web-api-node');
var token = '';
const spotifyApi = new SpotifyWebApi();
var namePlaylist='My playlist';
const getCookie = (name) => {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
};

let dataCookie = getCookie('access_token');
if (dataCookie) {
    token = dataCookie;
    spotifyApi.setAccessToken(token);
}

createButton.onclick = function(){
    for (var i = 0, length = playlist.length; i < length; i++) {
        if(playlist[i].checked) {
            currentPlaylist = {
                name:playlist[i].value,
                id:playlist[i].id,
                lstTracksID:[],
                newLstTracksID:[]
        }
    if(input.value !='')
    {
        namePlaylist=input.value ;
    }
        spotifyApi.createPlaylist(namePlaylist, { 'description': '', 'public': true })
        .then(function(NewPlaylistdata) {
            spotifyApi.getPlaylistTracks(currentPlaylist.id)
            .then(
                    function(data) {
                    var lstTracks = data.body.items;
                    for (let i=0;i<=lstTracks.length-1;i++)
                    {
                        var idTrack = lstTracks[i].track.id;
                        currentPlaylist.lstTracksID.push(idTrack);        
                    }

                    currentPlaylist.newLstTracksID = formatSpotifyURL(shuffle(currentPlaylist.lstTracksID));
                    spotifyApi.addTracksToPlaylist(NewPlaylistdata.body.id, currentPlaylist.newLstTracksID)
                    .then(function(data) {
                        console.log('Added tracks to playlist!');
                    }, function(err) {
                        console.log('addTracksToPlaylist: ', err);
                    });
                },
                function(err) {
                console.log('getPlaylistTracks: ', err);
                }
            );
        }, function(err) {
            console.log('createPlaylist: ', err);
        });
        }
      }
};

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function formatSpotifyURL(lst) {
    for (let i=0;i<=lst.length-1;i++)
    {
        lst[i] = `spotify:track:${lst[i]}`;        
    }
    return lst
}