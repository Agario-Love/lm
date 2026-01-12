/**
 * LZ4 Compression/Decompression for TypeScript.
 *
 * Reconstructed from the core logic of the LZ4 JS implementation.
 * Removes dependencies on Node.js Buffers/Streams for universal compatibility.
 */

export namespace LZ4 {
  // =========================================================================
  // CONSTANTS
  // =========================================================================

  const MIN_MATCH = 4;
  const HASH_LOG = 16;
  const HASH_TABLE_SIZE = 1 << HASH_LOG;
  const HASH_SHIFT = (MIN_MATCH * 8) - HASH_LOG;
  const HASH_MULTIPLIER = 2654435761;

  const MAX_INPUT_SIZE = 0x7E000000;

  // LZ4 format specific constants
  const ML_BITS = 4;
  const ML_MASK = (1 << ML_BITS) - 1;
  const RUN_BITS = 8 - ML_BITS;
  const RUN_MASK = (1 << RUN_BITS) - 1;

  const COPY_LENGTH = 8;
  const MF_LIMIT = COPY_LENGTH + MIN_MATCH;
  const MIN_LENGTH = MF_LIMIT + 1;
  const SKIP_STRENGTH = 6;

  // =========================================================================
  // HELPER FUNCTIONS
  // =========================================================================

