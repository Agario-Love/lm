export var LZ4;
((LZ42) => {
  const MIN_MATCH = 4;
  const HASH_LOG = 16;
  const HASH_TABLE_SIZE = 1 << HASH_LOG;
  const HASH_SHIFT = MIN_MATCH * 8 - HASH_LOG;
  const HASH_MULTIPLIER = 2654435761;
  const MAX_INPUT_SIZE = 2113929216;
  const ML_BITS = 4;
  const ML_MASK = (1 << ML_BITS) - 1;
  const RUN_BITS = 8 - ML_BITS;
  const RUN_MASK = (1 << RUN_BITS) - 1;
  const COPY_LENGTH = 8;
  const MF_LIMIT = COPY_LENGTH + MIN_MATCH;
  const MIN_LENGTH = MF_LIMIT + 1;
  const SKIP_STRENGTH = 6;
  const imul = Math.imul || function(a, b) {
    const ah = a >>> 16 & 65535;
    const al = a & 65535;
    const bh = b >>> 16 & 65535;
    const bl = b & 65535;
    return al * bl + (ah * bl + al * bh << 16 >>> 0) | 0;
  };
  function compressBound(inputSize) {
    return inputSize > MAX_INPUT_SIZE ? 0 : inputSize + inputSize / 255 + 16 | 0;
  }
  LZ42.compressBound = compressBound;
  function uncompress(input, output) {
    let inputIdx = 0;
    let outputIdx = 0;
    const inputLen = input.length;
    const outputLen = output.length;
    while (inputIdx < inputLen) {
      const token = input[inputIdx++];
      let literalLen = token >> ML_BITS;
      if (literalLen === RUN_MASK) {
        let current = 255;
        while (current === 255 && inputIdx < inputLen) {
          current = input[inputIdx++];
          literalLen += current;
        }
      }
      if (outputIdx + literalLen > outputLen) {
        throw new Error(
          `Output buffer too small: expected at least ${outputIdx + literalLen}`
        );
      }
      if (inputIdx + literalLen > inputLen) {
        throw new Error("Malformed LZ4 block: literal length exceeds input");
      }
      output.set(input.subarray(inputIdx, inputIdx + literalLen), outputIdx);
      inputIdx += literalLen;
      outputIdx += literalLen;
      if (inputIdx === inputLen) {
        return outputIdx;
      }
      if (inputIdx + 2 > inputLen) {
        throw new Error("Malformed LZ4 block: missing offset");
      }
      const offset = input[inputIdx] | input[inputIdx + 1] << 8;
      inputIdx += 2;
      if (offset === 0) throw new Error("Malformed LZ4 block: offset is 0");
      let matchLen = token & ML_MASK;
      if (matchLen === ML_MASK) {
        let current = 255;
        while (current === 255 && inputIdx < inputLen) {
          current = input[inputIdx++];
          matchLen += current;
        }
      }
      matchLen += MIN_MATCH;
      if (outputIdx + matchLen > outputLen) {
        throw new Error("Output buffer too small for match");
      }
      let matchPos = outputIdx - offset;
      if (matchPos < 0) {
        throw new Error("Malformed LZ4 block: offset before start");
      }
      for (let i = 0; i < matchLen; i++) {
        output[outputIdx++] = output[matchPos++];
      }
    }
    return outputIdx;
  }
  LZ42.uncompress = uncompress;
  function compress(input, output) {
    const inputLen = input.length;
    const hashTable = new Int32Array(HASH_TABLE_SIZE).fill(0);
    let inputIdx = 0;
    let outputIdx = 0;
    let anchor = 0;
    if (inputLen >= MAX_INPUT_SIZE) throw new Error("Input too large");
    if (inputLen < MIN_LENGTH) {
      if (output.length < inputLen + 1) throw new Error("Output too small");
    }
    const limit = inputLen - MF_LIMIT;
    const matchLimit = inputLen - COPY_LENGTH;
    while (inputIdx < limit) {
      let forwardH;
      let matchIdx;
      let step = 1;
      let searchMatch = true;
      let nextInputIdx = inputIdx;
      while (searchMatch) {
        inputIdx = nextInputIdx;
        const diff = inputLen - MF_LIMIT - inputIdx;
        if (diff < 0) {
          searchMatch = false;
          break;
        }
        step = (step >>> SKIP_STRENGTH) + 1;
        nextInputIdx += step;
        if (nextInputIdx > limit) {
          searchMatch = false;
          inputIdx = limit;
          break;
        }
        const sequence = input[inputIdx] | input[inputIdx + 1] << 8 | input[inputIdx + 2] << 16 | input[inputIdx + 3] << 24;
        const hash = imul(sequence, HASH_MULTIPLIER) >>> HASH_SHIFT;
        matchIdx = hashTable[hash];
        hashTable[hash] = inputIdx;
        if (matchIdx < inputIdx && matchIdx >= 0 && // sanity check
        inputIdx - matchIdx < 65536 && // Offset must fit in 16 bits
        input[matchIdx] === input[inputIdx] && input[matchIdx + 1] === input[inputIdx + 1] && input[matchIdx + 2] === input[inputIdx + 2] && input[matchIdx + 3] === input[inputIdx + 3]) {
          searchMatch = false;
        }
      }
      if (inputIdx >= limit) break;
      const litLen2 = inputIdx - anchor;
      let token2 = litLen2 >= RUN_MASK ? RUN_MASK << ML_BITS : litLen2 << ML_BITS;
      let matchLen = 4;
      while (inputIdx + matchLen < matchLimit && input[inputIdx + matchLen] === input[matchIdx + matchLen]) {
        matchLen++;
      }
      matchLen -= MIN_MATCH;
      token2 |= matchLen >= ML_MASK ? ML_MASK : matchLen;
      output[outputIdx++] = token2;
      if (litLen2 >= RUN_MASK) {
        let len = litLen2 - RUN_MASK;
        while (len >= 255) {
          output[outputIdx++] = 255;
          len -= 255;
        }
        output[outputIdx++] = len;
      }
      output.set(input.subarray(anchor, anchor + litLen2), outputIdx);
      outputIdx += litLen2;
      const offset = inputIdx - matchIdx;
      output[outputIdx++] = offset & 255;
      output[outputIdx++] = offset >> 8 & 255;
      if (matchLen >= ML_MASK) {
        let len = matchLen - ML_MASK;
        while (len >= 255) {
          output[outputIdx++] = 255;
          len -= 255;
        }
        output[outputIdx++] = len;
      }
      inputIdx += matchLen + MIN_MATCH;
      anchor = inputIdx;
    }
    const litLen = inputLen - anchor;
    let token = litLen >= RUN_MASK ? RUN_MASK << ML_BITS : litLen << ML_BITS;
    output[outputIdx++] = token;
    if (litLen >= RUN_MASK) {
      let len = litLen - RUN_MASK;
      while (len >= 255) {
        output[outputIdx++] = 255;
        len -= 255;
      }
      output[outputIdx++] = len;
    }
    output.set(input.subarray(anchor, inputLen), outputIdx);
    outputIdx += litLen;
    return outputIdx;
  }
  LZ42.compress = compress;
})(LZ4 || (LZ4 = {}));
