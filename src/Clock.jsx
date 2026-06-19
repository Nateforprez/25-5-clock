import React from 'react'; 
import './Clock.css'; 

class Clock extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            sessionTime: 25, /* 25 */ 
            breakTime: 5, 
            timeLeft: 25 * 60, /*25  */ 
            clockStart: false, 
            breakStart: false, 
            breakBegins: false, 
            paused: false, 
            finalMinute: false  
        }
        this.audioRef = React.createRef(); 

        this.handleUpClick = this.handleUpClick.bind(this); 
        this.handleDownClick = this.handleDownClick.bind(this); 
        this.handlePlayBtnClick = this.handlePlayBtnClick.bind(this); 
        this.handlePauseClick = this.handlePauseClick.bind(this); 
        this.handleRevertClick = this.handleRevertClick.bind(this); 
    }

    componentDidUpdate(prevProps, prevState) {





        if ((this.state.clockStart || this.state.breakStart) && !this.timerId) {
            this.timerId = setInterval(() => {
                if (this.state.timeLeft > 0) {
                    const red = this.state.timeLeft <= 60; 
                    this.setState((prev) => ({
                        timeLeft: prev.timeLeft  - 1,
                        finalMinute: red 
                    })); 
                } else {
                    clearInterval(this.timerId); /* removes the background process */ 
                    this.timerId = null; /* gets rid of the ID from memory */
                    if (this.state.breakStart) {
                        console.log("Resetting break time"); 
                        clearInterval(this.timerId); 
                        this.setState((prev) => ({
                            breakStart: false, 
                            clockStart: false, 
                            timeLeft: prev.sessionTime * 60, 
                            finalMinute: false, 
                            breakBegins: false, 
                            paused: false
                        })); 
                    } else {
                        console.log("setting break time"); 
                        this.setState((prev) => {
                            return {
                                breakStart: true, 
                                clockStart: false, 
                                breakBegins: true, 
                                timeLeft: prev.breakTime * 60 
                            }; 
                        }, () => {
                            setTimeout(() => {
                                this.audioRef.current.play().catch((err) => {console.log("missing audio file")}); 
                            }, 50); 
                        }); 
                    }
                }
            }, 1); /* 1000 */
        
        }
    }
    componentWillUnmount() {
        clearInterval(this.timerId); 
    }


    handleUpClick(event) {
        if (event.currentTarget.id === "session-increment") { 
            if ((!this.state.clockStart || !this.state.breakTime) && (this.state.sessionTime * 60 === this.state.timeLeft)) { 
                this.setState((prev) =>  {
                    const minutesLeft = prev.sessionTime >= 60 ? prev.sessionTime : prev.sessionTime + 1; 
                    const secondsLeft = minutesLeft * 60; 
                    return {
                        sessionTime: prev.clockStart ? prev.sessionTime : minutesLeft, 
                        timeLeft: prev.clockStart ? prev.timeLeft : secondsLeft
                    }
                }); 
            }
        } else {
            if ((!this.state.clockStart || !this.state.breakTime) && (this.state.sessionTime * 60 === this.state.timeLeft)) { 
                this.setState((prev) => {
                    return {
                        breakTime: prev.breakTime >= 60 ? prev.breakTime : prev.breakTime + 1
                    }; 
                }); 
            }
        }
    }
    handleDownClick(event) {
        if (event.currentTarget.id === "session-decrement") { 
            if ((!this.state.clockStart || !this.state.breakTime) && (this.state.sessionTime * 60 === this.state.timeLeft)) { 
                this.setState((prev) => {
                    const minutesLeft = prev.sessionTime <= 1 ? prev.sessionTime : prev.sessionTime - 1;  
                    const secondsLeft = minutesLeft * 60; 
                    return {
                        sessionTime: prev.clockStart ? prev.sessionTime : minutesLeft, 
                        timeLeft: prev.clockStart ? prev.timeLeft : secondsLeft
                    }; 
                }); 
            }
        } else {
            if ((!this.state.clockStart || !this.state.breakTime) && (this.state.sessionTime * 60 === this.state.timeLeft)) { 
                this.setState((prev) => {
                    return {
                        breakTime: prev.breakTime <= 1 ? prev.breakTime : prev.breakTime - 1
                    }; 
                }); 
            }
        }
    }
    handlePlayBtnClick(event) {

        console.log("Paused is: " + this.state.paused); 
        if (!this.state.clockStart || !this.state.breakStart) {  
            //console.log("The condition evalutes to: " + (!this.state.breakStart && !this.state.clockStart)); 
            if (!this.state.clockStart && !this.state.breakBegins) { 
                this.setState((prev) => {
                    return {
                        clockStart: true, 
                        paused: !prev.paused, 
                        timeLeft: prev.clockStart ? prev.sessionTime * 60 : prev.timeLeft/* convert to seconds */
                    }; 
                }); 
            } else if (!this.state.breakStart && this.state.breakBegins) {
                //console.log("break time is running "); 
                //console.log("break time is: " + this.state.breakStart); 
                this.setState((prev) => {
                    return {
                        breakStart: true, 
                        paused: !prev.paused, 
                        timeLeft: prev.timeLeft 
                    }
                }); 
            }
        } 
    }
    handlePauseClick(event) {

        console.log("Paused is 1: " + this.state.paused); 
        clearInterval(this.timerId); 
        this.timerId = null; 
        if (this.state.clockStart) 
            this.setState((prev) => ({clockStart: false, paused: !prev.paused})); 
        else if (this.state.breakStart) { 
            console.log("I am executing"); 
            this.setState((prev) => ({breakStart: false, paused: !prev.paused})); 
        }
    }
    handleRevertClick(event) {
        clearInterval(this.timerId); 
        this.timerId = null; 
        this.audioRef.current.pause(); 
        this.audioRef.current.currentTime = 0; 
        this.setState((prev) => ({clockStart: false, breakStart: false, timeLeft: 25 * 60, sessionTime: 25, breakTime: 5, finalMinute: false, breakBegins: false, paused: false}))
    }

    render() {
        const minutes = Math.floor(this.state.timeLeft/60); 
        const seconds = this.state.timeLeft % 60; 
        const displayedMinutes = minutes < 10 ? '0' + minutes: minutes; 
        const displayedSeconds = seconds < 10 ? '0' + seconds: seconds;  
        return (
            <>
                <div id="clock-container">
                    <h1 className="title-text">25 + 5 Clock</h1>

                    <div id="length-container">
                        <div className="length-container" id="break-container">
                            <h2 id="break-label" className="title-text">Break Length</h2>
                            <div id="btn-container">
                                <button className="clock-btn" id="break-decrement" onClick={this.handleDownClick}>
                                    <i className="fa-solid fa-circle-arrow-down" style={{fontSize: '30px', color: 'white'}}></i>
                                </button> 
                                <h2 id="break-length" style={{width: '20px'}}>{this.state.breakTime}</h2>
                                <button className="clock-btn" id="break-increment" onClick={this.handleUpClick}>
                                    <i className="fa-solid fa-circle-arrow-up" style={{fontSize: '30px', color: 'white'}}></i>
                                </button>
                            </div>
                        </div>

                        <div className="length-container" id="session-container">
                            <h2 id="session-label" className="title-text">Session Length</h2>
                            <div id="btn-container">
                                <button className="clock-btn" id="session-decrement" onClick={this.handleDownClick}>
                                    <i className="fa-solid fa-circle-arrow-down" style={{fontSize: '30px', color: 'white'}}></i>
                                </button> 
                                <h2 id="session-length" style={{width: '20px'}}>{this.state.sessionTime}</h2>
                                <button className="clock-btn" id="session-increment" onClick={this.handleUpClick}>
                                    <i className="fa-solid fa-circle-arrow-up" style={{fontSize: '30px', color: 'white'}}></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div id="digital-clock-container">
                        <div id="timer-stopper"></div>
                        <div className="clock-foot" id="clock-foot-left"></div>
                        <div className="clock-foot" id="clock-foot-right"></div>
                        <div id="clock">
                            <div className="clock-outline" style={{width: '90%', height: '80%', borderRadius: "15px"}}>
                                <div className="clock-outline" style={{width: '95%', height: '90%', borderRadius: "5px"}}>
                                    <h2 id="timer-label" style={{color: this.state.finalMinute ? 'red' : 'black'}}>{this.state.breakBegins ? 'Break' : 'Session'}</h2>
                                    <h2 id="time-left" style={{color: this.state.finalMinute ? 'red' : 'black'}}>{displayedMinutes}:{displayedSeconds}</h2>
                                </div>
                            </div>
                        </div>
                        <audio id="beep" ref={this.audioRef} src='./audio-files/digital_alarm_sound.mp3'></audio>
                    </div>

                    <div id="adjust-time">
                        
                        <button id="start_stop" onClick={this.state.paused ? this.handlePauseClick : this.handlePlayBtnClick}>
                            <i className="fa-solid fa-play" style={{color: 'white', fontSize: '30px'}}></i>
                        </button>
                        <button id="pause-btn" onClick={this.handlePauseClick}>
                            <i className="fa-solid fa-pause" style={{color: 'white', fontSize: '30px'}}></i>
                        </button>
                        <button id="reset" onClick={this.handleRevertClick}>
                            <i className="fa-solid fa-rotate-right" style={{color: 'white', fontSize: '30px'}}></i>
                        </button>
                    </div>
                </div>
            </>
        ); 
    }
}

export default Clock; 