/**
 * Legend Express - Spectator System (2026 Updated)
 * Converted to TypeScript
 */

// ==========================================
// 1. Interfaces & Types
// ==========================================

interface AgarConst {
  VIEWPORT_FREE_SPECTATE_WIDTH: number;
  VIEWPORT_FREE_SPECTATE_HEIGHT: number;
  MAP_EDGE_LENGTH: number;
  VIEWPORT_FREE_SPECTATE_HEIGHT_HALF: number;
  VIEWPORT_FREE_SPECTATE_WIDTH_HALF: number;
  VIEWPORT_MULTIPLIER: { FREE_SPECTATE: number };
  VIEWPORT_BASE_WIDTH: number;
  VIEWPORT_BASE_HEIGHT: number;
}

interface GhostCell {
  x: number;
  y: number;
  size: number;
  mass: number;
  inView: boolean;
}

interface ClientTab {
  ws: string;
  mapOffsetX: number;
  mapOffsetY: number;
  cursorX: number;
  cursorY: number;
  playerNick: string;
  integrity: boolean;
  mapMaxX: number;
  mapMinX: number;
  mapMaxY: number;
  mapMinY: number;
  zoomValue: number;
  playerX: number;
  playerY: number;
  ghostCells: GhostCell[];
  sendAction: (action: number) => void;
}

// Global Augmentation
declare global {
  interface Window {
    spects: Spect[];
    buffer: { Buffer: any };
    unescape: (s: string) => string;
    sendAction: (action: number) => void;
  }

  const AGAR_CONST: AgarConst;
  const application: {
    tabs: Record<string, ClientTab>;
    getghostX: () => number;
    getghostY: () => number;
  };
  const master: { client_version: number };
  const CT: Record<string, string>;
  const settings: {
    shortMass: boolean;
    virMassShots: boolean;
    virusesRange: boolean;
  };
  const agarCaptcha: {
    requestCaptchaV3: (
      action: string,
      callback: (token: string) => void,
    ) => void;
  };

  // Classes assumed to exist globally or imported
  class ClientDummy {
    cells: any[];
    indexedCells: Record<number, any>;
    viruses: any[];
    flushCellsData(): void;
  }
  class Client {
    uncompressBuffer(input: any, output: any): void;
  }
  class Cell {
    constructor(
      id: number,
      x: number,
      y: number,
      size: number,
      color: string | null,
      isFood: boolean | number,
      isVirus: boolean | number,
      isEjected: boolean,
      shortMass: boolean,
      virMassShots: boolean,
    );
    targetX: number;
    targetY: number;
    targetSize: number;
    time: number;
    spectator: number;
    c: ClientDummy;
    removeCell(): void;
    skin?: string;
    targetNick?: string;
    isFood?: boolean | number;
    isVirus?: boolean | number;
    accID?: number;
    isFriend?: number;
    color?: string;
    invisible?: boolean;
  }
}

// ==========================================
// 2. Spectator Management Functions
// ==========================================

export let spects: Spect[] = [];

export function addBox(): void {
  const spect = new Spect();
  spect.player = true;
  spects.unshift(spect);
}

export function addSpectator(): void {
  const spect = new Spect();
  spects.push(spect);
}

