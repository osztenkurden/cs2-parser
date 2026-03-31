import { BinaryReader } from '@bufbuild/protobuf/wire';

export class BinaryReaderEditable extends BinaryReader {
	override buf: Uint8Array;
	override len: number;
	constructor(buf: Uint8Array) {
		super(buf);
		this.buf = buf;
		this.len = buf.length;
		this.pos = 0;
		(this as any).view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
	}
	setTo(buf: Uint8Array) {
		this.buf = buf;
		this.len = buf.length;
		this.pos = 0;
		const newView = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
		(this as any).view = newView;
	}
}
