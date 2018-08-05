import express from 'express';
var app = express();
import axios from 'axios';


// fetch current twitch live stream, matched by location, date, time
// hard-coded for demo purposes

// fetch current track using universal music group api
// match artist, release, track from live stream

// fetch artist by name, returns top three tracks
app.get('/tracks', (req, res) => {
  axios.get('http://api.7digital.com/1.2/artist/search', {
    params: {
      shopId: process.env.SHOPID,
      oauth_consumer_key: process.env.API_KEY,
      q: 'Rihanna'
    },
    headers: {
      accept: 'application/json'
    }
  })
  .then((response) => {
    console.log(response.data.searchResults.searchResult[0].artist);
    var artistId = response.data.searchResults.searchResult[0].artist.id;
    console.log('ARTIST ID', artistId)
    return artistId
  })
  .then(id => {
    axios.get('http://api.7digital.com/1.2/artist/toptracks', {
      params: {
        shopId: process.env.SHOPID,
        oauth_consumer_key: process.env.API_KEY,
        artistId: id,
        usageTypes: 'adsupportedstreaming'
      },
      headers: {
        accept: 'application/json'
      }
    })
    .then(response => {
      console.log('TRACKS', response.data.tracks.track.slice(0,2))
      var topThree = response.data.tracks.track.slice(0,2);
      return topThree;
    })
  })
  .catch(function (error) {
    console.log(error);
  });
});

// fetch current location

//mongoose models(map location) compass algo

//add emotion to stream

app.listen(3000)