export function addFullSpectator(): void {
  const OVERLAP_AMOUNT = 32;

  const EXCESS_VIEWPORT_WIDTH = AGAR_CONST.VIEWPORT_FREE_SPECTATE_WIDTH -
    (AGAR_CONST.MAP_EDGE_LENGTH - OVERLAP_AMOUNT) %
      (AGAR_CONST.VIEWPORT_FREE_SPECTATE_WIDTH - OVERLAP_AMOUNT) -
    OVERLAP_AMOUNT;

  const EXCESS_VIEWPORT_HEIGHT = AGAR_CONST.VIEWPORT_FREE_SPECTATE_HEIGHT -
    (AGAR_CONST.MAP_EDGE_LENGTH - OVERLAP_AMOUNT) %
      (AGAR_CONST.VIEWPORT_FREE_SPECTATE_HEIGHT - OVERLAP_AMOUNT) -
    OVERLAP_AMOUNT;

  const SPECTATOR_ROWS = Math.ceil(
    (AGAR_CONST.MAP_EDGE_LENGTH - OVERLAP_AMOUNT) /
      (AGAR_CONST.VIEWPORT_FREE_SPECTATE_HEIGHT - OVERLAP_AMOUNT),
  );
  const SPECTATOR_COLUMNS = Math.ceil(
    (AGAR_CONST.MAP_EDGE_LENGTH - OVERLAP_AMOUNT) /
      (AGAR_CONST.VIEWPORT_FREE_SPECTATE_WIDTH - OVERLAP_AMOUNT),
  );

  const grid: Spect[][] = [];

  function spectatorGridFactory(
    row: number,
    column: number,
    staticX: number,
    staticY: number,
  ): Spect {
    const spect = new Spect(grid, row, column);
    spect.staticX = staticX;
    spect.staticY = staticY;

    if (grid.length <= row) {
      if (grid.length < row) {
        throw new Error(
          "Attempted to construct spectator grid rows out of order.",
        );
      }
      grid.push([]);
    }
    if (grid[row].length < column) {
      throw new Error(
        "Attempted to construct spectator grid columns out of order.",
      );
    }

    grid[row].push(spect);
    spects.push(spect);

    return spect;
  }

  let y = -AGAR_CONST.MAP_EDGE_LENGTH / 2 +
    AGAR_CONST.VIEWPORT_FREE_SPECTATE_HEIGHT_HALF -
    EXCESS_VIEWPORT_HEIGHT / 2;

  for (let row = 0; row < SPECTATOR_ROWS; row++) {
    let x = -AGAR_CONST.MAP_EDGE_LENGTH / 2 +
      AGAR_CONST.VIEWPORT_FREE_SPECTATE_WIDTH_HALF -
      EXCESS_VIEWPORT_WIDTH / 2;

    for (let column = 0; column < SPECTATOR_COLUMNS; column++) {
      spectatorGridFactory(row, column, x, y);
      x += AGAR_CONST.VIEWPORT_FREE_SPECTATE_WIDTH - OVERLAP_AMOUNT;
    }
    y += AGAR_CONST.VIEWPORT_FREE_SPECTATE_HEIGHT - OVERLAP_AMOUNT;
  }
}

// ==========================================
// 3. Spect Class Definition
// ==========================================

export class Spect {
  public clientDummy: ClientDummy;
  public adjustedCoords: boolean;
  public grid: Spect[][] | null;
  public row: number;
  public column: number;
  public number: number;
  public ws: string | null;
  public socket: WebSocket | null;
  public protocolKey: number | null;
  public clientKey: number | null;
  public clientVersion: number | null;
  public protocolVersion: number | null;
  public connectionOpened: boolean;

  // Map properties
  public mapOffset: number;
  public mapOffsetX: number;
  public mapOffsetY: number;
  public mapShrinkW: number;
  public mapShrinkH: number;
  public fixX: number;
  public fixY: number;
  public staticX: number | null;
  public staticY: number | null;
  public mapMinX?: number;
  public mapMinY?: number;
  public mapMaxX?: number;
  public mapMaxY?: number;
  public mapMidX?: number;
  public mapMidY?: number;
  public mapOffsetFixed: boolean = false; // Initialized default

  // State flags
  public ghostsFixed: boolean;
  public ghostFixed: boolean = false; // Added missing prop
  public closedByUser: boolean;
  public positionController: number | null; // Interval ID
  public player: boolean;
  public active: boolean;
  public isSpectateEnabled: boolean = false;
  public isFreeSpectate: boolean = false;
  public integrity: boolean = false; // Added missing prop based on usage

  public targetX: number | null;
  public targetY: number | null;
  public playerNick: string = "";

  // View data
  public viewX: number = 0;
  public viewY: number = 0;
  public viewMinX?: number;
  public viewMinY?: number;
  public viewMaxX?: number;
  public viewMaxY?: number;
  public scale: number = 1;
  public ghostCells: GhostCell[] = [];
  public serverTime: number = 0;
  public serverTimeDiff: number = 0;
  public time: number = 0;
  public removePlayerCell: boolean = false;

