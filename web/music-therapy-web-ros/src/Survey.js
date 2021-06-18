import React, { useState, useEffect } from 'react'

import './Survey.css'

function Survey(props) {

  const [answerOne, setAnswerOne] = useState(null)
  const [answerTwo, setAnswerTwo] = useState(null)
  const [answerThree, setAnswerThree] = useState(null)
  const [answerFour, setAnswerFour] = useState(null)

  function handlerOnContinue() {
    if (answerOne!==null && answerTwo!==null && answerThree!==null && answerFour!==null) {
      props.onContinue([answerOne, answerTwo, answerThree, answerFour])
      setAnswerOne(null)
      setAnswerTwo(null)
      setAnswerThree(null)
      setAnswerFour(null)
    }
  }

  useEffect(()=>{
    console.log("AGG")
    console.log([answerOne,answerTwo,answerThree,answerFour])
  })

  return(
    <div className="survey-container" style={props.show?{}:{display: 'none'}}>
      
      <div className="survey-qa-container">
        <div className="survey-question">
          Quanto ti senti felice?
        </div>
        <div className="survey-answer-container">
          <label className="survey-answer-button">
            <input type="radio" name="answer-one" checked={answerOne===0} onChange={() => setAnswerOne(0)} />
            <span id="red">
              Per niente
            </span>
          </label>
          <label className="survey-answer-button">
            <input type="radio" name="answer-one" checked={answerOne===1} onChange={() => setAnswerOne(1)} />
            <span id="yellow">
              Poco
            </span>
          </label>
          <label className="survey-answer-button">
            <input type="radio" name="answer-one" checked={answerOne===2} onChange={() => setAnswerOne(2)} />
            <span id="greenyellow">
              Abbastanza
            </span>
          </label>
          <label className="survey-answer-button">
            <input type="radio" name="answer-one" checked={answerOne===3} onChange={() => setAnswerOne(3)} />
            <span id="green">
              Molto
            </span>
          </label>
        </div>
      </div>

      <div className="survey-qa-container">
        <div className="survey-question">
          Quanto ti senti rilassato?
        </div>
        <div className="survey-answer-container">
          <label className="survey-answer-button">
            <input type="radio" name="answer-two" checked={answerTwo===0} onChange={() => setAnswerTwo(0)} />
            <span id="red">
              Per niente
            </span>
          </label>
          <label className="survey-answer-button">
            <input type="radio" name="answer-two" checked={answerTwo===1} onChange={() => setAnswerTwo(1)} />
            <span id="yellow">
              Poco
            </span>
          </label>
          <label className="survey-answer-button">
            <input type="radio" name="answer-two" checked={answerTwo===2} onChange={() => setAnswerTwo(2)} />
            <span id="greenyellow">
              Abbastanza
            </span>
          </label>
          <label className="survey-answer-button">
            <input type="radio" name="answer-two" checked={answerTwo===3} onChange={() => setAnswerTwo(3)} />
            <span id="green">
              Molto
            </span>
          </label>
        </div>
      </div>

      <div className="survey-qa-container">
        <div className="survey-question">
          Quanto ti senti stanco?
        </div>
        <div className="survey-answer-container">
          <label className="survey-answer-button">
            <input type="radio" name="answer-three" checked={answerThree===0} onChange={() => setAnswerThree(0)} />
            <span id="red">
              Per niente
            </span>
          </label>
          <label className="survey-answer-button">
            <input type="radio" name="answer-three" checked={answerThree===1} onChange={() => setAnswerThree(1)} />
            <span id="yellow">
              Poco
            </span>
          </label>
          <label className="survey-answer-button">
            <input type="radio" name="answer-three" checked={answerThree===2} onChange={() => setAnswerThree(2)} />
            <span id="greenyellow">
              Abbastanza
            </span>
          </label>
          <label className="survey-answer-button">
            <input type="radio" name="answer-three" checked={answerThree===3} onChange={() => setAnswerThree(3)} />
            <span id="green">
              Molto
            </span>
          </label>
        </div>
      </div>

      <div className="survey-qa-container">
        <div className="survey-question">
          Quanto ti senti annoiato?
        </div>
        <div className="survey-answer-container">
          <label className="survey-answer-button">
            <input type="radio" name="answer-four" checked={answerFour===0} onChange={() => setAnswerFour(0)} />
            <span id="red">
              Per niente
            </span>
          </label>
          <label className="survey-answer-button">
            <input type="radio" name="answer-four" checked={answerFour===1} onChange={() => setAnswerFour(1)} />
            <span id="yellow">
              Poco
            </span>
          </label>
          <label className="survey-answer-button">
            <input type="radio" name="answer-four" checked={answerFour===2} onChange={() => setAnswerFour(2)} />
            <span id="greenyellow">
              Abbastanza
            </span>
          </label>
          <label className="survey-answer-button">
            <input type="radio" name="answer-four" checked={answerFour===3} onChange={() => setAnswerFour(3)} />
            <span id="green">
              Molto
            </span>
          </label>
        </div>
      </div>

      <div className="survey-continue" onClick={handlerOnContinue}>
        Continua
      </div>
      
    </div>
  )
    
}

export default Survey;