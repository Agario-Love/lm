/**
 * Legend Express - Spectator/Multibox Engine (Pixi.js Compatible)
 * Optimized for performance and synced with PixiFoodRenderer
 * Converted to TypeScript
 */

// =========================================================================
// TYPE DEFINITIONS (Context Management)
// =========================================================================

declare global {
  interface Window {
    legendmod: any;
    pixiFoodRenderer: any;
    spects: Spect[];
    sendAction: (action: number) => void;
    fullSpectator: boolean;
    master: any;
    buffer: any;
    MultiPending: Spect | null;
    multiboxPlayerEnabled: number | null | boolean;
    multiboxFollowMouse: boolean;
    agarCaptcha: any;
    ogarcopythelb: any;
    ogario: any;
    middleMultiViewFlag: boolean;
    targetingLeadX: number;
    targetingLeadY: number;
    MultiWS: string | null;
    legendmod1: new (...args: any[]) => any; // The Cell constructor class
  }

  // External Global Variables
  var legendmod: any;
  var pixiFoodRenderer: any;
  var profiles: any;
  var application: any;
  var core: any;
  var master: any;
  var toastr: any;
  var defaultmapsettings: any;
  var LZ4: any;
  var checkIfPlayerIsInView: (nick: string) => boolean;
}

// =========================================================================
// MAIN SCRIPT
// =========================================================================