  constructor(
    grid: Spect[][] | null = null,
    row: number = 0,
    column: number = 0,
  ) {
    this.clientDummy = new ClientDummy();
    this.adjustedCoords = false;
    this.grid = grid;
    this.row = row;
    this.column = column;
    this.number = spects.length + 1;
    this.ws = null;
    this.socket = null;
    this.protocolKey = null;
    this.clientKey = null;
    this.clientVersion = null;
    this.protocolVersion = null;
    this.connectionOpened = false;
    this.mapOffset = AGAR_CONST.MAP_EDGE_LENGTH / 2;
    this.mapOffsetX = 0;
    this.mapOffsetY = 0;
    this.mapShrinkW = 1;
    this.mapShrinkH = 1;
    this.fixX = 1;
    this.fixY = 1;
    this.staticX = null;
    this.staticY = null;
    this.ghostsFixed = false;
    this.closedByUser = false;
    this.positionController = null;
    this.player = false;
    this.active = false;
    this.targetX = null;
    this.targetY = null;
    this.connect();
  }

  reset(): void {
    this.ws = null;
    this.protocolKey = null;
    this.clientKey = null;
    this.clientVersion = null;
    this.connectionOpened = false;
    this.mapOffsetX = 0;
    this.mapOffsetY = 0;
    this.ghostsFixed = false;
    this.closedByUser = false;
    this.positionController = null;
    this.player = false;
    this.active = false;
    this.targetX = null;
    this.targetY = null;
    this.clientDummy.flushCellsData();
    this.adjustedCoords = false;
  }

  connect(): void {
    this.reset();
    const masterTab = application.tabs[CT["master"]];
    this.ws = masterTab.ws;
    this.socket = new WebSocket(masterTab.ws);
    this.socket.binaryType = "arraybuffer";
    this.socket.onopen = this.onopen.bind(this);
    this.socket.onmessage = this.onmessage.bind(this);
    this.socket.onerror = this.onerror.bind(this);
    this.socket.onclose = this.onclose.bind(this);
  }

  onopen(): void {
    console.log("[SPECT] Game server socket open");

    this.clientVersion = master.client_version;
    this.protocolVersion = 22;

    let view = this.createView(5);
    view.setUint8(0, 254);
    view.setUint32(1, this.protocolVersion, true);
    this.sendMessage(view);

    view = this.createView(5);
    view.setUint8(0, 255);
    view.setUint32(1, this.clientVersion, true);
    this.sendMessage(view);
    this.connectionOpened = true;
  }

  onmessage(event: MessageEvent): void {
    let view = new DataView(event.data);

    if (this.protocolKey && this.clientVersion !== null) {
      view = this.shiftMessage(view, this.protocolKey ^ this.clientVersion);
    }
    this.handleMessage(view);
  }

  onerror(): void {
    setTimeout(() => {
      if (
        this.socket &&
        (this.socket.readyState === WebSocket.CONNECTING ||
          this.socket.readyState === WebSocket.OPEN)
      ) {
        this.socket.close();
      }
    }, 1000);
    console.log("error");
  }

  onclose(): void {
    if (this.connectionOpened) {
      this.connectionOpened = false;
      this.flushCellsData();
      this.reset();
      console.log("closed");
      if (!this.closedByUser) {
        this.connect();
      }
    }
  }

