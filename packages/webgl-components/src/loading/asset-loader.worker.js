function onMessage(event) {
  switch (event.data.type) {
    case value:
      break;

    default:
      break;
  }

  console.log(event);
  worker.postMessage({ a: 1 });
}

self.addEventListener('message', onMessage);
