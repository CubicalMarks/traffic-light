import React, { Fragment } from 'react';
import './App.css';
import { useMachine } from '@xstate/react';
import { lightCrossingMachine } from './lightCrossingMachine';
import * as mqtt from 'mqtt/dist/mqtt.min';

const mqtt_client = mqtt.connect('ws://localhost:8888');
mqtt_client.subscribe('traffic');
mqtt_client.on('message', (topic, message) => {
  let decoded = new TextDecoder("utf-8").decode(message)
  if (decoded === 'REQUEST_WALK') {
    document.body.dispatchEvent(requestWalkEvent);
    console.log('LightCrossing: received ', decoded);
  }
});

const requestWalkEvent = new CustomEvent('REQUEST_WALK', {});

const LightCrossing = () => {
  const [state, send] = useMachine(lightCrossingMachine)

  document.body.addEventListener('REQUEST_WALK', e => {
    send('REQUEST_WALK');
    console.log('REQUEST_WALK event');
  })

  return (
    <>
      <div className="light-crossing">
        <button id="walkButton" onClick={() => send('REQUEST_WALK')}>WALK</button>
        <pre>{JSON.stringify(state.value, null, 2)}</pre>

        <div className="street traffic horizontal">
          <div className="centerline"></div>

          <div className="street crossing">
            <div className="stripe"></div>
            <div className="stripe"></div>
            <div className="stripe"></div>
            <div className="stripe"></div>
            <div className="stripe"></div>
            <div className="stripe"></div>
            <div className="stripe"></div>
          </div>
          <div className="traffic-light" id="trafficSign">
            <div className={`light ${state.matches({ trafficSign: 'red' }) ? 'red' : '' }`}></div>
            <div className={`light ${state.matches({ trafficSign: 'yellow' }) ? 'yellow' : '' }`}></div>
            <div className={`light ${state.matches({ trafficSign: 'green' }) ? 'green' : '' }`}></div>
          </div>
        </div>

        <div className="street traffic vertical">
          <div className="centerline"></div>
        </div>

        <div className="street pedestrian">
          <div className="centerline"></div>
          <div className="traffic-light" id="pedestrianSign">
            <div className={`light ${state.matches({ pedestrianSign: 'red' }) ? 'red' : '' }`}></div>
            <div className={`light ${state.matches({ pedestrianSign: 'green' }) ? 'green' : '' }`}></div>
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <main className="">
        <LightCrossing />
      </main>
    </div>
  );
}

export default App;