  closeConnection(): void {
    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onerror = null;
      this.socket.onclose = null;
      try {
        this.socket.close();
      } catch (error) {}
      this.socket = null;
      this.ws = null;
      this.flushCellsData();
      this.reset();
      this.closedByUser = true;
    }
  }

  flushCellsData(): void {
    this.isSpectateEnabled = false;
    this.isFreeSpectate = false;
    this.ghostCells = [];
    this.clientDummy.flushCellsData();
  }

  isSocketOpen(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  createView(value: number): DataView {
    return new DataView(new ArrayBuffer(value));
  }

  sendBuffer(data: DataView): void {
    this.socket?.send(data.buffer);
  }

  sendMessage(message: DataView): void {
    if (this.connectionOpened) {
      if (!this.clientKey) {
        return;
      }
      message = this.shiftMessage(message, this.clientKey);
      this.clientKey = this.shiftKey(this.clientKey);
    }
    this.sendBuffer(message);
  }

  sendAction(action: number): void {
    if (!this.isSocketOpen()) {
      return;
    }
    const view = this.createView(1);
    view.setUint8(0, action);
    this.sendMessage(view);
  }

  convertX(x: number): number {
    return ((x + application.tabs[CT["master"]].mapOffsetX) * this.fixX -
      this.mapOffsetX) / this.mapShrinkW;
  }

  convertY(y: number): number {
    return ((y + application.tabs[CT["master"]].mapOffsetY) * this.fixY -
      this.mapOffsetY) / this.mapShrinkH;
  }

  sendCursor(): void {
    if (this.positionController) clearInterval(this.positionController);
    this.positionController = window.setInterval(() => {
      this.sendPosition(
        this.convertX(application.tabs[CT["master"]].cursorX),
        this.convertY(application.tabs[CT["master"]].cursorY),
      );
    }, 50);
  }

  sendSpectate(): void {
    this.isSpectateEnabled = true;
    this.sendAction(1);
  }

  sendFreeSpectate(): void {
    this.isFreeSpectate = !this.isFreeSpectate;
    if (this.staticX === 0) {
      if (this.isFreeSpectate) {
        this.sendCursor();
      } else if (this.positionController) {
        clearInterval(this.positionController);
      }
    }
    this.sendAction(18);
  }

  sendEject(): void {
    this.sendPosition(
      this.convertX(application.tabs[CT["master"]].cursorX),
      this.convertY(application.tabs[CT["master"]].cursorY),
    );
    this.sendAction(21);
  }

  sendSplit(): void {
    this.sendPosition(
      this.convertX(application.tabs[CT["master"]].cursorX),
      this.convertY(application.tabs[CT["master"]].cursorY),
    );
    this.sendAction(17);
  }

  sendNick(nick?: string): void {
    if (nick) application.tabs[CT["master"]].playerNick = nick;

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const sendSpawn = (token: string) => {
      const encodedNick = unescape(encodeURIComponent(self.playerNick));
      const view = self.createView(
        1 + encodedNick.length + 1 + token.length + 1,
      );
      let pos = 1;
      for (let length = 0; length < encodedNick.length; length++, pos++) {
        view.setUint8(pos, encodedNick.charCodeAt(length));
      }
      pos++;
      for (let length = 0; length < token.length; length++, pos++) {
        view.setUint8(pos, token.charCodeAt(length));
      }
      self.sendMessage(view);
    };

    if (application.tabs[CT["master"]].integrity) {
      agarCaptcha.requestCaptchaV3("play", (token) => {
        sendSpawn(token);
      });
    } else {
      sendSpawn("0");
    }
  }

  sendPosition(x: number, y: number): void {
    if (
      !this.isSocketOpen() || !this.connectionOpened ||
      (!this.clientKey && this.integrity)
    ) {
      return;
    }
    const view = this.createView(13);
    view.setUint8(0, 16);
    if (this.player === true && this.active !== true) {
      view.setInt32(1, this.targetX ?? 0, true);
      view.setInt32(5, this.targetY ?? 0, true);
      console.log(this.targetX, this.targetY);
    } else {
      view.setInt32(1, x, true);
      view.setInt32(5, y, true);
      this.targetX = x;
      this.targetY = y;
    }
    view.setUint32(9, this.protocolKey ?? 0, true);
    this.sendMessage(view);
  }

  generateClientKey(ip: string | null, options: Uint8Array): number | null {
    if (!ip || !ip.length || !options.byteLength) {
      return null;
    }
    let x = 0;
    const Length = 1540483477;
    const match = ip.match(/(ws+:\/\/)([^:]*)(:\d+)/);
    if (!match) return null;

    const ipCheck = match[2];
    const newLength = ipCheck.length + options.byteLength;
    const uint8Arr = new Uint8Array(newLength);

    for (let length = 0; length < ipCheck.length; length++) {
      uint8Arr[length] = ipCheck.charCodeAt(length);
    }
    uint8Arr.set(options, ipCheck.length);

    const dataview = new DataView(uint8Arr.buffer);
    let type = newLength - 1;
    const value = ((type - 4) & -4) + 4 | 0;
    let newValue = type ^ 255;
    let offset = 0;

    while (type > 3) {
      x = Math.imul(dataview.getInt32(offset, true), Length) | 0;
      newValue = (Math.imul(x >>> 24 ^ x, Length) | 0) ^
        (Math.imul(newValue, Length) | 0);
      type -= 4;
      offset += 4;
    }

    switch (type) {
      case 3:
        newValue = (uint8Arr[value + 2] << 16) ^ newValue;
        // fall through
      case 2:
        newValue = (uint8Arr[value + 1] << 8) ^ newValue;
        break;
      case 1:
        break;
      default:
        x = newValue;
        break;
    }

    if (x != newValue) {
      x = Math.imul(uint8Arr[value] ^ newValue, Length) | 0;
    }

    newValue = x >>> 13;
    x = newValue ^ x;
    x = Math.imul(x, Length) | 0;
    newValue = x >>> 15;
    x = newValue ^ x;

    console.log("[SPECT] Generated client key:", x);
    return x;
  }

  shiftKey(key: number): number {
    const value = 1540483477;
    key = Math.imul(key, value) | 0;
    key = (Math.imul(key >>> 24 ^ key, value) | 0) ^ 114296087;
    key = Math.imul(key >>> 13 ^ key, value) | 0;
    return key >>> 15 ^ key;
  }

  shiftMessage(view: DataView, key: number, write: boolean = false): DataView {
    // Since DataView ops are byte-based, writing directly is same logic if buffer is shared
    for (let length = 0; length < view.byteLength; length++) {
      const byte = view.getUint8(length);
      const xor = (key >>> (length % 4 * 8)) & 255;
      view.setUint8(length, byte ^ xor);
    }
    return view;
  }

  decompressMessage(message: DataView): DataView {
    const buffer = window.buffer.Buffer;
    const messageBuffer = new buffer(message.buffer);
    const readMessage = new buffer(messageBuffer.readUInt32LE(1));
    // Assuming Client.prototype.uncompressBuffer exists and works statically or on prototype
    // In TS we usually avoid accessing prototype methods directly like this unless needed
    const clientProto = (window as any).Client.prototype;
    clientProto.uncompressBuffer(messageBuffer.slice(5), readMessage);
    return readMessage;
  }

  handleMessage(view: DataView): void {
    let offset = 0;

    // Helper to read null-terminated string
    const encode = (): string => {
      let text = "";
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const charCode = view.getUint8(offset++);
        if (charCode === 0) break;
        text += String.fromCharCode(charCode);
      }
      return text;
    };

    let opCode = view.getUint8(offset++);
    if (opCode === 54) {
      opCode = 53;
    }

    switch (opCode) {
      case 5:
        console.log("case 5");
        break;
      case 17:
        this.viewX = this.getX(view.getFloat32(offset, true));
        offset += 4;
        this.viewY = this.getY(view.getFloat32(offset, true));
        offset += 4;
        this.scale = view.getFloat32(offset, true);
        break;
      case 18:
        if (this.protocolKey) {
          this.protocolKey = this.shiftKey(this.protocolKey);
        }
        this.flushCellsData();
        console.log("case 18");
        break;
      case 32:
        console.log("case 32");
        break;
      case 50:
        console.log("case 50");
        break;
      case 53:
        break;
      case 54:
        console.log("case 54");
        break;
      case 69: {
        const length = view.getUint16(offset, true);
        offset += 2;
        this.ghostCells = [];
        for (let i = 0; i < length; i++) {
          const x = view.getInt32(offset, true);
          offset += 4;
          const y = view.getInt32(offset, true);
          offset += 4;
          const mass = view.getUint32(offset, true);
          offset += 4;
          offset += 1; // Skip byte

          const size = Math.sqrt(100 * mass);
          this.ghostCells.push({
            x: x,
            y: y,
            size: size,
            mass: mass,
            inView: this.isInView(this.getX(x), this.getY(y)), // removed size param
          });
        }

        const masterClient = application.tabs[CT["master"]];
        const masterTopPlayerPosition = {
          x: masterClient.ghostCells[0]?.x ?? 0,
          y: masterClient.ghostCells[0]?.y ?? 0,
        };

        if (
          !this.ghostFixed &&
          this.mapOffsetFixed &&
          this.ghostCells.length !== 0 &&
          Math.abs(masterTopPlayerPosition.x) > 1000 &&
          Math.abs(masterTopPlayerPosition.y) > 1000
        ) {
          // Logic simplified from original
          this.fixX = Math.sign(
            masterTopPlayerPosition.x /
              (this.ghostCells[0].x + this.mapOffsetX),
          );
          this.fixY = Math.sign(
            masterTopPlayerPosition.y /
              (this.ghostCells[0].y + this.mapOffsetY),
          );
          this.ghostFixed = true;
          if (this.mapOffsetFixed) this.adjustCoordsAfterFixes();
        }
        break;
      }
      case 85:
        console.log("case 85");
        break;
      case 102:
        console.log("case 102");
        break;
      case 103:
        console.log("case 103");
        break;
      case 104:
        console.log("case 104");
        break;
      case 114:
        console.error("[Agario] Spectate mode is full");
        console.log("case 114");
        break;
      case 160:
        console.log("case 160");
        break;
      case 161:
        break;
      case 176:
        console.log("case 176");
        break;
      case 177:
        console.log("case 177");
        break;
      case 178:
        console.log("case 178");
        break;
      case 179:
        console.log("case 179");
        break;
      case 180:
        console.log("case 180");
        break;
      case 226: {
        const ping = view.getUint16(1, true);
        const pingView = this.createView(3);
        pingView.setUint8(0, 227);
        pingView.setUint16(1, ping);
        this.sendMessage(pingView);
        break;
      }
      case 241: { // Add opening bracket
        this.protocolKey = view.getUint32(offset, true);
        console.log("[SPECT] Received protocol key:", this.protocolKey);
        offset += 4;

        // Create Uint8Array view of the rest
        const agarioReader = new Uint8Array(view.buffer, offset);
        this.clientKey = this.generateClientKey(this.ws, agarioReader);
        break;
      } // Add closing bracket
      case 242:
        console.log("242");
        this.serverTime = view.getUint32(offset, true) * 1000;
        this.serverTimeDiff = Date.now() - this.serverTime;

        if (this.player === true) {
          this.active = true;
          this.sendCursor();
          this.sendNick();
        } else {
          this.sendSpectate();
        }
        if (this.staticX != null && this.staticY != null) {
          setInterval(() => {
            this.sendPosition(
              this.convertX(this.staticX!),
              this.convertY(this.staticY!),
            );
          }, 200);
          this.sendFreeSpectate();
        }
        break;
      case 255:
        this.handleSubmessage(view);
        break;
      case 16:
        console.log("[SPECT] case 16");
        break;
      case 64:
        console.log("[SPECT] case 64");
        break;
      default:
        console.log("[SPECT] Unknown opcode:", view.getUint8(0));
        break;
    }
  }

  getX(x: number): number {
    if (this.ghostFixed && this.mapOffsetFixed) {
      return (x * this.mapShrinkW + this.mapOffsetX) * this.fixX -
        application.tabs[CT["master"]].mapOffsetX;
    } else return x;
  }

  getY(y: number): number {
    if (this.ghostFixed && this.mapOffsetFixed) {
      return (y * this.mapShrinkH + this.mapOffsetY) * this.fixY -
        application.tabs[CT["master"]].mapOffsetY;
    } else return y;
  }

  handleSubmessage(view: DataView): void {
    const message = this.decompressMessage(view);
    // Note: message returned is a Buffer/Uint8Array-like object with read methods attached by the buffer polyfill
    let offset = 0;
    // Typescript might complain about .readUInt8 not existing on standard DataView/Uint8Array
    // Assuming the buffer polyfill adds these Node.js-style methods
    const msgAny = message as any;

    switch (msgAny.readUInt8(offset++)) {
      case 16:
        this.updateCells(message, offset);
        break;
      case 64:
        this.viewMinX = msgAny.readDoubleLE(offset);
        offset += 8;
        this.viewMinY = msgAny.readDoubleLE(offset);
        offset += 8;
        this.viewMaxX = msgAny.readDoubleLE(offset);
        offset += 8;
        this.viewMaxY = msgAny.readDoubleLE(offset);

        this.setMapOffset(
          this.viewMinX!,
          this.viewMinY!,
          this.viewMaxX!,
          this.viewMaxY!,
        );
        break;
      default:
        console.log("[SPECT] Unknown sub opcode:", msgAny.readUInt8(0));
        break;
    }
  }

  isInView(x: number, y: number): boolean {
    const mtp = AGAR_CONST.VIEWPORT_MULTIPLIER.FREE_SPECTATE;
    const w = AGAR_CONST.VIEWPORT_BASE_WIDTH / 2 * mtp;
    const h = AGAR_CONST.VIEWPORT_BASE_HEIGHT / 2 * mtp;
    if (
      x < this.viewX - w || y < this.viewY - h || x > this.viewX + w ||
      y > this.viewY + h
    ) {
      return true;
    }
    return false;
  }

  circleInViewport(
    x: number,
    y: number,
    radius: number = 0,
    safetyMargin: number = 0,
  ): boolean {
    const effectiveRadius = Math.max(radius - safetyMargin, 0);

    const distX = Math.abs(x - this.viewX);
    const distY = Math.abs(y - this.viewY);

    const distanceToClosestCornerX = distX -
      AGAR_CONST.VIEWPORT_FREE_SPECTATE_WIDTH_HALF;
    const distanceToClosestCornerY = distY -
      AGAR_CONST.VIEWPORT_FREE_SPECTATE_HEIGHT_HALF;

    if (
      distX <= AGAR_CONST.VIEWPORT_FREE_SPECTATE_WIDTH_HALF + effectiveRadius &&
      distY <= AGAR_CONST.VIEWPORT_FREE_SPECTATE_HEIGHT_HALF
    ) {
      return true;
    }

    if (
      distX <= AGAR_CONST.VIEWPORT_FREE_SPECTATE_WIDTH_HALF &&
      distY <= AGAR_CONST.VIEWPORT_FREE_SPECTATE_HEIGHT_HALF + effectiveRadius
    ) {
      return true;
    }

    return (distanceToClosestCornerX * distanceToClosestCornerX +
        distanceToClosestCornerY * distanceToClosestCornerY <=
      (effectiveRadius * effectiveRadius));
  }

  circleInViewportOfEarlierSpectator(
    x: number,
    y: number,
    radius: number = 0,
    safetyMargin: number = 0,
  ): boolean {
    if (
      this.grid && this.row > 0 &&
      this.grid[this.row - 1][this.column].circleInViewport(
        x,
        y,
        radius,
        safetyMargin,
      )
    ) return true;
    if (
      this.grid && this.column > 0 &&
      this.grid[this.row][this.column - 1].circleInViewport(
        x,
        y,
        radius,
        safetyMargin,
      )
    ) return true;
    if (
      this.grid && this.row > 0 && this.column > 0 &&
      this.grid[this.row - 1][this.column - 1].circleInViewport(
        x,
        y,
        radius,
        safetyMargin,
      )
    ) return true;
    return false;
  }

  setMapOffset(left: number, top: number, right: number, bottom: number): void {
    if (!this.integrity || (right - left) > 14000 && (bottom - top) > 14000) {
      this.mapShrinkW = AGAR_CONST.MAP_EDGE_LENGTH / (right - left);
      this.mapShrinkH = AGAR_CONST.MAP_EDGE_LENGTH / (bottom - top);
      left = left * this.mapShrinkW;
      right = right * this.mapShrinkW;
      top = top * this.mapShrinkH;
      bottom = bottom * this.mapShrinkH;

      this.mapOffsetX = (this.mapOffset) - right;
      this.mapOffsetY = (this.mapOffset) - bottom;
      this.mapMinX = -this.mapOffset - this.mapOffsetX;
      this.mapMinY = -this.mapOffset - this.mapOffsetY;
      this.mapMaxX = this.mapOffset - this.mapOffsetX;
      this.mapMaxY = this.mapOffset - this.mapOffsetY;
      this.mapMidX = (this.mapMaxX + this.mapMinX) / 2;
      this.mapMidY = (this.mapMaxY + this.mapMinY) / 2;
      if (!this.mapOffsetFixed) {
        this.viewX = (right + left) / 2;
        this.viewY = (bottom + top) / 2;
      }
      this.mapOffsetFixed = true;
      if (this.ghostFixed) this.adjustCoordsAfterFixes();
      console.log(
        "[SPECT] Map offset fixed (x, y):",
        this.mapOffsetX,
        this.mapOffsetY,
      );
    }
  }

  adjustCoordsAfterFixes(): void {
    if (this.adjustedCoords) {
      console.log("Tried to adjust coords, although that already happened.");
      return;
    }
    for (const cell of this.clientDummy.cells) {
      cell.targetX = cell.x = this.getX(cell.x);
      cell.targetY = cell.y = this.getY(cell.y);
    }
    this.adjustedCoords = true;
  }

  updateCells(view: any, offset: number): void {
    const encode = (): string => {
      let text = "";
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const string = view.readUInt8(offset++);
        if (string == 0) {
          break;
        }
        text += String.fromCharCode(string);
      }
      return text;
    };

    this.time = Date.now();
    this.removePlayerCell = false;
    let eatEventsLength = view.readUInt16LE(offset);
    offset += 2;

    for (let length = 0; length < eatEventsLength; length++) {
      const eaterID =
        this.clientDummy.indexedCells[this.newID(view.readUInt32LE(offset))];
      const victimID =
        this.clientDummy
          .indexedCells[this.newID(view.readUInt32LE(offset + 4))];

      offset += 8;
      if (eaterID && victimID) {
        victimID.targetX = eaterID.x;
        victimID.targetY = eaterID.y;
        victimID.targetSize = victimID.size;
        victimID.time = this.time;
        victimID.removeCell();
      }
    }

    const mapX = application.tabs[CT["master"]].mapMaxX -
      application.tabs[CT["master"]].mapMinX;
    const mapY = application.tabs[CT["master"]].mapMaxY -
      application.tabs[CT["master"]].mapMinY;
    const maxX = Math.round(
      mapX / application.tabs[CT["master"]].zoomValue / 10,
    );
    const maxY = Math.round(
      mapY / application.tabs[CT["master"]].zoomValue / 10,
    );

    // Cell Updates Loop
    // eslint-disable-next-line no-constant-condition
    while (true) {
      let id = view.readUInt32LE(offset);
      offset += 4;
      if (id === 0) {
        break;
      }
      let x = view.readInt32LE(offset);
      offset += 4;
      let y = view.readInt32LE(offset);
      offset += 4;

      x = this.getX(x);
      y = this.getY(y);
      const invisible = this.staticX != null ? this.isInView(x, y) : false;
      const a = x - application.tabs[CT["master"]].playerX;
      const b = y - application.tabs[CT["master"]].playerY;
      const distanceX = Math.round(Math.sqrt(a * a));
      const distanceY = Math.round(Math.sqrt(b * b));

      let remove = false;
      if (distanceX > maxX || distanceY > maxY) {
        remove = true;
      }

      const size = view.readUInt16LE(offset);
      offset += 2;
      const flags = view.readUInt8(offset++);
      let extendedFlags = 0;
      if (flags & 128) {
        extendedFlags = view.readUInt8(offset++);
      }
      let color = null;
      let skin = null;
      let name = "";
      let accountID = null;

      if (flags & 2) {
        // R, G, B skipped in original logic?
        // const r = view.readUInt8(offset++);
        // const g = view.readUInt8(offset++);
        // const b = view.readUInt8(offset++);
        offset += 3;
        color = "#bbbbbb";
      }
      if (flags & 4) {
        skin = encode();
      }
      if (flags & 8) {
        name = decodeURIComponent(escape(encode()));
      }
      if (flags & 16) {
        // flag 16 logic
      }
      const isVirus = flags & 1;
      const isFood = extendedFlags & 1;
      const isFriend = extendedFlags & 2;

      id = this.newID(id);

      let cell = null;
      if (
        Object.prototype.hasOwnProperty.call(this.clientDummy.indexedCells, id)
      ) {
        cell = this.clientDummy.indexedCells[id];
        cell.invisible = invisible;

        if (color) {
          cell.color = color;
        }
      } else {
        // Assuming Cell class exists globally
        // eslint-disable-next-line no-undef
        cell = new (window as any).Cell(
          id,
          x,
          y,
          size,
          color,
          isFood,
          isVirus,
          false,
          settings.shortMass,
          settings.virMassShots,
        );
        cell.time = this.time;
        cell.spectator = this.number;
        cell.c = this.clientDummy;

        if (!isFood && !remove) {
          if (isVirus && settings.virusesRange) {
            this.clientDummy.viruses.push(cell);
          }
          this.clientDummy.cells.push(cell);
        }
        this.clientDummy.indexedCells[id] = cell;
      }

      if (name) {
        cell.targetNick = name;
      }
      cell.targetX = x;
      cell.targetY = y;
      cell.targetSize = size;
      cell.isFood = isFood;
      cell.isVirus = isVirus;

      if (skin) {
        cell.skin = skin;
      }
      if (extendedFlags & 4) {
        accountID = view.readUInt32LE(offset);
        offset += 4;
        cell.accID = accountID;
      }
      if (extendedFlags & 2) {
        cell.isFriend = isFriend;
      }
    }

    eatEventsLength = view.readUInt16LE(offset);
    offset += 2;
    for (let length = 0; length < eatEventsLength; length++) {
      const id = view.readUInt32LE(offset);
      offset += 4;
      const cell = this.clientDummy.indexedCells[this.newID(id)];
      if (cell) {
        cell.removeCell();
      }
    }
  }

  newID(id: number): number {
    return id + this.number + 10000000000;
  }
}

// Global action handler
window.sendAction = (action: number) => {
  application.tabs[CT["master"]].sendAction(action);
};