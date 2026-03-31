import type { BitBuffer } from '../ubitreader.js';

export type FieldPath = {
	path: [number, number, number, number, number, number, number];
	last: number;
};

export const popSpecial = (fieldPath: FieldPath, n: number) => {
	for (let i = 0; i < n; i++) {
		fieldPath.path[fieldPath.last] = 0;
		fieldPath.last--;
	}
};

export function doOp(opcode: number, bitreader: BitBuffer, fieldPath: FieldPath) {
	switch (opcode) {
		case 0:
			return plusOne(bitreader, fieldPath);
		case 1:
			return plusTwo(bitreader, fieldPath);
		case 2:
			return plusThree(bitreader, fieldPath);
		case 3:
			return plusFour(bitreader, fieldPath);
		case 4:
			return plusN(bitreader, fieldPath);
		case 5:
			return pushOneLeftDeltaZeroRightZero(bitreader, fieldPath);
		case 6:
			return pushOneLeftDeltaZeroRightNonZero(bitreader, fieldPath);
		case 7:
			return pushOneLeftDeltaOneRightZero(bitreader, fieldPath);
		case 8:
			return pushOneLeftDeltaOneRightNonZero(bitreader, fieldPath);
		case 9:
			return pushOneLeftDeltaNRightZero(bitreader, fieldPath);
		case 10:
			return pushOneLeftDeltaNRightNonZero(bitreader, fieldPath);
		case 11:
			return pushOneLeftDeltaNRightNonZeroPack6Bits(bitreader, fieldPath);
		case 12:
			return pushOneLeftDeltaNRightNonZeroPack8Bits(bitreader, fieldPath);
		case 13:
			return pushTwoLeftDeltaZero(bitreader, fieldPath);
		case 14:
			return pushTwoPack5LeftDeltaZero(bitreader, fieldPath);
		case 15:
			return pushThreeLeftDeltaZero(bitreader, fieldPath);
		case 16:
			return pushThreePack5LeftDeltaZero(bitreader, fieldPath);
		case 17:
			return pushTwoLeftDeltaOne(bitreader, fieldPath);
		case 18:
			return pushTwoPack5LeftDeltaOne(bitreader, fieldPath);
		case 19:
			return pushThreeLeftDeltaOne(bitreader, fieldPath);
		case 20:
			return pushThreePack5LeftDeltaOne(bitreader, fieldPath);
		case 21:
			return pushTwoLeftDeltaN(bitreader, fieldPath);
		case 22:
			return pushTwoPack5LeftDeltaN(bitreader, fieldPath);
		case 23:
			return pushThreeLeftDeltaN(bitreader, fieldPath);
		case 24:
			return pushThreePack5LeftDeltaN(bitreader, fieldPath);
		case 25:
			return pushN(bitreader, fieldPath);
		case 26:
			return pushNAndNonTopological(bitreader, fieldPath);
		case 27:
			return popOnePlusOne(bitreader, fieldPath);
		case 28:
			return popOnePlusN(bitreader, fieldPath);
		case 29:
			return popAllButOnePlusOne(bitreader, fieldPath);
		case 30:
			return popAllButOnePlusN(bitreader, fieldPath);
		case 31:
			return popAllButOnePlusNPack3Bits(bitreader, fieldPath);
		case 32:
			return popAllButOnePlusNPack6Bits(bitreader, fieldPath);
		case 33:
			return popNPlusOne(bitreader, fieldPath);
		case 34:
			return popNPlusN(bitreader, fieldPath);
		case 35:
			return popNAndNonTopographical(bitreader, fieldPath);
		case 36:
			return nonTopoComplex(bitreader, fieldPath);
		case 37:
			return nonTopoPenultimatePlusOne(bitreader, fieldPath);
		case 38:
			return nonTopoComplexPack4Bits(bitreader, fieldPath);
		case 39:
			return;
		default:
			throw 'PathError.GenericPathOpError';
	}
}

// Plus operations
function plusOne(_: BitBuffer, fieldPath: FieldPath) {
	fieldPath.path[fieldPath.last]! += 1;
}

function plusTwo(_: BitBuffer, fieldPath: FieldPath) {
	fieldPath.path[fieldPath.last]! += 2;
}

