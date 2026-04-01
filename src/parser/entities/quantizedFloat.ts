import type { BitBuffer } from '../ubitreader.js';

export const qfMapper = {
	idx: 0,
	map: {} as Record<number, QuantalizedFloat>
};

export type QuantalizedFloat = {
	low: number;
	high: number;
	high_low_mul: number;
	dec_mul: number;
	offset: number;
	bit_count: number;
	flags: number;
	no_scale: boolean;
};

const QFF_ROUNDDOWN = 1 << 0;
const QFF_ROUNDUP = 1 << 1;
const QFF_ENCODE_ZERO = 1 << 2;
const QFF_ENCODE_INTEGERS = 1 << 3;

export const getQuantalizedFloat = (
	bitcount: number,
	flags?: number,
	low_value?: number,
	high_value?: number
): QuantalizedFloat => {
	const qf: QuantalizedFloat = {
		no_scale: false,
		bit_count: bitcount,
		dec_mul: 0.0,
		low: 0.0,
		high: 0.0,
		high_low_mul: 0.0,
		offset: 0.0,
		flags: 0
	};

	if (bitcount == 0 || bitcount >= 32) {
		qf.no_scale = true;
		qf.bit_count = 32;
		return qf;
	}

	qf.bit_count = bitcount;
	if (low_value !== undefined) {
		qf.low = low_value;
	}

	if (high_value !== undefined) {
		qf.high = high_value;
	}

	if (flags !== undefined) {
		qf.flags = flags;
		validateFlags(qf);
	}

	let steps = 1 << qf.bit_count;

	if ((qf.flags & QFF_ROUNDDOWN) != 0) {
		const range = qf.high - qf.low;
		qf.offset = range / steps;
		qf.high -= qf.offset;
	} else if ((qf.flags & QFF_ROUNDUP) != 0) {
		const range = qf.high - qf.low;
		qf.offset = range / steps;
		qf.low += qf.offset;
	}

	if ((qf.flags & QFF_ENCODE_INTEGERS) != 0) {
		let delta = qf.high - qf.low;
		if (delta < 1.0) {
			delta = 1.0;
		}
		const delta_log2 = Math.ceil(Math.log2(delta));
		const range_2 = 1 << delta_log2;
		let bit_count = qf.bit_count;

		while (1 << bit_count <= range_2) {
			bit_count += 1;
		}

		if (bit_count > qf.bit_count) {
			qf.bit_count = bit_count;
			steps = 1 << qf.bit_count;
		}

		qf.offset = range_2 / steps;
		qf.high = qf.low + (range_2 - qf.offset);
	}

	assignMultipliers(qf, steps);

	if ((qf.flags & QFF_ROUNDDOWN) != 0) {
		if (quantize(qf, qf.low) == qf.low) {
			qf.flags &= ~QFF_ROUNDDOWN;
		}
	}
	if ((qf.flags & QFF_ROUNDUP) != 0) {
		if (quantize(qf, qf.high) == qf.high) {
			qf.flags &= ~QFF_ROUNDUP;
		}
	}
	if ((qf.flags & QFF_ENCODE_ZERO) != 0) {
		if (quantize(qf, 0.0) == 0.0) {
			qf.flags &= ~QFF_ENCODE_ZERO;
		}
	}

	return qf;
};

const assignMultipliers = (qf: QuantalizedFloat, steps: number) => {
	qf.high_low_mul = 0.0;
	const range = qf.high - qf.low;

	const high: number = qf.bit_count === 32 ? 0xfffffffe : (1 << qf.bit_count) - 1;

	let high_mul: number = Math.abs(range) <= 0.0 ? high : high / range;

	if (high_mul * range > high || high_mul * range > high) {
		const multipliers = [0.9999, 0.99, 0.9, 0.8, 0.7];
		for (const multiplier of multipliers) {
			high_mul = (high / range) * multiplier;
			if (high_mul * range > high || high_mul * range > high) {
				continue;
			}
			break;
		}
	}

	qf.high_low_mul = high_mul;
	qf.dec_mul = 1.0 / (steps - 1);
};
const quantize = (qf: QuantalizedFloat, val: number) => {
	if (val < qf.low) {
		return qf.low;
	}
	if (val > qf.high) {
		return qf.high;
	}
	const i = Math.floor((val - qf.low) * qf.high_low_mul);
	return qf.low + (qf.high - qf.low) * (i * qf.dec_mul);
};
const validateFlags = (qf: QuantalizedFloat) => {
	if (qf.flags === 0) {
		return;
	}

	if ((qf.low === 0.0 && (qf.flags & QFF_ROUNDDOWN) !== 0) || (qf.high === 0.0 && (qf.flags & QFF_ROUNDUP) !== 0)) {
		qf.flags &= ~QFF_ENCODE_ZERO;
	}

	if (qf.low === 0.0 && (qf.flags & QFF_ENCODE_ZERO) !== 0) {
		qf.flags |= QFF_ROUNDDOWN;
		qf.flags &= ~QFF_ENCODE_ZERO;
	}

	if (qf.high === 0.0 && (qf.flags & QFF_ENCODE_ZERO) !== 0) {
		qf.flags |= QFF_ROUNDUP;
		qf.flags &= ~QFF_ENCODE_ZERO;
	}

	if (qf.low > 0.0 || qf.high < 0.0) {
		qf.flags &= ~QFF_ENCODE_ZERO;
	}

	if ((qf.flags & QFF_ENCODE_INTEGERS) !== 0) {
		qf.flags &= ~(QFF_ROUNDUP | QFF_ROUNDDOWN | QFF_ENCODE_ZERO);
	}
};

export const decodeQfloat = (reader: BitBuffer, qfIndex: number) => {
	const qf = qfMapper.map[qfIndex];

	if (!qf) throw 'QF NOT FOUND';
	if ((qf.flags & QFF_ROUNDDOWN) !== 0 && reader.readBoolean()) {
		return qf.low;
	}

	if ((qf.flags & QFF_ROUNDUP) !== 0 && reader.readBoolean()) {
		return qf.high;
	}

	if ((qf.flags & QFF_ENCODE_ZERO) !== 0 && reader.readBoolean()) {
		return 0;
	}
	const bits = reader.ReadUBits(qf.bit_count);

	return qf.low + (qf.high - qf.low) * bits * qf.dec_mul;
};
