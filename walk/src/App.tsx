import React from 'react';
import './App.css';
import * as mqtt from 'mqtt/dist/mqtt.min';

const mqtt_client = mqtt.connect('ws://bitzy:8888');
mqtt_client.subscribe('traffic');
mqtt_client.on('message', (topic, message) => {
  let decoded = new TextDecoder("utf-8").decode(message)
  if (decoded === 'REQUEST_WALK') {
    console.log('LightCrossing: received ', decoded);
  }
});

const WalkButton = () => {
  return(
    <div className="walk-control">
      <div className="walk-button" onClick={() => {
        mqtt_client.publish('traffic', 'REQUEST_WALK')
        new Audio('/beep.mp3').play();
      }}></div>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <main className="">
        <WalkButton />
      </main>
    </div>
  );
}

export default App;
