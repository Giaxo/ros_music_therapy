import React from 'react'

import './VoteSong.css'

function VoteSong(props) {

  return(
    <div className="controls-vote-container" style={props.show?{}:{display: 'none'}}>
      <div className="controls-vote-question">
        Quanto ti è piaciuta questa canzone?
      </div>
      <div className="controls-vote-button" id="molto" onClick={()=>{props.onVote(2)}}>
        MOLTO
      </div>
      <div className="controls-vote-button" id="abbastanza" onClick={()=>{props.onVote(0)}}>
        ABBASTANZA
      </div>
      <div className="controls-vote-button" id="poco" onClick={()=>{props.onVote(-1)}}>
        POCO
      </div>
      <div className="controls-vote-button" id="perniente" onClick={()=>{props.onVote(-2)}}>
        PER NIENTE
      </div>
    </div>
  )
    
}

export default VoteSong;