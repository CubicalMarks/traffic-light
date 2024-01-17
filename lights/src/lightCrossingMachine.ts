import { createMachine, send, assign } from 'xstate';

export const lightCrossingMachine = createMachine({
  id: 'lightCrossingMachine',
  context: {
    walkRequested: false,
  },
  type: 'parallel',
  states: {
    trafficControl: {
      initial: 'stopped',
      on: {
        START_TRAFFIC: '.traffic',
        STOP_TRAFFIC: '.stopped'
      },
      states: {
        stopped: {
          after: { 
            0: [ 
              { target: 'waiting', cond: 'walkRequested', actions: send('WALK') },
              { target: 'waiting' }
            ]
          }
        },
        waiting: {
          on: {
            REQUEST_WALK: 'stopped'
          },
          after: {
            10000: [
              { target: 'traffic', cond: 'allowTraffic' },
              { target: 'stopped' }
            ]
          }
        },
        traffic: {
          after: {
            1000: { 
              target: '..yellow',
              actions: send('TRAFFIC') 
            }
          }
        },
      }
    },
    pedestrianControl: {
      initial: 'waiting',
      on: {
        TRAFFIC: {
          target: '.waiting',
          actions: assign({walkRequested: false})
        }
      },
      states: {
        waiting: {
          on: { 
            REQUEST_WALK: {
              target: 'walkRequested',
              actions: assign({ walkRequested: true })
            } 
          }
        },
        walkRequested: {}
      }
    },
    trafficSign: {
      initial: 'red',
      on: {
        STOP_TRAFFIC: '.red',
        TRAFFIC: '.yellow'
      },
      states: {
        red: {},
        yellow: {
          after: {
            1500: { target: 'green' }
          }
        },
        green: {
          after: {
            10000: { actions: send('STOP_TRAFFIC') },  
          },
        }
      }
    },
    pedestrianSign: {
      initial: 'red',
      on: {
        TRAFFIC: '.red'
      },
      states: {
        red: {
          on: {
            WALK: { 
              target: [ 'green' ],
              actions: send( 'STOP_TRAFFIC' )
            },
          },

        },
        green: {
          after: {
            25000: { 
              target: [ 'red' ],
              actions: send('START_TRAFFIC')
            }
          }
        },
      }
    },
  },
},
{
  guards: {
    walkRequested: (context) => context.walkRequested === true,
    allowTraffic: (context) => context.walkRequested === false,
  }
});
