import React, { useState, useEffect } from 'react'
import ReactPlayer from 'react-player/lazy'

import ROSLIB from 'roslib'

import './App.css';
import Survey from './Survey';
import VoteSong from './VoteSong'

var ros = new ROSLIB.Ros({
  url : 'ws://192.168.1.66:9090'
});

ros.on('connection', function() {
  console.log('Connected to websocket server.');
});

ros.on('error', function(error) {
  console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function() {
  console.log('Connection to websocket server closed.');
});

var sendAnswers = false

function App() {

  const [pageNum, setPageNum] = useState(0)
  const [sessionLength, setSessionLength] = useState(5)
  const [myPlaylist, setMyPlaylist] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [songNum, setSongNum] = useState(0)
  const [showVoteSong, setShowVoteSong] = useState(false)
  const [answersStart, setAnswersStart] = useState([])
  const [answersEnd, setAnswersEnd] = useState([])

  var getPlaylistClient = new ROSLIB.Service({
    ros : ros,
    name : '/get_playlist',
    serviceType : 'ros_music_therapy/GetPlaylist'
  })

  var editValueClient = new ROSLIB.Service({
    ros : ros,
    name : '/edit_value',
    serviceType : 'ros_music_therapy/EditValue'
  })

  var saveSurveyClient = new ROSLIB.Service({
    ros : ros,
    name : '/save_survey',
    serviceType : 'ros_music_therapy/SaveSurvey'
  })

  //Handler for the start event: get the playlist and go to the player page
  function handlerStart() {
    //console.log(sessionLength)
    let getPlaylistRequest = new ROSLIB.ServiceRequest({
      numSongs : parseInt(sessionLength)
    })
    getPlaylistClient.callService(getPlaylistRequest, function(result) {
      setMyPlaylist(JSON.parse(result.playlist))
    })
    setPageNum(pageNum+1)
  }

  function handlerOnContinue(answers) {
    if (pageNum===1) {
      setAnswersStart(answers)
      setPageNum(pageNum+1)
    } else if (pageNum===3) {
      sendAnswers=true
      setAnswersEnd(answers)
      setPageNum(pageNum+1)
    }
  }

  function saveSurvey() {
    let answers = {
      start : answersStart,
      end : answersEnd
    }
    let saveSurveyRequest = new ROSLIB.ServiceRequest({
      sessionLength : parseInt(sessionLength),
      answers : JSON.stringify(answers)
    })
    saveSurveyClient.callService(saveSurveyRequest, function(result) {})
  }

  function onProgressHandler(progress) {
    //console.log(progress)
    if (progress.played > 0.98) {
      setIsPlaying(false)
      setShowVoteSong(true)
    }
  }

  function goToNextSong() {
    if (songNum<myPlaylist.length-1) {
      setSongNum(songNum+1)
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
      setPageNum(pageNum+1)
    }
  }

  function handlerSkip() {
    handlerOnVote(-2)
    goToNextSong()
  }

  function handlerOnVote(value) {
    setShowVoteSong(false)
    goToNextSong()
    let editValueRequest = new ROSLIB.ServiceRequest({
      link : myPlaylist[songNum],
      value : value
    })
    editValueClient.callService(editValueRequest, function(result) {})
  }

  function handlerRestart() {
    setIsPlaying(false)
    setMyPlaylist([])
    setSongNum(0)
    setPageNum(0)
  }

  function handlerQuit() {
    window.open("about:blank", "_self");
    window.close();
  }

  useEffect(()=>{
    if (sendAnswers) {
      saveSurvey()
    }
  }, [answersEnd])

  //DEBUG
  useEffect(()=>{
    //console.log("PLAYLIST: "+myPlaylist)
    //console.log("PLAYLIST LENGTH: "+myPlaylist.length)
    console.log(answersStart)
    console.log(answersEnd)
  })

  return (
    <div className="App">

      <div className="start-page" style={pageNum===0?{}:{display: 'none'}}>
        <div className="start-page-title">
          Benvenuto
        </div>
        <div className="start-page-subtitle">
          Inizia la sessione di musicoterapia
        </div>
        <div className="start-page-settings">
          <div className="start-page-settings-label">
            Seleziona la durata della sessione:
          </div>
          <select className="start-page-settings-length" name="sessionLength" id="sessionLength" value={sessionLength} onChange={(event)=>{setSessionLength(event.target.value)}}>
            <option value={5}>Breve (5 canzoni)</option>
            <option value={10}>Media (10 canzoni)</option>
            <option value={15}>Lunga (15 canzoni)</option>
          </select>
        </div>
        <div className="start-page-start" onClick={handlerStart}>
          Inizia
        </div>
      </div>

      <Survey
        show={pageNum===1}
        onContinue={handlerOnContinue}
      />

      <div className="content" style={pageNum===2?{}:{display: 'none'}}>
        <div className="player-container">
          <ReactPlayer
            playing={isPlaying}
            onPlay={()=>{setIsPlaying(true)}}
            url={myPlaylist[songNum]}
            width={"100%"}
            height={"100%"}
            controls={true}
            onProgress={onProgressHandler}
          />
        </div>
        <div className="controls-container">
          <div className="controls-skip" onClick={handlerSkip} style={(!showVoteSong)?{}:{display: 'none'}}>
            Salta canzone
          </div>
          <VoteSong
            show={showVoteSong}
            onVote={handlerOnVote}
          />
        </div>
      </div>

      <Survey
        show={pageNum===3}
        onContinue={handlerOnContinue}
      />

      <div className="end-page" style={pageNum===4?{}:{display: 'none'}}>
        <div className="end-page-title">
          Sessione terminata
        </div>
        <div className="end-page-subtitle">
          Chiudi la pagina o inizia una nuova sessione
        </div>
        <div className="end-page-buttons">
          <div className="end-page-restart" onClick={handlerRestart}>
            Ricomincia
          </div>
          <div className="end-page-quit" onClick={handlerQuit}>
            Chiudi
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