function plusThree(_: BitBuffer, fieldPath: FieldPath) {
	fieldPath.path[fieldPath.last]! += 3;
}

function plusFour(_: BitBuffer, fieldPath: FieldPath) {
	fieldPath.path[fieldPath.last]! += 4;
}

function plusN(bitreader: BitBuffer, fieldPath: FieldPath) {
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp() + 5;
}

// Push operations
function pushOneLeftDeltaZeroRightZero(_: BitBuffer, fieldPath: FieldPath) {
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last] = 0;
}

function pushOneLeftDeltaZeroRightNonZero(bitreader: BitBuffer, fieldPath: FieldPath) {
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp();
}

function pushOneLeftDeltaOneRightZero(_: BitBuffer, fieldPath: FieldPath) {
	fieldPath.path[fieldPath.last]! += 1;
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last] = 0;
}

function pushOneLeftDeltaOneRightNonZero(bitreader: BitBuffer, fieldPath: FieldPath) {
	fieldPath.path[fieldPath.last]! += 1;
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last] = bitreader.readUbitVarFp();
}

function pushOneLeftDeltaNRightZero(bitreader: BitBuffer, fieldPath: FieldPath) {
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp();
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last] = 0;
}

function pushOneLeftDeltaNRightNonZero(bitreader: BitBuffer, fieldPath: FieldPath) {
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp() + 2;
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last] = bitreader.readUbitVarFp() + 1;
}

function pushOneLeftDeltaNRightNonZeroPack6Bits(bitreader: BitBuffer, fieldPath: FieldPath) {
	fieldPath.path[fieldPath.last]! += bitreader.ReadUBits(3) + 2;
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last] = bitreader.ReadUBits(3) + 1;
}

function pushOneLeftDeltaNRightNonZeroPack8Bits(bitreader: BitBuffer, fieldPath: FieldPath) {
	fieldPath.path[fieldPath.last]! += bitreader.ReadUBits(4) + 2;
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last] = bitreader.ReadUBits(4) + 1;
}

function pushTwoLeftDeltaZero(bitreader: BitBuffer, fieldPath: FieldPath) {
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp();
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp();
}

function pushTwoPack5LeftDeltaZero(bitreader: BitBuffer, fieldPath: FieldPath) {
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last] = bitreader.ReadUBits(5);
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last] = bitreader.ReadUBits(5);
}

function pushThreeLeftDeltaZero(bitreader: BitBuffer, fieldPath: FieldPath) {
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp();
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp();
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp();
}

function pushThreePack5LeftDeltaZero(bitreader: BitBuffer, fieldPath: FieldPath) {
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last] = bitreader.ReadUBits(5);
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last] = bitreader.ReadUBits(5);
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last] = bitreader.ReadUBits(5);
}

function pushTwoLeftDeltaOne(bitreader: BitBuffer, fieldPath: FieldPath) {
	fieldPath.path[fieldPath.last]! += 1;
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp();
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp();
}

function pushTwoPack5LeftDeltaOne(bitreader: BitBuffer, fieldPath: FieldPath) {
	fieldPath.path[fieldPath.last]! += 1;
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.ReadUBits(5);
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.ReadUBits(5);
}

function pushThreeLeftDeltaOne(bitreader: BitBuffer, fieldPath: FieldPath) {
	fieldPath.path[fieldPath.last]! += 1;
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp();
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp();
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp();
}

function pushThreePack5LeftDeltaOne(bitreader: BitBuffer, fieldPath: FieldPath) {
	fieldPath.path[fieldPath.last]! += 1;
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.ReadUBits(5);
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.ReadUBits(5);
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.ReadUBits(5);
}

function pushTwoLeftDeltaN(bitreader: BitBuffer, fieldPath: FieldPath) {
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVar() + 2;
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp();
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp();
}

function pushTwoPack5LeftDeltaN(bitreader: BitBuffer, fieldPath: FieldPath) {
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVar() + 2;
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.ReadUBits(5);
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.ReadUBits(5);
}

function pushThreeLeftDeltaN(bitreader: BitBuffer, fieldPath: FieldPath) {
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVar() + 2;
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp();
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp();
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp();
}

