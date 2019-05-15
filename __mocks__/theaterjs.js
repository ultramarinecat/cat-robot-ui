let actor, el; // eslint-disable-line one-var

const theatre = () => ({
  addActor: jest.fn((name, speed, selector) => {
    actor = `${name}:`;
    el = document.querySelector(selector);
  }),
  addScene: jest.fn(text => {
    el.innerHTML = text.slice(actor.length);
  })
});

module.exports = theatre;
