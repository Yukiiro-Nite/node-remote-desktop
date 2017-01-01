const typeMap = {
  mousemove: {
    name: "MouseMoveEvent",
    id: 10,
    fields: {
      x: 0,
      y: 0
    }
  },
  mousedown: {
    name: "MouseDownEvent",
    id: 11,
    fields: {
      x: 0,
      y: 0,
      key: 0
    }
  },
  mouseup: {
    name: "MouseUpEvent",
    id: 12,
    fields: {
      x: 0,
      y: 0,
      key: 0
    }
  },
  keydown: {
    name: "KeyDownEvent",
    id: 13,
    fields: {
      key: 0
    }
  },
  keyup: {
    name: "KeyUpEvent",
    id: 14,
    fields: {
      key: 0
    }
  }
}

module.exports = event => {
  const action = typeMap[event.type];
  Object.keys(action.fields).forEach(key => {
    action.fields[key] = event[key];
  })
  return action;
}
