var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const RECAPTCHA_V2_KEY = "6LfjUBcUAAAAAF6y2yIZHgHIOO5Y3cU5osS2gbMl";
const RECAPTCHA_V3_KEY = "6LcEt74UAAAAAIc_T6dWpsRufGCvvau5Fd7_G1tY";
export function ProcessParentMessage(message) {
  if (message === "doCaptcha") {
    window.agarCaptcha.requestCaptchaV3("play", function(token) {
      window.lasttoken = token;
      console.log("captcha-" + token);
      if (window.opener) {
        window.opener.postMessage(token, "*");
      }
    });
  }
}
class Recaptcha {
  constructor(curtin, elementId, arg) {
    __publicField(this, "id");
    __publicField(this, "curtin");
    __publicField(this, "widget", null);
    __publicField(this, "ready", false);
    __publicField(this, "sessionExpired", false);
    this.id = elementId;
    this.curtin = curtin;
    window.recaptchaClientId = null;
    this.hide();
  }
  init() {
    this.ready = true;
  }
  show() {
    this.sessionExpired = false;
    const el = document.getElementById(this.curtin);
    if (el) el.style.display = "block";
  }
  hide() {
    const el = document.getElementById(this.curtin);
    if (el) el.style.display = "none";
  }
  reset() {
    console.log("grecaptcha.reset()");
  }
  onRender(token) {
    window.cookieCaptchaOK = true;
    console.log("cookieCaptchaOK-true");
    if (window.legendmod && window.legendmod.botscaptcha) {
      window.legendmod.botscaptcha = null;
      const speedVal = $("#captchaSpeed").val();
      window.tempol = speedVal;
      if (speedVal == null || speedVal === "") {
        window.tempol = 0;
      }
      window.tempo2 = token;
      setTimeout(() => {
        window.legendmod.sendSpawn2(window.tempo2);
      }, Number(window.tempol) * 1e3);
    }
    console.log(
      "\x1B[32m%s\x1B[34m%s\x1B[0m",
      consoleMsgLM,
      " requestCaptcha bypass v2, v3 loaded"
    );
    window.sendTimeOutTokenBots = true;
    console.log("sendTimeOutTokenBots-true");
    if (window.core) {
      window.core.recaptchaResponse(token);
    }
    this.hide();
    this.reset();
  }
  validateExpire() {
    console.log("i.sessionExpired && i.show()");
    if (this.sessionExpired) {
      this.show();
    }
  }
  onExpire() {
    console.log("EXPIRE");
  }
  render() {
    if (this.ready) {
      this.show();
      if (this.widget === null) {
        this.widget = grecaptcha.render(this.id, {
          sitekey: RECAPTCHA_V2_KEY,
          callback: this.onRender.bind(this),
          "data-theme": "dark",
          "expired-callback": this.onExpire.bind(this)
        });
        window.captchawidget = this.widget;
      }
    } else {
      this.reset();
    }
    return this.ready;
  }
}
function CaptchaRouter(arg) {
  const l = window.myCaptcha = new Recaptcha(
    "captchaWindow",
    "verifyUser",
    arg
  );
  function load() {
  }
  function requestCaptcha() {
    return l.render();
  }
  function requestCaptchaV3(action, callback) {
    if (window.recaptchaClientId === null) {
      window.recaptchaClientId = window.grecaptchaV3.render("captchaWindowV3", {
        sitekey: RECAPTCHA_V3_KEY,
        badge: "inline",
        size: "invisible"
      });
    }
    grecaptcha.reset(window.recaptchaClientId);
    window.grecaptchaV3.execute(window.recaptchaClientId, {
      action
    }).then(function(token) {
      callback(token);
    });
  }
  function onloadCallback() {
    l.init();
    window.cookieCaptchaOK = true;
    console.log("cookieCaptchaOK-true");
  }
  function onloadCallbackV3() {
    Object.defineProperty(window, "grecaptchaV3", {
      value: window.grecaptcha,
      writable: false,
      configurable: false,
      enumerable: false
    });
    window.cookieCaptchaOK = true;
    console.log("cookieCaptchaOK-true");
  }
  window.onloadCallbackV3 = onloadCallbackV3;
  window.onloadCallback = onloadCallback;
  load();
  return {
    load,
    validateExpire: l.validateExpire.bind(l),
    requestCaptcha,
    requestCaptchaV3,
    onloadCallback,
    onloadCallbackV3
  };
}
window.agarCaptcha = CaptchaRouter();
