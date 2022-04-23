import protobuf from "protobufjs";

const HelloWorldMessage = new protobuf.Type("HelloWorldMessage")
	.add(new protobuf.Field("timestamp", 1, "uint64"))
	.add(new protobuf.Field("text", 2, "string"));

export default HelloWorldMessage;
