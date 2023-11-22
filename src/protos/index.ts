import protobuf from 'protobufjs';

export const Party = new protobuf.Type('Party')
  .add(new protobuf.Field('message', 1, 'string'))
  .add(new protobuf.Field('address', 2, 'string'));