(function () {
  "use strict";

  // =========================================================================
  // CONSTANTS & CONFIG
  // =========================================================================

  const OPCODES = {
    SPAWN: 1,
    SPECTATE: 1,
    MOVE: 16,
    SPLIT: 17,
    FREE_SPECTATE: 18,
    EJECT: 21,
    SPLIT_BOT: 22,
    EJECT_BOT: 23,
    // Server -> Client
    UPDATE_NODES: 16,
    UPDATE_VIEWPORT: 64,
    SERVER_TICK: 242,
    COMPRESSED_PACKET: 255,
  } as const;

  const CONNECTION_STATE = {
    DISCONNECTED: 0,
    CONNECTING: 1,
    CONNECTED: 2,
  } as const;

  // Ensure Lists Exist
  window.legendmod = window.legendmod || {};
  window.legendmod.foodMulti = window.legendmod.foodMulti || [];

  // =========================================================================
  // HELPER FUNCTIONS
  // =========================================================================

  const loadMultiCellSkin = (): void => {
    const profile = profiles[application.selectedOldProfile];
    if (profile?.nick && !application.customSkinsMap[profile.nick]) {
      setTimeout(() => {
        core.registerSkin(profile.nick, null, profile.skinURL, null);
      }, 500);
    }
  };

  // Helper to clean up Pixi sprites when a cell is removed
  const cleanPixiSprite = (cell: any): void => {
    if (
      window.pixiFoodRenderer &&
      window.pixiFoodRenderer.sprites &&
      cell._pixiId
    ) {
      const sprite = window.pixiFoodRenderer.sprites.get(cell._pixiId);
      if (sprite) {
        sprite.visible = false;
        // We don't destroy the texture, just the instance if needed,
        // but usually hiding it allows the pool to reuse it.
        // If you want hard cleanup:
        // window.pixiFoodRenderer.sprites.delete(cell._pixiId);
        // sprite.destroy();
      }
    }
  };

  // =========================================================================
  // SPECTATOR MANAGER
  // =========================================================================

  const SpectatorManager = {
    spects: [] as Spect[],

    addBox: function (): void {
      const spect = new Spect();
      spect.player = true;
      legendmod.multiBoxPlayerExists = true;
      this.spects.unshift(spect);
    },

    addSpectator: function (): void {
      const spect = new Spect();
      this.spects.push(spect);
    },

    addFullSpectator: function (): void {
      if (!legendmod.integrity) {
        toastr.error(
          "Full spectator does not work for Private servers.<br>There is no <i>FreeSpectate</i> on Private Servers"
        );
        window.fullSpectator = false;
        return;
      }

      const mtp = 4.95;
      const w = ~~(1024 * mtp);
      const h = ~~(600 * mtp);
      const times = parseInt((legendmod.mapSize / 471.4).toString());

      if (times >= 80) return; // Prevention for massive maps

      let x = legendmod.mapMinX + 2400;
      let y = legendmod.mapMinY + 1000;

      for (let stop = 0; stop < times; stop++) {
        const spect = new Spect();
        spect.staticX = x;
        spect.staticY = y;
        this.spects.push(spect);

        // Calculate grid position for next bot
        if (x > legendmod.mapMaxX - 2400) {
          x = legendmod.mapMinX + 2400;
          y += h;
        } else {
          x += w;
        }

        if (y > legendmod.mapMaxY - 1000) break;
      }
    },

    checkMultiTokens: function (spector: Spect): void {
      if (spector && master.accessTokenFB) {
        spector.sendFbToken(master.accessTokenFB);
      } else if (spector && master.accessTokenGPlus) {
        spector.sendGplusToken(master.accessTokenGPlus);
      }
    },

    sendAction: function (action: number): void {
      legendmod.sendAction(action);
    },
  };

  // Expose to window
  window.spects = SpectatorManager.spects;
  window.sendAction = SpectatorManager.sendAction;

  // =========================================================================
  // SPECTATOR CLASS
  // =========================================================================

  class Spect {
    public number: number;
    public ws: string | null;
    public socket: WebSocket | null;
    public connectionState: number;
    public protocolKey: number | null;
    public clientKey: number | null;
    public clientVersion: number | null;
    public protocolVersion: number | null;
    public accessTokenSent: boolean;

    public nick: string | null;
    public player: boolean;
    public active: boolean | null;
    public playerScore: number;
    public playerCellIDs: number[];
    public playerSize: number;
    public closedByUser: boolean;

    // Map State
    public mapOffset: number;
    public mapOffsetX: number;
    public mapOffsetY: number;
    public fixX: number;
    public fixY: number;
    public fix3x: number;
    public fix3y: number;
    public staticX: number | null;
    public staticY: number | null;
    public ghostsFixed: boolean;
    public mapOffsetFixed: boolean;
    public ghostCells: Array<{
      x: number;
      y: number;
      size: number;
      mass: number;
      inView: boolean;
    }>;

    // Movement
    public targetX: number;
    public targetY: number;
    public positionController: any; // Interval ID
    public playerX: number = 0;
    public playerY: number = 0;
    public distX: number = 0;
    public distY: number = 0;

    // View State
    public viewX: number = 0;
    public viewY: number = 0;
    public viewMinX: number = 0;
    public viewMinY: number = 0;
    public viewMaxX: number = 0;
    public viewMaxY: number = 0;
    public scale: number = 1;

    // Flags
    public isSpectateEnabled: boolean = false;
    public isFreeSpectate: boolean = false;
    public connectionOpened: boolean = false; // Note: inferred from usage in sendPosition
    public openFirst: boolean = false;
    public openSecond: boolean = false;
    public openThird: boolean = false;
    public ghostFixed: boolean = false;
    public announcementTold: boolean = false;
    public removePlayerCell: boolean = false;

    // Data
    public timeStarted: number = 0;
    public serverTime: number = 0;
    public playerNick: string = "";
    public leaderboard: any[] = [];
    public playerMass: number = 0;
    public mapSize: number = 0;

    // Utilities
    public textDecoder: TextDecoder;

    constructor() {
      this.number = SpectatorManager.spects.length + 1;

      // Network State
      this.ws = null;
      this.socket = null;
      this.connectionState = CONNECTION_STATE.DISCONNECTED;
      this.protocolKey = null;
      this.clientKey = null;
      this.clientVersion = null;
      this.protocolVersion = null;
      this.accessTokenSent = false;

      // Player State
      this.nick = null;
      this.player = false;
      this.active = false;
      this.playerScore = 0;
      this.playerCellIDs = [];
      this.playerSize = 0;
      this.closedByUser = false;

      // Map State
      this.mapOffset = 7071;
      this.mapOffsetX = 0;
      this.mapOffsetY = 0;
      this.fixX = 1;
      this.fixY = 1;
      this.fix3x = 0;
      this.fix3y = 0;
      this.staticX = null;
      this.staticY = null;
      this.ghostsFixed = false;
      this.mapOffsetFixed = false;
      this.ghostCells = [];

      // Movement
      this.targetX = 0;
      this.targetY = 0;
      this.positionController = null;

      // Utilities
      this.textDecoder = new TextDecoder("utf-8");

      this.connect();
    }

    reset(): void {
      this.ws = null;
      this.nick = null;
      this.accessTokenSent = false;
      this.protocolKey = null;
      this.clientKey = null;
      this.clientVersion = null;
      this.connectionState = CONNECTION_STATE.DISCONNECTED;
      this.mapOffsetX = 0;
      this.mapOffsetY = 0;
      this.ghostsFixed = false;
      this.closedByUser = false;
      this.active = false;
      this.playerCellIDs = [];
      this.playerScore = 0;
      this.fix3x = 0;
      this.fix3y = 0;

      // Clear global legendmod references
      legendmod.playerCellsMulti = [];
      legendmod.multiBoxPlayerExists = null;

      if (this.positionController) clearInterval(this.positionController);
      this.positionController = null;
    }

    connect(): void {
      this.reset();
      this.timeStarted = Date.now();
      this.ws = legendmod.ws;

      if (!this.ws) return;

      this.socket = new WebSocket(legendmod.ws);
      this.socket.binaryType = "arraybuffer";
      this.socket.onopen = this.onOpen.bind(this);
      this.socket.onmessage = this.onMessage.bind(this);
      this.socket.onerror = this.onError.bind(this);
      this.socket.onclose = this.onClose.bind(this);
    }

    onOpen(): void {
      console.log(`[SPECT] Game server socket ${this.number} open`);
      this.connectionState = CONNECTION_STATE.CONNECTED;
      this.clientVersion = window.master.clientVersion;
      this.protocolVersion = window.master.protocolVersion;

      // Send Handshake
      const initKey = legendmod.integrity ? this.protocolVersion! : 6;
      const initVer = legendmod.integrity ? this.clientVersion! : 1;

      this.sendHandshake(254, initKey);
      this.sendHandshake(255, initVer);
      this.connectionOpened = true; // Added based on usage check in sendPosition
    }

    onMessage(event: MessageEvent): void {
      let view = new DataView(event.data);

      if (this.protocolKey) {
        view = this.shiftMessage(view, this.protocolKey ^ this.clientVersion!);
      }
      this.handleMessage(view);
    }

    onError(): void {
      console.warn(`[SPECT] Socket ${this.number} Error`);
      setTimeout(() => {
        if (
          this.socket &&
          (this.socket.readyState === WebSocket.CONNECTING ||
            this.socket.readyState === WebSocket.OPEN)
        ) {
          this.socket.close();
        }
      }, 1000);
    }

    onClose(): void {
      if (this.connectionState === CONNECTION_STATE.CONNECTED) {
        this.connectionState = CONNECTION_STATE.DISCONNECTED;
        this.flushCellsData();
        this.reset();
        console.log(`[SPECT] Socket ${this.number} closed`);

        if (!this.closedByUser) {
          setTimeout(() => this.connect(), 1000); // Auto reconnect
        }
      }
    }

    closeConnection(): void {
      this.closedByUser = true;
      if (this.socket) {
        this.socket.onopen = null;
        this.socket.onmessage = null;
        this.socket.onerror = null;
        this.socket.onclose = null;
        this.socket.close();
      }
      this.socket = null;
      this.flushCellsData();
      this.reset();
    }

    flushCellsData(): void {
      this.isSpectateEnabled = false;
      this.isFreeSpectate = false;
      this.ghostCells = [];
      legendmod.playerCellsMulti = [];
      this.playerCellIDs = [];

      // Clean up global cell lists and Pixi sprites
      const cleanList = (list: any[]) => {
        // Iterate backwards to safely remove
        for (let i = list.length - 1; i >= 0; i--) {
          const cell = list[i];
          if (cell && cell.spectator === this.number) {
            cleanPixiSprite(cell);
            cell.removeCell();
          }
        }
      };

      // Clean indexed cells
      for (const id in legendmod.indexedCells) {
        const cell = legendmod.indexedCells[id];
        if (cell && cell.spectator === this.number) {
          cleanPixiSprite(cell);
          cell.removeCell();
        }
      }

      // Clean FoodMulti (Crucial for Pixi)
      if (legendmod.foodMulti) cleanList(legendmod.foodMulti);
    }

    isSocketOpen(): boolean {
      return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    }

    // --- Packet Construction ---

    createView(size: number): DataView {
      return new DataView(new ArrayBuffer(size));
    }

    sendHandshake(opcode: number, data: number): void {
      const view = this.createView(5);
      view.setUint8(0, opcode);
      view.setUint32(1, data, true);
      this.sendMessage(view);
    }

    sendMessage(view: DataView): void {
      if (
        this.connectionState === CONNECTION_STATE.CONNECTED &&
        legendmod.integrity
      ) {
        if (!this.clientKey) return;
        view = this.shiftMessage(view, this.clientKey, true);
        this.clientKey = this.shiftKey(this.clientKey);
      }
      this.socket!.send(view.buffer);
    }

    sendAction(action: number): void {
      if (!this.isSocketOpen()) return;
      const view = this.createView(1);
      view.setUint8(0, action);
      this.sendMessage(view);
    }

    // --- Social / Token Handling ---

    getTheOppositeSocialToken(): void {
      const ctx = master.context;

      if (ctx === "facebook") {
        if (master.accessTokenGPlus) SpectatorManager.checkMultiTokens(this);
        else {
          window.MultiPending = this;
          document.getElementById("gplusLogin")?.click();
        }
      } else if (ctx === "google") {
        if (master.accessTokenFB) SpectatorManager.checkMultiTokens(this);
        else {
          window.MultiPending = this;
          master.facebookLogin();
        }
      } else {
        this.handleSendNick();
      }
    }

    sendFbToken(token: string): void {
      this.sendAccessToken(token, 2);
    }
    sendGplusToken(token: string): void {
      this.sendAccessToken(token, 4);
    }

    sendAccessToken(token: string, providerId: number): void {
      if (!legendmod.integrity || this.accessTokenSent) return;

      const opcode = 102;
      const versionStr = legendmod.clientVersionString;
      const tokenLen = token.length;
      const verLen = versionStr.length;

      const writeVarInt = (targetArray: number[], value: number) => {
        while (true) {
          if ((value & 0xffffff80) === 0) {
            targetArray.push(value);
            return;
          }
          targetArray.push((value & 0x7f) | 0x80);
          value >>>= 7;
        }
      };

      let data = [opcode, 8, 1, 18];
      writeVarInt(data, tokenLen + verLen + 23);
      data.push(8, 10, 82);
      writeVarInt(data, tokenLen + verLen + 18);
      data.push(8, providerId, 18, verLen + 8, 8, 5, 18, verLen);

      for (let i = 0; i < verLen; i++) data.push(versionStr.charCodeAt(i));

      data.push(24, 0, 32, 0, 26);
      writeVarInt(data, tokenLen + 3);
      data.push(10);
      writeVarInt(data, tokenLen);

      for (let i = 0; i < tokenLen; i++) data.push(token.charCodeAt(i));

      const view = new DataView(new Uint8Array(data).buffer);
      this.sendMessage(view);
      this.accessTokenSent = true;
    }

    // --- Movement & Actions ---

    sendCursor(): void {
      if (this.positionController) clearInterval(this.positionController);

      this.positionController = setInterval(() => {
        if (legendmod.pause) {
          this.sendPosition(
            this.convertX(this.playerX),
            this.convertY(this.playerY)
          );
          return;
        }

        if (
          window.multiboxPlayerEnabled ||
          this.isFreeSpectate ||
          window.multiboxFollowMouse
        ) {
          const targetX = this.convertX(legendmod.cursorX);
          const targetY = this.convertY(legendmod.cursorY);
          this.sendPosition(targetX, targetY);

          this.distX = targetX - this.playerX;
          this.distY = targetY - this.playerY;
        } else if (defaultmapsettings.multiKeepMoving) {
          this.sendPosition(
            this.playerX + this.distX,
            this.playerY + this.distY
          );
        }
      }, 50);
    }

    sendSpectate(): void {
      this.isSpectateEnabled = true;
      this.sendAction(OPCODES.SPECTATE);
    }

    sendFreeSpectate(): void {
      this.isFreeSpectate = !this.isFreeSpectate;
      if (this.staticX === 0) {
        this.isFreeSpectate
          ? this.sendCursor()
          : clearInterval(this.positionController);
      }
      this.sendAction(OPCODES.FREE_SPECTATE);
    }

    sendBotEject(): void {
      this.sendAction(OPCODES.EJECT_BOT);
    }
    sendBotSplit(): void {
      this.sendAction(OPCODES.SPLIT_BOT);
    }
    sendEject(): void {
      this.sendPosition(
        this.convertX(legendmod.cursorX),
        this.convertY(legendmod.cursorY)
      );
      this.sendAction(OPCODES.EJECT);
    }
    sendSplit(): void {
      this.sendPosition(
        this.convertX(legendmod.cursorX),
        this.convertY(legendmod.cursorY)
      );
      this.sendAction(OPCODES.SPLIT);
    }

    sendNick(nickName: string): void {
      if (this.active) return;
      this.playerNick = nickName;
      const self = this;

      const sendSpawnPacket = (token: string) => {
        const nick = unescape(encodeURIComponent(self.playerNick));
        const enc = new TextEncoder();
        const nickBytes = enc.encode(nick);
        const tokenBytes = enc.encode(token);

        const view = self.createView(
          1 + nickBytes.length + 1 + tokenBytes.length + 1
        );
        let pos = 1;

        new Uint8Array(view.buffer).set(nickBytes, pos);
        pos += nickBytes.length + 1;
        new Uint8Array(view.buffer).set(tokenBytes, pos);

        self.sendMessage(view);
      };

      if (legendmod.integrity) {
        window.agarCaptcha.requestCaptchaV3("play", (token: string) =>
          sendSpawnPacket("0")
        );
      } else {
        sendSpawnPacket("0");
      }
    }

    sendPosition(x: number, y: number): void {
      if (
        !this.isSocketOpen() ||
        !this.connectionOpened ||
        (!this.clientKey && legendmod.integrity)
      )
        return;

      const view = this.createView(13);
      view.setUint8(0, OPCODES.MOVE);

      if (this.player && !this.active) {
        view.setInt32(1, this.targetX, true);
        view.setInt32(5, this.targetY, true);
      } else {
        view.setInt32(1, x, true);
        view.setInt32(5, y, true);
        this.targetX = x;
        this.targetY = y;
      }

      view.setUint32(9, this.protocolKey!, true);
      this.sendMessage(view);
    }

    // --- Packet Handling ---

    handleMessage(view: DataView): void {
      let offset = 0;
      let opcode = view.getUint8(offset++);

      if (opcode === OPCODES.COMPRESSED_PACKET) {
        const buffer = window.buffer.Buffer;
        const msgBuf = new buffer(view.buffer);
        const decompressedSize = msgBuf.readUInt32LE(1);
        const decompressed = LZ4.decodeBlock(
          msgBuf.slice(5),
          new buffer(decompressedSize)
        );

        view = new DataView(decompressed.buffer);
        offset = 0;
        opcode = view.getUint8(offset++);
      }

      if (opcode === 54) opcode = 53;

      switch (opcode) {
        case OPCODES.UPDATE_NODES: // 16
          this.updateCells(view, offset);
          if (
            this.player &&
            this.active &&
            legendmod.playerCellsMulti.length === 0
          ) {
            this.terminate();
          }
          this.beforeCalculation();
          break;

        case 17: // View Update
          this.viewX = view.getFloat32(offset, true);
          offset += 4;
          this.viewY = view.getFloat32(offset, true);
          offset += 4;
          this.scale = view.getFloat32(offset, true);
          this.handleViewUpdateLogic();
          break;

        case 18: // Reset
          if (this.protocolKey) {
            this.protocolKey = this.shiftKey(this.protocolKey);
          }
          this.flushCellsData();
          break;

        case 32: // Own Cell ID
          const cellId = view.getUint32(offset, true);
          this.playerCellIDs.push(this.newID(cellId));
          this.isSpectateEnabled = false;
          break;

        case 49: // FFA Leaderboard
          this.leaderboard = [];
          const count49 = view.getUint32(offset, true);
          offset += 4;
          for (let i = 0; i < count49; ++i) {
            let isMe: number | string = view.getUint32(offset, true);
            offset += 4;
            const res = this.readString(view, offset);
            offset = res.offset;
            let nick = decodeURIComponent(escape(res.text));
            if (nick.includes("}")) {
              const parts = nick.split("}");
              const skinCode = parts[0].split("{")[1];
              nick = parts[1];
              if (skinCode && !application.customSkinsMap[nick]) {
                const url = `https://dkyriak.github.io/imsolo/${skinCode}.png`;
                core.registerSkin(nick, null, url, null);
                application.customSkinsMap[nick + "'s imsolo.pro bot"] = url;
              }
            }
            this.leaderboard.push({ id: isMe ? "isPlayer" : 0, nick: nick });
          }
          break;

        case 53: // Teams/Exp Leaderboard
          this.leaderboard = [];
          while (offset < view.byteLength) {
            const flags = view.getUint8(offset++);
            let nick = "";
            let id: number | string = 0;
            if (flags & 2) {
              const res = this.readString(view, offset);
              nick = decodeURIComponent(escape(res.text));
              offset = res.offset;
            }
            if (flags & 4) {
              id = view.getUint32(offset, true);
              offset += 4;
            }
            if (flags & 8) {
              nick = this.playerNick || "Me";
              id = "isPlayer";
            }
            this.leaderboard.push({
              nick: nick,
              id: id,
              isFriend: !!(flags & 16),
            });
          }
          break;

        case OPCODES.UPDATE_VIEWPORT: // 64
          if (!this.openFirst) {
            this.openFirst = true;
            this.viewMinX = view.getFloat64(offset, true);
            offset += 8;
            this.viewMinY = view.getFloat64(offset, true);
            offset += 8;
            this.viewMaxX = view.getFloat64(offset, true);
            offset += 8;
            this.viewMaxY = view.getFloat64(offset, true);
            this.setMapOffset(
              this.viewMinX,
              this.viewMinY,
              this.viewMaxX,
              this.viewMaxY
            );
          }
          break;

        case 69: // Ghost Cells
          const count69 = view.getUint16(offset, true);
          offset += 2;
          this.ghostCells = [];
          for (let i = 0; i < count69; i++) {
            const x = view.getInt32(offset, true);
            offset += 4;
            const y = view.getInt32(offset, true);
            offset += 4;
            const mass = view.getUint32(offset, true);
            offset += 4;
            offset += 1;
            const size = ~~Math.sqrt(100 * mass);
            this.ghostCells.push({
              x: x,
              y: y,
              size: size,
              mass: mass,
              inView: this.isInView(x, y),
            });
          }
          this.GhostFix();
          break;

        case 85: // Captcha
          toastr.warning(
            `<b>[Bot ${this.number}]:</b> Captcha requested from Multibox. Closing bot.`
          );
          this.terminate();
          break;

        case 87: // Captcha v3
          window.agarCaptcha.requestCaptchaV3("play", (token: string) => {
            const enc = new TextEncoder();
            const bytes = enc.encode(token);
            const b = this.createView(2 + bytes.length);
            b.setUint8(0, 88);
            new Uint8Array(b.buffer).set(bytes, 1);
            b.setUint8(bytes.length + 1, 0);
            this.sendMessage(b);
          });
          break;

        case 102: // Game Started
          this.handleSendNick();
          if (
            this.player &&
            !this.active &&
            !this.announcementTold &&
            Date.now() - this.timeStarted > 4000
          ) {
            this.announcementTold = true;
            toastr.warning(
              `<b>[Bot ${this.number}]:</b> Excessive delay for Multibox to start.`
            );
          }
          break;

        case 103: // Token Accepted
          this.accessTokenSent = true;
          if (window.ogarcopythelb) {
            application.cacheCustomSkin(
              window.ogarcopythelb.nick,
              window.ogario.playerColor,
              window.ogarcopythelb.skinURL
            );
          }
          this.getTheOppositeSocialToken();
          break;

        case 114:
          console.warn("[SPECT] Spectate mode is full");
          break;

        case 226: // Ping
          const pingSeq = view.getUint16(offset, true);
          const pong = this.createView(3);
          pong.setUint8(0, 227);
          pong.setUint16(1, pingSeq, true);
          this.sendMessage(pong);
          break;

        case 241: // Protocol Key
          this.protocolKey = view.getUint32(offset, true);
          const agarioReader = new Uint8Array(view.buffer, offset + 4);
          this.clientKey = this.generateClientKey(this.ws!, agarioReader);
          break;

        case OPCODES.SERVER_TICK: // 242
          this.serverTime = view.getUint32(offset, true) * 1000;
          if (this.player) {
            if (!window.MultiWS || window.MultiWS !== this.ws) {
              window.MultiWS = this.ws;
              this.getTheOppositeSocialToken();
            } else {
              SpectatorManager.checkMultiTokens(this);
              this.handleSendNick();
            }
          } else {
            this.sendSpectate();
          }
          if (this.staticX != null && this.staticY != null) {
            setInterval(() => {
              this.sendPosition(
                this.convertX(this.staticX!),
                this.convertY(this.staticY!)
              );
            }, 50);
            if (!this.player) this.sendFreeSpectate();
          }
          break;
      }
    }

    GhostFix(): void {
      if (
        !this.ghostFixed &&
        this.mapOffsetFixed &&
        this.ghostCells.length > 0
      ) {
        const ghostX = application.getghostX();
        const ghostY = application.getghostY();
        if (Math.abs(ghostX) > 100 && Math.abs(ghostY) > 100) {
          const gCell = this.ghostCells[0];
          this.fixX = ghostX / (gCell.x + this.mapOffsetX) < 0 ? -1 : 1;
          this.fixY = ghostY / (gCell.y + this.mapOffsetY) < 0 ? -1 : 1;
          this.ghostFixed = true;
        }
      }
    }

    handleViewUpdateLogic(): void {
      window.middleMultiViewFlag =
        defaultmapsettings.middleMultiViewWhenClose &&
        legendmod.play &&
        profiles[application.selectedOldProfile] &&
        checkIfPlayerIsInView(profiles[application.selectedProfile].nick);

      if (
        (defaultmapsettings.middleMultiView && legendmod.play) ||
        window.middleMultiViewFlag
      ) {
        legendmod.viewX = (legendmod.viewXTrue + this.viewX) / 2;
        legendmod.viewY = (legendmod.viewYTrue + this.viewY) / 2;
      } else if (this.player && window.multiboxPlayerEnabled) {
        legendmod.viewX = this.viewX;
        legendmod.viewY = this.viewY;
      }
    }

    updateCells(view: DataView, offset: number): void {
      // 1. Eat Events
      const eatCount = view.getUint16(offset, true);
      offset += 2;
      for (let i = 0; i < eatCount; i++) {
        const eaterID =
          legendmod.indexedCells[this.newID(view.getUint32(offset, true))];
        offset += 4;
        const victimID =
          legendmod.indexedCells[this.newID(view.getUint32(offset, true))];
        offset += 4;

        if (legendmod.playerCellsMulti.includes(victimID)) {
          this.removePlayerCell = true;
          legendmod.playerCellsMulti = legendmod.playerCellsMulti.filter(
            (c: any) => c !== victimID
          );
          this.playerCellIDs = this.playerCellIDs.filter(
            (id) => id !== victimID
          );
        }

        if (eaterID && victimID) {
          victimID.targetX = eaterID.x;
          victimID.targetY = eaterID.y;
          cleanPixiSprite(victimID); // Clean pixi sprite on eat
          victimID.removeCell();
        }
      }

      // 2. Cell Updates
      while (offset < view.byteLength) {
        let id = view.getUint32(offset, true);
        offset += 4;
        if (id === 0) break;

        let x = view.getInt32(offset, true);
        offset += 4;
        let y = view.getInt32(offset, true);
        offset += 4;
        const size = view.getUint16(offset, true);
        offset += 2;

        const flags = view.getUint8(offset++);
        let extendedFlags = 0;
        if (flags & 128) extendedFlags = view.getUint8(offset++);

        let color = null;
        let skin = null;
        let name = "";

        if (flags & 2) {
          const r = view.getUint8(offset++);
          const g = view.getUint8(offset++);
          const b = view.getUint8(offset++);
          color = legendmod.rgb2Hex(~~(r * 0.9), ~~(g * 0.9), ~~(b * 0.9));
        }
        if (flags & 4) {
          const res = this.readString(view, offset);
          skin = res.text;
          offset = res.offset;
        }
        if (flags & 8) {
          const res = this.readString(view, offset);
          name = decodeURIComponent(escape(res.text));
          offset = res.offset;
          if (legendmod.gameMode !== ":teams") {
            legendmod.vanillaskins(name, skin);
          }
        }

        const isVirus = !!(flags & 1);
        let isFood = !!(extendedFlags & 1);
        if (!legendmod.integrity && size < 21) isFood = true;

        id = this.newID(id);

        // Create/Update Cell Object
        let cell = legendmod.indexedCells[id];
        if (!cell) {
          cell = new window.legendmod1(
            id,
            x,
            y,
            size,
            color,
            isFood,
            isVirus,
            false,
            defaultmapsettings.shortMass,
            defaultmapsettings.virMassShots
          );
          cell.spectator = this.number;

          if (isFood) {
            // PIXI COMPATIBILITY: Push food to foodMulti so pixi renderer sees it
            if (!legendmod.foodMulti) legendmod.foodMulti = [];
            legendmod.foodMulti.push(cell);
          } else {
            // Standard handling for Players/Viruses
            if (this.playerCellIDs.includes(id)) {
              cell.isPlayerCell = true;
              if (!legendmod.playerCellsMulti.includes(cell)) {
                legendmod.playerCellsMulti.push(cell);
                if (legendmod.playerCellsMulti.length === 1) {
                  this.active = true;
                  this.sendCursor();
                  loadMultiCellSkin();
                }
              }
            }
            legendmod.cells.push(cell);
          }

          legendmod.indexedCells[id] = cell;
        } else {
          if (name) cell.targetNick = name;
          cell.targetX = x;
          cell.targetY = y;
          cell.targetSize = size;
        }
      }

      // 3. Remove Cells
      const removeCount = view.getUint16(offset, true);
      offset += 2;
      for (let i = 0; i < removeCount; i++) {
        const id = this.newID(view.getUint32(offset, true));
        offset += 4;
        const cell = legendmod.indexedCells[id];
        if (cell) {
          cleanPixiSprite(cell); // Clean pixi sprite on remove
          cell.removeCell();
        }
      }
    }

    readString(view: DataView, offset: number): { text: string; offset: number } {
      let end = offset;
      while (end < view.byteLength && view.getUint8(end) !== 0) end++;
      const text = this.textDecoder.decode(
        new DataView(view.buffer, offset, end - offset)
      );
      return { text, offset: end + 1 };
    }

    convertX(x: number): number {
      return ~~((x + legendmod.mapOffsetX) * this.fixX -
        this.mapOffsetX -
        this.fix3x);
    }
    convertY(y: number): number {
      return ~~((y + legendmod.mapOffsetY) * this.fixY -
        this.mapOffsetY -
        this.fix3y);
    }

    newID(id: number): number {
      return id + this.number * 1000000000;
    }

    setMapOffset(
      left: number,
      top: number,
      right: number,
      bottom: number
    ): void {
      this.mapSize = legendmod.integrity ? 14142 : Math.abs(left - right);
      this.mapOffset = legendmod.integrity ? this.mapSize / 2 : 0;

      if (legendmod.integrity) {
        this.mapOffsetX = this.mapOffset - right;
        this.mapOffsetY = this.mapOffset - bottom;
      } else {
        this.mapOffsetX = this.mapSize / 2;
        this.mapOffsetY = this.mapSize / 2;
      }
      this.mapOffsetFixed = true;
    }

    beforeCalculation(): void {
      if (legendmod.playerCellsMulti.length) {
        if (!this.openSecond) {
          this.openSecond = true;
          window.multiboxPlayerEnabled = this.number;
        }
        this.calculatePlayerMassAndPosition();
      } else {
        window.multiboxPlayerEnabled = null;
      }
    }

    calculatePlayerMassAndPosition(): void {
      let size = 0,
        targetSize = 0,
        x = 0,
        y = 0;
      const count = legendmod.playerCellsMulti.length;

      for (const cell of legendmod.playerCellsMulti) {
        size += cell.size;
        targetSize += cell.targetSize * cell.targetSize;
        x += cell.x / count;
        y += cell.y / count;
      }

      this.playerX = x;
      this.playerY = y;

      if (window.multiboxPlayerEnabled) {
        legendmod.viewX = x + this.fix3x;
        legendmod.viewY = y + this.fix3y;
      }

      if (!this.openThird) {
        this.openThird = true;
        window.targetingLeadX = this.playerX;
        window.targetingLeadY = this.playerY;
        legendmod.drawCommander2 = true;
      }

      this.playerSize = size;
      this.playerMass = ~~(targetSize / 100);
    }

    terminate(): void {
      this.active = null;
      window.multiboxPlayerEnabled = null;
      if (!legendmod.play) application.showMenu();

      const idx = this.number - 1;
      if (SpectatorManager.spects[idx]) {
        SpectatorManager.spects[idx].closeConnection();
        SpectatorManager.spects.splice(idx, 1);
      }
    }

    handleSendNick(): void {
      const profile = profiles[application.selectedOldProfile];
      if (profile?.nick && defaultmapsettings.multiBoxShadow) {
        this.sendNick(profile.nick);
        this.nick = profile.nick;
      } else {
        const uiNick =
          (document.getElementById("nick") as HTMLInputElement)?.value ||
          "Spectator";
        this.sendNick(uiNick);
        this.nick = uiNick;
      }
    }

    isInView(x: number, y: number): boolean {
      // Basic check if a coordinate is within the viewport logic
      // Requires legendmod view variables to be set
      const w = window.innerWidth / 2;
      const h = window.innerHeight / 2;
      return (
        x > legendmod.viewX - w &&
        x < legendmod.viewX + w &&
        y > legendmod.viewY - h &&
        y < legendmod.viewY + h
      );
    }

    shiftKey(key: number): number {
      const value = 1540483477;
      key = Math.imul(key, value) | 0;
      key = (Math.imul(key >>> 24 ^ key, value) | 0) ^ 114296087;
      key = Math.imul(key >>> 13 ^ key, value) | 0;
      return key >>> 15 ^ key;
    }

    shiftMessage(view: DataView, key: number, write = false): DataView {
      const buffer = new Uint8Array(
        view.buffer,
        view.byteOffset,
        view.byteLength
      );
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= (key >>> ((i % 4) * 8)) & 255;
      }
      return view;
    }

generateClientKey(
      ip: string | undefined,
      options: Uint8Array
    ): number | null {
      if (!ip || !ip.length || !options.byteLength) return null;

      // 1. Convert IP string to Byte Array
      const ipBytes: number[] = [];
      for (let i = 0; i < ip.length; i++) {
        ipBytes.push(ip.charCodeAt(i));
      }

      // 2. Create a merged buffer (Options + IP)
      // We must combine them because originalCryptoLogic iterates based on the total length.
      const combinedBuffer = new Uint8Array(options.byteLength + ipBytes.length);
      combinedBuffer.set(options, 0);
      combinedBuffer.set(ipBytes, options.byteLength);

      // 3. Execute Crypto Logic
      return this.originalCryptoLogic(
        combinedBuffer,
        combinedBuffer.byteLength
      );
    }

    originalCryptoLogic(uint8Arr: Uint8Array, newLength: number): number {
      const Length = 1540483477;
      const dataview = new DataView(uint8Arr.buffer, uint8Arr.byteOffset, uint8Arr.byteLength);
      
      let type = newLength - 1;
      const value = ((type - 4) & -4) + 4 | 0;
      let newValue = type ^ 255;
      let offset = 0;
      let x = 0;

      // Process 4-byte chunks
      while (type > 3) {
        // Read 32-bit integer (Little Endian)
        const chunk = dataview.getInt32(offset, true);
        
        // Math.imul simulates C-like 32-bit multiplication
        x = Math.imul(chunk, Length) | 0;
        
        // Bitwise mixing
        newValue = (Math.imul(x >>> 24 ^ x, Length) | 0) ^ (Math.imul(newValue, Length) | 0);
        
        type -= 4;
        offset += 4;
      }

      // Handle remaining bytes (0-3 bytes)
      switch (type) {
        case 3:
          newValue = (uint8Arr[value + 2] << 16) ^ newValue;
          // Fallthrough intended
        case 2:
          newValue = (uint8Arr[value + 1] << 8) ^ newValue;
          break;
      }

      // Final mix
      x = newValue;
      if (type !== 3 && type !== 2) { 
        // If we didn't hit the switch cases above, logic suggests we might XOR here
        // However, based on the standard algo structure:
        x = Math.imul(uint8Arr[value] ^ newValue, Length) | 0;
      } else {
        // Recalculate x if we fell through switch
        x = Math.imul(uint8Arr[value] ^ newValue, Length) | 0;
      }

      newValue = x >>> 13;
      x = newValue ^ x;
      x = Math.imul(x, Length) | 0;
      newValue = x >>> 15;
      x = newValue ^ x;

      return x;
    }

originalCryptoLogic(uint8Arr: Uint8Array, newLength: number): number {
      const Length = 1540483477;
      // Ensure we look at the correct slice of the buffer
      const dataview = new DataView(
        uint8Arr.buffer,
        uint8Arr.byteOffset,
        uint8Arr.byteLength
      );

      let type = newLength - 1;
      // Calculate the alignment for the tail bytes
      const value = ((type - 4) & -4) + 4 | 0;
      let newValue = type ^ 255;
      let offset = 0;
      let x = 0;

      // Process 4-byte chunks
      while (type > 3) {
        x = Math.imul(dataview.getInt32(offset, true), Length) | 0;
        newValue =
          (Math.imul(x >>> 24 ^ x, Length) | 0) ^
          (Math.imul(newValue, Length) | 0);
        type -= 4;
        offset += 4;
      }

      // Process remaining bytes (Tail)
      switch (type) {
        case 3:
          newValue = (uint8Arr[value + 2] << 16) ^ newValue;
          // Falls through
        case 2:
          newValue = (uint8Arr[value + 1] << 8) ^ newValue;
          break;
      }

      // Mix the final byte and combine
      if (x !== newValue) {
        x = Math.imul(uint8Arr[value] ^ newValue, Length) | 0;
      }

      // Final Avalanching
      newValue = x >>> 13;
      x = newValue ^ x;
      x = Math.imul(x, Length) | 0;
      newValue = x >>> 15;
      x = newValue ^ x;

      return x;
    }

      switch (type) {
        case 3:
          newValue = (uint8Arr[value + 2] << 16) ^ newValue;
        case 2:
          newValue = (uint8Arr[value + 1] << 8) ^ newValue;
          break;
      }

      if (x !== newValue)
        x = Math.imul(uint8Arr[value] ^ newValue, Length) | 0;

      newValue = x >>> 13;
      x = newValue ^ x;
      x = Math.imul(x, Length) | 0;
      newValue = x >>> 15;
      x = newValue ^ x;

      return x;
    }
  }
})();