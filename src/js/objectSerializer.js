// https://www.javaworld.com/article/2072752/the-java-serialization-algorithm-revealed.html
const STREAM_MAGIC = [0xAC, 0xED];
const STREAM_VERSION = [0x00, 0x05];
const TC_OBJECT = [0x73];
const TC_CLASSDESC = [0x72];
const SERIALIZABLE = [0x02];
const TC_ENDBLOCKDATA = [0x78];
const TC_NULL = [0x70];
const INT_CODE = [0x49];
const CHAR_CODE = [0x43];

function flatten( array ) {
  return array.reduce((acc, innerArray) => acc.concat(innerArray), []);
}

function fromSize(data, size) {
  const packet = Array.from(Buffer.alloc(size));
  const dataBuffer = Array.from(Buffer.from(data));

  for (let i = 0; i < size && i < dataBuffer.length; i++) {
    packet[size - 1 - i] = dataBuffer[dataBuffer.length - 1 - i];
  }

  return packet;
}

function int32ToBytes(i) {
  const buf = Buffer.alloc(4);
  buf.writeInt32BE(i);
  return Array.from(buf);
}

function int16ToBytes(i) {
  const buf = Buffer.alloc(2);
  buf.writeInt16BE(i);
  return Array.from(buf);
}

function stringToBytes(str) {
  return Array.from(Buffer.from(str));
}

function getType(value) {
  if( typeof value === 'number' && isFinite(value) ) {
    return INT_CODE;
  } else if( typeof value === 'string' || value instanceof String ) {
    if( value.length === 1 ) {
      return CHAR_CODE;
    }
  }
}

function serializeField(value) {
  const type = getType(value);
  if(type === INT_CODE) {
    return int32ToBytes(value);
  } else {
    return [];
  }
}

function serializeFieldMeta(fields) {
  const serializedFieldMeta = Object.keys(fields)
    .map(key => ({ name: key, type: getType(fields[key]) }))
    .reduce((acc, field) => acc.concat(
      field.type,
      int16ToBytes(field.name.length),
      stringToBytes(field.name)
    ), []);
  return serializedFieldMeta;
}

function serializeFieldValues(fields) {
  return flatten(Object.keys(fields).map(key => serializeField(fields[key])))
}

module.exports = ( obj ) => {
  /*
obj = {
  name: "ClassName",
  id: 1,
  fields: {
    key: "value"
  }
}
  */
  const data = [
    STREAM_MAGIC,
    STREAM_VERSION,
    TC_OBJECT,
    TC_CLASSDESC,
    int16ToBytes(obj.name.length),
    stringToBytes(obj.name),
    fromSize(int32ToBytes(obj.id), 8),
    SERIALIZABLE,
    int16ToBytes(Object.keys(obj.fields).length),
    serializeFieldMeta(obj.fields),
    TC_ENDBLOCKDATA,
    TC_NULL,
    serializeFieldValues(obj.fields)
  ];
  return Buffer.from(flatten(data));
};