function pushThreePack5LeftDeltaN(bitreader: BitBuffer, fieldPath: FieldPath) {
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVar() + 2;
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.ReadUBits(5);
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.ReadUBits(5);
	fieldPath.last += 1;
	fieldPath.path[fieldPath.last]! += bitreader.ReadUBits(5);
}

function pushN(bitreader: BitBuffer, fieldPath: FieldPath) {
	const n = bitreader.readUbitVar();
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVar();
	for (let i = 0; i < n; i++) {
		fieldPath.last += 1;
		fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp();
	}
}

function pushNAndNonTopological(bitreader: BitBuffer, fieldPath: FieldPath) {
	for (let i = 0; i < fieldPath.last + 1; i++) {
		if (bitreader.readBoolean()) {
			fieldPath.path[i]! += bitreader.readVarInt32() + 1;
		}
	}
	const count = bitreader.readUbitVar();
	for (let i = 0; i < count; i++) {
		fieldPath.last += 1;
		fieldPath.path[fieldPath.last] = bitreader.readUbitVarFp();
	}
}

// Pop operations
function popOnePlusOne(_: BitBuffer, fieldPath: FieldPath) {
	popSpecial(fieldPath, 1);
	fieldPath.path[fieldPath.last]! += 1;
}

function popOnePlusN(bitreader: BitBuffer, fieldPath: FieldPath) {
	popSpecial(fieldPath, 1);
	fieldPath.path[fieldPath.last]! += bitreader.readUbitVarFp() + 1;
}

function popAllButOnePlusOne(_: BitBuffer, fieldPath: FieldPath) {
	popSpecial(fieldPath, fieldPath.last);
	fieldPath.path[0] += 1;
}

function popAllButOnePlusN(bitreader: BitBuffer, fieldPath: FieldPath) {
	popSpecial(fieldPath, fieldPath.last);
	fieldPath.path[0] += bitreader.readUbitVarFp() + 1;
}

function popAllButOnePlusNPack3Bits(bitreader: BitBuffer, fieldPath: FieldPath) {
	popSpecial(fieldPath, fieldPath.last);
	fieldPath.path[0] += bitreader.ReadUBits(3) + 1;
}

function popAllButOnePlusNPack6Bits(bitreader: BitBuffer, fieldPath: FieldPath) {
	popSpecial(fieldPath, fieldPath.last);
	fieldPath.path[0] += bitreader.ReadUBits(6) + 1;
}

function popNPlusOne(bitreader: BitBuffer, fieldPath: FieldPath) {
	popSpecial(fieldPath, bitreader.readUbitVarFp());
	fieldPath.path[fieldPath.last]! += 1;
}

function popNPlusN(bitreader: BitBuffer, fieldPath: FieldPath) {
	popSpecial(fieldPath, bitreader.readUbitVarFp());
	fieldPath.path[fieldPath.last]! += bitreader.readVarInt32();
}

function popNAndNonTopographical(bitreader: BitBuffer, fieldPath: FieldPath) {
	popSpecial(fieldPath, bitreader.readUbitVarFp());
	for (let i = 0; i < fieldPath.last + 1; i++) {
		if (bitreader.readBoolean()) {
			fieldPath.path[i]! += bitreader.readVarInt32();
		}
	}
}

// Non-topological operations
function nonTopoComplex(bitreader: BitBuffer, fieldPath: FieldPath) {
	for (let i = 0; i < fieldPath.last + 1; i++) {
		if (bitreader.readBoolean()) {
			const val = bitreader.readVarInt32();
			fieldPath.path[i]! += val;
		}
	}
}

function nonTopoPenultimatePlusOne(_: BitBuffer, fieldPath: FieldPath) {
	fieldPath.path[fieldPath.last - 1]! += 1;
}

function nonTopoComplexPack4Bits(bitreader: BitBuffer, fieldPath: FieldPath) {
	for (let i = 0; i < fieldPath.last + 1; i++) {
		if (bitreader.readBoolean()) {
			fieldPath.path[i]! += bitreader.ReadUBits(4) - 7;
		}
	}
}
