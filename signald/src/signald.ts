#!/usr/bin/env node

import { cwd, exit } from 'process';
import { execSync } from 'child_process';
import { sleep } from './shared/utils/sleep';
import { mqttBroker } from './lib/mqttbroker';

console.log("Starting Signal Daemon");

require('daemonize-process')();

const handleStop = async (signal:string) => {
  const message = `${signal} signal received, stopping process`;
  console.log(message);
  exit(0);
};

const handleRestart = async(signal:string) => {
  const message = `${signal} signal received, reloading process`;
  console.log(message);
  ; // Reload logic here
}

process.on('SIGINT', () => handleStop('SIGINT'));
process.on('SIGTERM', () => handleStop('SIGTERM'));
process.on('SIGQUIT', () => handleStop('SIGQUIT'));
process.on('SIGHUP', () => handleRestart('SIGHUP'));

const run = async () => {
  const mqtt = mqttBroker(8888);
  await sleep(1000);
}

run();