  /**
   * integer multiplication polyfill for older environments,
   * though mostly standard in modern JS engines.
   */
  const imul = Math.imul || function (a: number, b: number) {
    const ah = (a >>> 16) & 0xffff;
    const al = a & 0xffff;
    const bh = (b >>> 16) & 0xffff;
    const bl = b & 0xffff;
    return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0);
  };

  /**
   * Calculates the max size of the compressed output to ensure buffer allocation.
   */
  export function compressBound(inputSize: number): number {
    return (inputSize > MAX_INPUT_SIZE)
      ? 0
      : (inputSize + (inputSize / 255) + 16) | 0;
  }

  // =========================================================================
  // DECOMPRESSION (Uncompress)
  // =========================================================================

  /**
   * Decompresses an LZ4 block.
   * @param input The compressed data.
   * @param output The buffer to write uncompressed data to.
   * @returns The number of bytes written to the output.
   */
  export function uncompress(input: Uint8Array, output: Uint8Array): number {
    let inputIdx = 0;
    let outputIdx = 0;
    const inputLen = input.length;
    const outputLen = output.length;

    while (inputIdx < inputLen) {
      const token = input[inputIdx++];

      // --- Literal Section ---
      let literalLen = token >> ML_BITS;

      // If literal length is 15 (max for 4 bits), read more bytes
      if (literalLen === RUN_MASK) {
        let current = 255;
        while ((current === 255) && (inputIdx < inputLen)) {
          current = input[inputIdx++];
          literalLen += current;
        }
      }

      // Bounds check
      if (outputIdx + literalLen > outputLen) {
        throw new Error(
          `Output buffer too small: expected at least ${
            outputIdx + literalLen
          }`,
        );
      }
      if (inputIdx + literalLen > inputLen) {
        throw new Error("Malformed LZ4 block: literal length exceeds input");
      }

      // Copy Literals
      // Note: for very small copies, a loop might be faster, but set() is cleaner.
      output.set(input.subarray(inputIdx, inputIdx + literalLen), outputIdx);
      inputIdx += literalLen;
      outputIdx += literalLen;

      // If we are at the end of the input, we are done
      if (inputIdx === inputLen) {
        return outputIdx;
      }

      // --- Match Section ---

      // Read offset (16-bit little endian)
      if (inputIdx + 2 > inputLen) {
        throw new Error("Malformed LZ4 block: missing offset");
      }
      const offset = input[inputIdx] | (input[inputIdx + 1] << 8);
      inputIdx += 2;

      if (offset === 0) throw new Error("Malformed LZ4 block: offset is 0");

      // Match length
      let matchLen = token & ML_MASK;
      if (matchLen === ML_MASK) {
        let current = 255;
        while ((current === 255) && (inputIdx < inputLen)) {
          current = input[inputIdx++];
          matchLen += current;
        }
      }
      matchLen += MIN_MATCH; // Implicit length

      // Bounds check
      if (outputIdx + matchLen > outputLen) {
        throw new Error("Output buffer too small for match");
      }

      // Copy Match
      // We cannot use output.set() easily here because the match might overlap
      // with the current write position (e.g. RLE), so we must copy byte-by-byte
      // or use copyWithin logic carefully.
      let matchPos = outputIdx - offset;
      if (matchPos < 0) {
        throw new Error("Malformed LZ4 block: offset before start");
      }

      // Optimized copy for non-overlapping vs overlapping
      // For LZ4, overlapping matches (repeating patterns) are common.
      for (let i = 0; i < matchLen; i++) {
        output[outputIdx++] = output[matchPos++];
      }
    }

    return outputIdx;
  }

  // =========================================================================
  // COMPRESSION (Compress)
  // =========================================================================

  /**
   * Compresses data into LZ4 block format.
   * @param input The raw data.
   * @param output The buffer to write compressed data to.
   * @returns The size of the compressed data.
   */
  export function compress(input: Uint8Array, output: Uint8Array): number {
    const inputLen = input.length;
    const hashTable = new Int32Array(HASH_TABLE_SIZE).fill(0);

    let inputIdx = 0;
    let outputIdx = 0;
    let anchor = 0;

    if (inputLen >= MAX_INPUT_SIZE) throw new Error("Input too large");

    // If input is too small, just emit literals
    if (inputLen < MIN_LENGTH) {
      // Token: Literal length = inputLen, Match length = 0
      if (output.length < inputLen + 1) throw new Error("Output too small");

      // Write Token
      // We assume small inputs don't need multi-byte lengths for this check
      // typically, but let's do it properly via a goto-like structure or specialized helper.
      // For simplicity in this port, we fall through to the literal logic if we can't compress.
    }

    const limit = inputLen - MF_LIMIT;
    const matchLimit = inputLen - COPY_LENGTH; // Last few bytes must be literals

    // Main Loop
    while (inputIdx < limit) {
      let forwardH: number;
      let matchIdx: number;

      // Find a match
      let step = 1;
      let searchMatch = true;
      let nextInputIdx = inputIdx;

      while (searchMatch) {
        inputIdx = nextInputIdx;
        const diff = inputLen - MF_LIMIT - inputIdx;

        if (diff < 0) {
          searchMatch = false;
          break; // break to emit remaining literals
        }

        step = (step >>> SKIP_STRENGTH) + 1;
        nextInputIdx += step;

        if (nextInputIdx > limit) {
          searchMatch = false;
          inputIdx = limit; // Stop and emit remainder
          break;
        }

        // Hash current sequence
        const sequence = input[inputIdx] | (input[inputIdx + 1] << 8) |
          (input[inputIdx + 2] << 16) | (input[inputIdx + 3] << 24);
        const hash = imul(sequence, HASH_MULTIPLIER) >>> HASH_SHIFT;

        matchIdx = hashTable[hash];
        hashTable[hash] = inputIdx;

        // Check if valid match found
        if (
          matchIdx < inputIdx &&
          matchIdx >= 0 && // sanity check
          (inputIdx - matchIdx) < 65536 && // Offset must fit in 16 bits
          input[matchIdx] === input[inputIdx] &&
          input[matchIdx + 1] === input[inputIdx + 1] &&
          input[matchIdx + 2] === input[inputIdx + 2] &&
          input[matchIdx + 3] === input[inputIdx + 3]
        ) {
          searchMatch = false; // Found!
        }
      }

      // If we exited loop without match, we are near end
      if (inputIdx >= limit) break;

      // --- Encode Sequence ---

      // 1. Encode Literals (from anchor to inputIdx)
      const litLen = inputIdx - anchor;
      let token = litLen >= RUN_MASK
        ? (RUN_MASK << ML_BITS)
        : (litLen << ML_BITS);

      // We don't write token yet, need to check match length

      // Calculate Match Length
      // We already matched 4 bytes
      let matchLen = 4;
      while (
        inputIdx + matchLen < matchLimit &&
        input[inputIdx + matchLen] === input[matchIdx! + matchLen]
      ) {
        matchLen++;
      }

      matchLen -= MIN_MATCH; // Token stores length - 4

      // Combine token match part
      token |= matchLen >= ML_MASK ? ML_MASK : matchLen;

      // Write Token
      output[outputIdx++] = token;

      // Write Extended Literal Length
      if (litLen >= RUN_MASK) {
        let len = litLen - RUN_MASK;
        while (len >= 255) {
          output[outputIdx++] = 255;
          len -= 255;
        }
        output[outputIdx++] = len;
      }

      // Copy Literals
      output.set(input.subarray(anchor, anchor + litLen), outputIdx);
      outputIdx += litLen;

      // Write Offset (Little Endian)
      const offset = inputIdx - matchIdx!;
      output[outputIdx++] = offset & 0xff;
      output[outputIdx++] = (offset >> 8) & 0xff;

      // Write Extended Match Length
      if (matchLen >= ML_MASK) {
        let len = matchLen - ML_MASK;
        while (len >= 255) {
          output[outputIdx++] = 255;
          len -= 255;
        }
        output[outputIdx++] = len;
      }

      // Update State
      inputIdx += matchLen + MIN_MATCH;
      anchor = inputIdx;
    }

    // --- Encode Remaining Literals ---
    const litLen = inputLen - anchor;
    let token = litLen >= RUN_MASK
      ? (RUN_MASK << ML_BITS)
      : (litLen << ML_BITS);
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
}