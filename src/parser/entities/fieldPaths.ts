import { doOp, type FieldPath } from './fieldPathOps.js';
import type { EntityParser } from './entityParser.js';
import type { BitBuffer } from '../ubitreader.js';

// Constants
const STOP_READING_SYMBOL = 39;
const HUFFMAN_CODE_MAXLEN = 17;
const LUT_SIZE = 1 << HUFFMAN_CODE_MAXLEN; // 131072

interface TreeNode {
	value: number;
	weight: number;
	left: TreeNode | null;
	right: TreeNode | null;
	leaf: boolean;
}
function compareTreeNodes(a: TreeNode, b: TreeNode) {
	if (a.weight === b.weight) {
		return b.value - a.value; // Larger value comes first when weights are equal
	} else {
		return a.weight - b.weight; // Smaller weight comes first
	}
}
function getTree(freq: [number, number][]): TreeNode {
	const nodes: TreeNode[] = [];

	for (const [value, weight] of freq) {
		nodes.push({
			value,
			weight: weight === 0 ? 1 : weight,
			left: null,
			right: null,
			leaf: true
		});
	}
	let n = nodes.length;

	while (nodes.length > 1) {
		nodes.sort(compareTreeNodes);

		const left = nodes.shift()!;
		const right = nodes.shift()!;

		const parent: TreeNode = {
			value: n,
			weight: left?.weight + right?.weight,
			left,
			right,
			leaf: false
		};

		nodes.push(parent);
		n++;
	}

	return nodes[0]!;
}

const getHuffmanTree = () => {
	const fieldPathTable = [
		36271, 10334, 1375, 646, 4128, 35, 3, 521, 2942, 560, 471, 10530, 251, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		310, 2, 0, 1837, 149, 300, 634, 0, 0, 1, 76, 271, 99, 25474
	];
	const freq = [] as [number, number][];

	fieldPathTable.forEach((weight, index) => {
		freq[index] = [index, weight];
	});

	return getTree(freq);
};

const huffmanTree = getHuffmanTree();

// Build Huffman lookup table at module init
const huffmanSymbol = new Uint8Array(LUT_SIZE);
const huffmanLength = new Uint8Array(LUT_SIZE);

function buildLUT(node: TreeNode, code: number, depth: number) {
	if (node.leaf) {
		const count = 1 << (HUFFMAN_CODE_MAXLEN - depth);
		for (let i = 0; i < count; i++) {
			const idx = code | (i << depth);
			huffmanSymbol[idx] = node.value;
			huffmanLength[idx] = depth;
		}
		return;
	}
	buildLUT(node.left!, code, depth + 1);
	buildLUT(node.right!, code | (1 << depth), depth + 1);
}
buildLUT(huffmanTree, 0, 0);

export const parsePaths = (reader: BitBuffer, entityParser: EntityParser) => {
	const fieldPath: FieldPath = {
		path: [-1, 0, 0, 0, 0, 0, 0],
		last: 0
	};
	let idx = 0;

	while (true) {
		const peeked = reader.PeekUBitsWithLog(HUFFMAN_CODE_MAXLEN);
		const symbol = huffmanSymbol[peeked]!;
		const codeLen = huffmanLength[peeked]!;
		reader.ReadUBits(codeLen);

		if (symbol === STOP_READING_SYMBOL) break;

		doOp(symbol, reader, fieldPath);

		entityParser.writeFp(fieldPath, idx);

		idx++;
	}
	return idx;
};
