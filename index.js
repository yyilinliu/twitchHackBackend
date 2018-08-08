import express from 'express';
var app = express();
import axios from 'axios';
import mongoose from 'mongoose';
import models from './models.js';
var Stage = models.Stage;
import bodyParser from 'body-parser';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// fetch current twitch live stream, matched by location, date, time
// hard-coded for demo purposes
// app.get('/stream', (req, res) => {
//   axios.get('https://clips.twitch.tv/PlayfulDrabLeopardBibleThump')
//   .then(response => console.log('RESPONSE', response))
//   .catch(error => console.log('ERROR', error))
// })

// fetch current track using universal music group api
// match artist, release, track from live stream

// fetch artist by name, returns top three tracks
// new Stage({
//   location: 'Focaccia',
//   artist: 'Florence + the Machine',
//   url: 'https://clips.twitch.tv/SteamyInterestingVanillaDeIlluminati'
// })
// .save()
// .then()
// .catch(err => console.log(err))

app.post('/videoAndArtist', (req, res) => {
  console.log('LOCATION', req.body.location);
  Stage.findOne({location: req.body.location}, (err, stage) => {
    if (err) console.log(err);
    console.log('STAGE FOUND', stage);
    axios.get('http://api.7digital.com/1.2/artist/search', {
      params: {
        shopId: process.env.SHOPID,
        oauth_consumer_key: process.env.API_KEY,
        q: stage.artist
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
        var topThree = response.data.tracks.track.slice(0,3);
        var allData = {
          artist: stage.artist,
          url: stage.url,
          tracks: topThree
        }
        console.log('ALL DATA', allData);
        console.log('track', allData.tracks[0].release);
        console.log('made it to the backend');
        res.json(JSON.stringify(allData));
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  })
});

// fetch current location

//mongoose models(map location) compass algo

//add emotion to stream

app.listen(3000)
