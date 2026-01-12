/**
 * Legend Express - Captcha Router & Handler
 * Converted to TypeScript
 */

// ==========================================
// 1. Type Definitions & Global Interfaces
// ==========================================

declare global {
  interface Window {
    recaptchaClientId: number | null;
    grecaptchaV3: ReCaptchaInstance;
    grecaptcha: ReCaptchaInstance;
    cookieCaptchaOK: boolean;
    myCaptcha: Recaptcha;
    onloadCallback: () => void;
    onloadCallbackV3: () => void;
    agarCaptcha: CaptchaRouterInterface;
    captchawidget: number | null;
    sendTimeOutTokenBots: boolean;
    lasttoken: string;

    // Temporary variables used in original script
    tempol: any;
    tempo2: string;

    // External/Mod objects
    core: {
      recaptchaResponse: (token: string) => void;
    };
    legendmod: {
      botscaptcha: boolean | null;
      sendSpawn2: (token: string) => void;
    };
  }

  // External Libraries
  const $: any;
  const consoleMsgLM: string;
  const grecaptcha: ReCaptchaInstance;
}

interface ReCaptchaInstance {
  render: (container: string | HTMLElement, parameters: any) => number;
  reset: (widgetId?: number | null) => void;
  execute: (
    widgetId: number | null,
    params: { action: string },
  ) => Promise<string>;
}

interface CaptchaRouterInterface {
  load: () => void;
  validateExpire: () => void;
  requestCaptcha: () => boolean;
  requestCaptchaV3: (action: string, callback: (token: string) => void) => void;
  onloadCallback: () => void;
  onloadCallbackV3: () => void;
}

// ==========================================
// 2. Constants
// ==========================================

const RECAPTCHA_V2_KEY = "6LfjUBcUAAAAAF6y2yIZHgHIOO5Y3cU5osS2gbMl";
const RECAPTCHA_V3_KEY = "6LcEt74UAAAAAIc_T6dWpsRufGCvvau5Fd7_G1tY";

// ==========================================
// 3. Helper Functions
// ==========================================

export function ProcessParentMessage(message: string): void {
  if (message === "doCaptcha") {
    window.agarCaptcha.requestCaptchaV3("play", function (token: string) {
      window.lasttoken = token;
      console.log("captcha-" + token);
      if (window.opener) {
        window.opener.postMessage(token, "*");
      }
    });
  }
}

// ==========================================
// 4. Recaptcha Class
// ==========================================

class Recaptcha {
  public id: string;
  public curtin: string;
  public widget: number | null = null;
  public ready: boolean = false;
  public sessionExpired: boolean = false;

  constructor(curtin: string, elementId: string, arg?: any) {
    this.id = elementId;
    this.curtin = curtin;
    window.recaptchaClientId = null;
    this.hide();
  }

  public init(): void {
    this.ready = true;
  }

  public show(): void {
    this.sessionExpired = false;
    const el = document.getElementById(this.curtin);
    if (el) el.style.display = "block";
  }

  public hide(): void {
    const el = document.getElementById(this.curtin);
    if (el) el.style.display = "none";
  }

  public reset(): void {
    console.log("grecaptcha.reset()");
  }

  public onRender(token: string): void {
    window.cookieCaptchaOK = true;
    console.log("cookieCaptchaOK-true");

    if (window.legendmod && window.legendmod.botscaptcha) {
      window.legendmod.botscaptcha = null;

      // Handle JQuery value safely
      const speedVal = $("#captchaSpeed").val();
      window.tempol = speedVal;

      if (speedVal == null || speedVal === "") {
        window.tempol = 0;
      }
      window.tempo2 = token;

      setTimeout(() => {
        window.legendmod.sendSpawn2(window.tempo2);
      }, Number(window.tempol) * 1000);
    }

    console.log(
      "\x1b[32m%s\x1b[34m%s\x1b[0m",
      consoleMsgLM,
      " requestCaptcha bypass v2, v3 loaded",
    );
    window.sendTimeOutTokenBots = true;
    console.log("sendTimeOutTokenBots-true");

    if (window.core) {
      window.core.recaptchaResponse(token);
    }

    this.hide();
    this.reset();
  }

  public validateExpire(): void {
    console.log("i.sessionExpired && i.show()");
    if (this.sessionExpired) {
      this.show();
    }
  }

  public onExpire(): void {
    console.log("EXPIRE");
  }

  public render(): boolean {
    if (this.ready) {
      this.show();
      if (this.widget === null) {
        this.widget = grecaptcha.render(this.id, {
          sitekey: RECAPTCHA_V2_KEY,
          callback: this.onRender.bind(this),
          "data-theme": "dark",
          "expired-callback": this.onExpire.bind(this),
        });
        window.captchawidget = this.widget;
      }
    } else {
      this.reset();
    }
    return this.ready;
  }
}

// ==========================================
// 5. Captcha Router (Factory)
// ==========================================

function CaptchaRouter(arg?: any): CaptchaRouterInterface {
  // Instantiate the handler
  const l = window.myCaptcha = new Recaptcha(
    "captchaWindow",
    "verifyUser",
    arg,
  );

  function load(): void {
    // Placeholder for loading logic if needed
  }

  function requestCaptcha(): boolean {
    return l.render();
  }

  function requestCaptchaV3(
    action: string,
    callback: (token: string) => void,
  ): void {
    if (window.recaptchaClientId === null) {
      window.recaptchaClientId = window.grecaptchaV3.render("captchaWindowV3", {
        sitekey: RECAPTCHA_V3_KEY,
        badge: "inline",
        size: "invisible",
      });
    }

    grecaptcha.reset(window.recaptchaClientId);

    window.grecaptchaV3.execute(window.recaptchaClientId, {
      action: action,
    }).then(function (token) {
      callback(token);
    });
  }

  function onloadCallback(): void {
    l.init();
    window.cookieCaptchaOK = true;
    console.log("cookieCaptchaOK-true");
  }

  function onloadCallbackV3(): void {
    // Mocking V3 with existing grecaptcha if needed, or ensuring V3 exists
    Object.defineProperty(window, "grecaptchaV3", {
      value: window.grecaptcha,
      writable: false,
      configurable: false,
      enumerable: false,
    });
    window.cookieCaptchaOK = true;
    console.log("cookieCaptchaOK-true");
  }

  // Expose Global Callbacks
  window.onloadCallbackV3 = onloadCallbackV3;
  window.onloadCallback = onloadCallback;

  // Initial Load
  load();

  return {
    load: load,
    validateExpire: l.validateExpire.bind(l),
    requestCaptcha: requestCaptcha,
    requestCaptchaV3: requestCaptchaV3,
    onloadCallback: onloadCallback,
    onloadCallbackV3: onloadCallbackV3,
  };
}

// Initialize
window.agarCaptcha = CaptchaRouter();