// ==========================================
// Type Definitions & Global Interfaces
// ==========================================

interface EnvConfig {
  fb_app_id?: string;
  google_client_id?: string;
  master_url?: string;
  configVersion?: string;
}

interface UserInfo {
  socialToken: string | null;
  tokenExpires: string;
  level: string;
  xp: string;
  xpNeeded: string;
  name: string;
  picture: string;
  displayName: string;
  loggedIn: string;
  socialId: string;
}

interface LoginOptions {
  context: "facebook" | "google" | null;
  defaultProvider: string;
  loginIntent: string;
  userInfo: UserInfo;
}

interface MasterHeaders {
  fb_app_id: string;
  gplus_client_id: string;
  master_url: string;
  endpoint_version: string;
  proto_version: string;
  client_version: number;
  client_version_string: string;
  protocolVersion: number;
}

interface RegionObj {
  [key: string]: string;
}

// Augment the Window interface to include globals used in this script
declare global {
  interface Window {
    EnvConfig: EnvConfig;
    loggedIn: boolean;
    getLatestID: string;
    MultiPending: any; // Type as needed
    master: any; // The main master object
    agarCaptcha: any;
    core: any; // The game core (WASM/Obfuscated JS)
    gapi: any; // Google API
    FB: any; // Facebook API
    fbAsyncInit: () => void;
    gapiAsyncInit: () => void;
    LMGameConfiguration: any;
    agarversion: string;
    facebookFriends: any[];
    friends: string[];
    // Undefined variables referenced in original script (likely obfuscated/external)
    Premadeletter123: string;
    Premadeletter126: string;
    Premadeletter127: string;
    Premadeletter134: string;
    Premadeletter135: string;
    Premadeletter136: string;
    Premadeletter137: string;
    Premadeletter138: string;
    Premadeletter139: string;
    Premadeletter139a: string;
    Premadeletter140: string;
    Premadeletter140a: string;
    kFormatter: (num: number) => string;
  }
  // JQuery extension if needed
  const $: any;
  const toastr: any;
}

// ==========================================
// Main Script Logic
// ==========================================

const consoleMsgLMMaster = "[Master] ";

window.EnvConfig = {};
window.EnvConfig.fb_app_id = self.localStorage.getItem("EnvConfig.fb_app_id") ||
  undefined;
window.EnvConfig.google_client_id =
  self.localStorage.getItem("EnvConfig.google_client_id") || undefined;
window.EnvConfig.master_url =
  self.localStorage.getItem("EnvConfig.master_url") || undefined;
window.EnvConfig.configVersion =
  self.localStorage.getItem("EnvConfig.configVersion") || undefined;

window.loggedIn = false;

if (!(document.URL && document.URL.includes("jimboy3100.github.io"))) {
  $.ajax("//agar.io/index.html", {
    error() {},
    success(sketchContents: string) {
      // const parsed = $.parseHTML(sketchContents); // Unused in original logic
      const match = sketchContents.match(/EnvConfig = \{[^}]+}/);
      if (match) {
        window.EnvConfig = match[0] as any; // This assigns the string, next line evals it
        const runEnvConfig = new Function(match[0]);

        runEnvConfig(); // This populates window.EnvConfig object
        if (window.EnvConfig.fb_app_id) {
          localStorage.setItem(
            "EnvConfig.fb_app_id",
            window.EnvConfig.fb_app_id,
          );
        }
        if (window.EnvConfig.google_client_id) {
          localStorage.setItem(
            "EnvConfig.google_client_id",
            window.EnvConfig.google_client_id,
          );
        }
        if (window.EnvConfig.master_url) {
          localStorage.setItem(
            "EnvConfig.master_url",
            window.EnvConfig.master_url,
          );
        }
        if (window.EnvConfig.configVersion) {
          localStorage.setItem(
            "EnvConfig.configVersion",
            window.EnvConfig.configVersion,
          );
        }
      }
    },
    dataType: "text",
    method: "GET",
    cache: false,
    crossDomain: true,
  });
}

if (window.EnvConfig.master_url != null) {
  $.ajax(window.EnvConfig.master_url + "/getLatestID", {
    error() {},
    success(sketchContents: string) {
      const getLatestIDtemp = $.parseHTML(sketchContents);
      window.getLatestID = getLatestIDtemp[0].textContent;
      localStorage.setItem("getLatestID", window.getLatestID);
    },
    dataType: "text",
    method: "GET",
    cache: false,
    crossDomain: true,
  });
}

// Initialize
legendmaster(window);

function legendmaster(self: Window) {
  // --- Variables ---
  let options: LoginOptions = {
    context: null,
    defaultProvider: "facebook",
    loginIntent: "0",
    userInfo: {
      socialToken: null,
      tokenExpires: "",
      level: "",
      xp: "",
      xpNeeded: "",
      name: "",
      picture: "",
      displayName: "",
      loggedIn: "0",
      socialId: "",
    },
  };

  let headers: MasterHeaders;

  if (
    window.EnvConfig.fb_app_id && window.EnvConfig.google_client_id &&
    window.EnvConfig.master_url
  ) {
    headers = {
      fb_app_id: window.EnvConfig.fb_app_id,
      gplus_client_id: window.EnvConfig.google_client_id,
      master_url: window.EnvConfig.master_url.replace("https://", ""),
      endpoint_version: "v4",
      proto_version: "15.0.3",
      client_version: 31100,
      client_version_string: "3.11.0",
      protocolVersion: 23,
    };
  } else if (window.EnvConfig.master_url) {
    headers = {
      fb_app_id: "677505792353827",
      gplus_client_id:
        "686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com",
      master_url: window.EnvConfig.master_url.replace("https://", ""),
      endpoint_version: "v4",
      proto_version: "15.0.3",
      client_version: 31100,
      client_version_string: "3.11.0",
      protocolVersion: 23,
    };
  } else {
    headers = {
      fb_app_id: "677505792353827",
      gplus_client_id:
        "686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com",
      master_url: "webbouncer-live-v8-0.agario.miniclippt.com",
      endpoint_version: "v4",
      proto_version: "15.0.3",
      client_version: 31100,
      client_version_string: "3.11.0",
      protocolVersion: 23,
    };
  }

  // Assign to window for external access
  (window as any).LMagarioheaders = headers;

  let l = false; // Login initialized flag
  let f = 0; // Failure counter
  let api: any = null; // Google Auth API

  // --- Internal Functions ---

  function login() {
    if (l) {
      self.getStorage();
      if ("1" === options.loginIntent && "facebook" === options.context) {
        self.FB.getLoginStatus(function (res: any) {
          if (res.status === "connected") {
            init(res);
          } else {
            self.logout();
          }
        });
      }
      // Reset handlers to prevent recursion/loops
      self.facebookRelogin = clear;
      self.facebookLogin = clear;
    }
  }

  function clear(nbToClear?: any) {
    if (null !== self.FB) {
      options.loginIntent = "1";
      options.context = "facebook";
      self.updateStorage();

      self.FB.login(function (requestTokenResult: any) {
        init(requestTokenResult);
      }, {
        scope: "public_profile, email",
      });
      return true;
    }
    alert(
      "You seem to have something blocking Facebook on your browser, please check for any extensions",
    );
    return false;
  }

  function init(response: any) {
    if (response.status === "connected") {
      const accessToken = response.authResponse.accessToken;
      if (accessToken) {
        if (window.MultiPending) {
          self.master.accessTokenFB = accessToken;
          // MultiTokenReady(window.MultiPending); // Function definition missing in snippet, assumed global
          (window as any).MultiTokenReady(window.MultiPending);
          window.MultiPending = null;
        } else {
          self.master.doLoginWithFB(accessToken);
          self.FB.api(
            "/me/picture?width=180&height=180",
            function (images: any) {
              if (images.data && images.data.url) {
                options.userInfo.picture = images.data.url;
                $(".agario-profile-picture").attr("src", images.data.url);
                self.updateStorage();
              }
            },
          );

          doFB();

          $("#helloContainer").attr("data-logged-in", "1");
          $("#login-google").attr("class", "menu-bar-button");
          $("#login-facebook").attr("class", "menu-bar-button barf");

          toastr.info(
            "<b>[" + window.Premadeletter123 + "]:</b> " +
              window.Premadeletter126 + " Facebook!",
          );
          window.loggedIn = true;
        }
      } else {
        if (f < 3) {
          f++;
          self.facebookRelogin();
          self.logout();
          window.loggedIn = false;
        }
      }
    }
  }

  function setup() {
    self.gapi.load("auth2", function () {
      api = self.gapi.auth2.init({
        client_id: headers.gplus_client_id,
        cookie_policy: "single_host_origin",
        scope: "profile",
        app_package_name: "com.miniclip.agar.io",
      });
      const contextMenu = document.getElementById("gplusLogin");
      if (contextMenu) {
        contextMenu.addEventListener("click", function () {
          options.loginIntent = "1";
          options.context = "google";
          self.updateStorage();
        });
        api.attachClickHandler(contextMenu);
      }
      api.currentUser.listen(transform);
      api.then(get);
    });
  }

  function get() {
    api.currentUser.get();
    if (
      "1" === options.loginIntent && options.context === "google" &&
      !api.isSignedIn.get()
    ) {
      api.signIn();
    }
  }

  function transform(event: any) {
    if (
      event && api && "1" === options.loginIntent &&
      options.context === "google" && api.isSignedIn.get()
    ) {
      if (window.MultiPending) {
        self.master.accessTokenGPlus = event.getAuthResponse().id_token;
        (window as any).MultiTokenReady(window.MultiPending);
        window.MultiPending = null;
      } else {
        const idToken = event.getAuthResponse().id_token;
        const attrVal = event.getBasicProfile().getImageUrl();
        self.master.doLoginWithGPlus(idToken);
        if (attrVal) {
          options.userInfo.picture = attrVal;
          self.updateStorage();
          $(".agario-profile-picture").attr("src", attrVal);
        }

        doGl();

        $("#helloContainer").attr("data-logged-in", "1");
        $("#login-facebook").attr("class", "menu-bar-button");
        $("#login-google").attr("class", "menu-bar-button barf");
        toastr.info(
          "<b>[" + window.Premadeletter123 + "]:</b> " +
            window.Premadeletter126 + " Google!",
        );
        window.loggedIn = true;
      }
    }
  }

  // --- Master Object Definition ---

  self.master = {
    ws: null,
    serverIP: null,
    endpoint: null,
    region: "",
    gameMode: ":ffa",
    partyToken: "",
    findingServer: 0,
    curValidFindServer: 0,
    backoffPeriod: 500,
    regionNames: {} as any,
    context: "",
    accessToken: null,
    clientVersion: headers.client_version,
    clientVersionString: headers.client_version_string,
    xsupportprotoversion: headers.proto_version,
    protocolVersion: headers.protocolVersion,
    master_url_http: "https://" + headers.master_url,

    getClientVersion() {
      if (null !== self.localStorage.getItem("ogarioClientVersionString")) {
        this.clientVersionString = self.localStorage.getItem(
          "ogarioClientVersionString",
        );
        this.clientVersion = this.parseClientVersion(this.clientVersionString);
      }
      if (null !== self.localStorage.getItem("ogarioXProtoVersion")) {
        this.xsupportprotoversion = self.localStorage.getItem(
          "ogarioXProtoVersion",
        );
      }
      if (null !== self.localStorage.getItem("ogarioProtocolVersion")) {
        this.protocolVersion = self.localStorage.getItem(
          "ogarioProtocolVersion",
        );
      }

      const that = this;
      if (!(document.URL && document.URL.includes("jimboy3100.github.io"))) {
        setTimeout(function () {
          ajaxrequestMaster();
        }, 500);

        $.ajax("//agar.io/agario.core.js", {
          error() {},
          success(sketchContents: string) {
            const optionMatch = sketchContents.match(
              /\w\[\w\+\d+>>\d\]=\w;\w+\(\w,(\d+)\);/,
            );
            if (optionMatch) {
              const pluginName = optionMatch[1];
              that.setProtocolVersion(pluginName);
            }
          },
          dataType: "text",
          method: "GET",
          cache: false,
          crossDomain: true,
        });
      }
    },

    setClientVersion(clientVersion: number, serverVersion: string) {
      if (this.clientVersion != clientVersion) {
        console.log(
          "\x1b[31m%s\x1b[34m%s\x1b[0m",
          consoleMsgLMMaster,
          " Changing client version...",
        );
        this.clientVersion = clientVersion;
        this.clientVersionString = serverVersion;
        if (self.core) {
          self.core.setClientVersion(clientVersion, serverVersion);
        }
        self.localStorage.setItem("ogarioClientVersionString", serverVersion);
        console.log(
          "\x1b[31m%s\x1b[34m%s\x1b[0m",
          consoleMsgLMMaster,
          " setClientVersion called, reconnecting",
        );
        this.reconnect(true);
      }
    },

    setxsupportprotoversion(serverVersion: string) {
      if (this.xsupportprotoversion != serverVersion) {
        console.log(
          "\x1b[31m%s\x1b[34m%s\x1b[0m",
          consoleMsgLMMaster,
          " Changing x-support version...",
        );
        this.xsupportprotoversion = serverVersion;
        self.localStorage.setItem("ogarioXProtoVersion", serverVersion);
        console.log(
          "\x1b[31m%s\x1b[34m%s\x1b[0m",
          consoleMsgLMMaster,
          " setxsupportprotoversion called, reconnecting",
        );
        this.reconnect(true);
      }
    },

    setProtocolVersion(serverVersion: number) {
      if (this.protocolVersion != serverVersion) {
        console.log(
          "\x1b[31m%s\x1b[34m%s\x1b[0m",
          consoleMsgLMMaster,
          " Changing protocol version...",
        );
        this.protocolVersion = serverVersion;
        self.localStorage.setItem("ogarioProtocolVersion", serverVersion);
        console.log(
          "\x1b[31m%s\x1b[34m%s\x1b[0m",
          consoleMsgLMMaster,
          " ProtocolVersion called, reconnecting",
        );
        this.reconnect(true);
      }
    },

    parseClientVersion(styleValue: string) {
      return 10000 * parseInt(styleValue.split(".")[0]) +
        100 * parseInt(styleValue.split(".")[1]) +
        parseInt(styleValue.split(".")[2]);
    },

    getRegionCode() {
      const nextNodeLoc = window.localStorage.getItem("location");
      if (nextNodeLoc) {
        this.setRegion(nextNodeLoc, ![]); // ![] is false
        if (!this.checkPartyHash()) {
          this.reconnect();
        }
        return;
      }
      const canvasLayersManager = this;
      (window as any).userData = $.ajax(this.master_url_http + "/getCountry", {
        beforeSend(xhr: any) {
          return xhr.setRequestHeader("Accept", "text/plain"),
            xhr.setRequestHeader("Accept", "*/*"),
            xhr.setRequestHeader("Accept", "q=0.01"),
            xhr.setRequestHeader("Content-Type", "application/octet-stream"),
            xhr.setRequestHeader(
              "x-support-proto-version",
              this.xsupportprotoversion,
            ),
            xhr.setRequestHeader("x-client-version", this.clientVersion),
            true;
        },
        error() {},
        success(playlistCopy: any) {
          $("#response").html(JSON.stringify(playlistCopy, null, 4));
          if ((window as any).userData != null) {
            localStorage.setItem(
              "userData",
              JSON.stringify((window as any).userData),
            );
          }

          if (playlistCopy) {
            console.log(playlistCopy.country);
            canvasLayersManager.setRegionCode(playlistCopy.country);
          } else if ((window as any).userData) {
            setTimeout(function () {
              canvasLayersManager.setRegionCode(
                (window as any).userData.responseJSON.country,
              );
            }, 2000);
          }
        },
        dataType: "json",
        method: "POST",
        processData: false,
        cache: false,
        crossDomain: true,
      });
    },

    setRegionCode(segment: string) {
      // Assumes 'regionobj' is global or accessible, explicitly undefined in snippet so treated as any
      if (
        (window as any).regionobj &&
        (window as any).regionobj.hasOwnProperty(segment)
      ) {
        this.setRegion((window as any).regionobj[segment], false);
        if (!this.checkPartyHash()) {
          this.reconnect();
        }
      }
    },

    setRegion(items: string, left: boolean) {
      if (null == left) {
        left = true;
      }
      if (items) {
        this.region = items;
        self.localStorage.setItem("location", items);
        if ($("#region").val() !== items) {
          $("#region").val(items);
        }
        if (left) {
          this.reconnect();
        }
      }
    },

    checkRegion() {
      const x = $("#region");
      let options = x.val();
      if (options) {
        self.localStorage.setItem("location", options);
      } else {
        options = self.localStorage.getItem("location");
        if (options) {
          $("#region").val(options);
        }
      }
      if (x.val()) {
        $("#locationKnown").append(x);
      } else {
        $("#locationUnknown").append(x);
      }
    },

    refreshRegionInfo() {
      const that = this;
      this.makeMasterSimpleRequest("info", "text", function (data: any) {
        const regions = (data = JSON.parse(data)).regions;
        for (const i in regions) {
          if (regions.hasOwnProperty(i)) {
            let tempRegion = that.regionNames[i];
            if (that.regionNames[i] == "North America") {
              tempRegion = window.Premadeletter134;
            } else if (that.regionNames[i] == "South America") {
              tempRegion = window.Premadeletter135;
            } else if (that.regionNames[i] == "Europe") {
              tempRegion = window.Premadeletter136;
            } else if (that.regionNames[i] == "Ukraine") {
              tempRegion = window.Premadeletter137;
            } else if (that.regionNames[i] == "Turkey") {
              tempRegion = window.Premadeletter138;
            } else if (that.regionNames[i] == "East Asia") {
              tempRegion = window.Premadeletter139;
            } else if (that.regionNames[i] == "China") {
              tempRegion = window.Premadeletter139a;
            } else if (that.regionNames[i] == "Oceania") {
              tempRegion = window.Premadeletter140;
            } else if (that.regionNames[i] == " -- Select a Region -- ") {
              tempRegion = window.Premadeletter140a;
            }
            $('#region option[value="' + i + '"]').text(
              tempRegion + " (" + regions[i].numPlayers + ")",
            );
          }
        }
      });
    },

    getRegionNames() {
      const PL$5 = this;
      $("#region option").each(function (this: any) {
        const bigg_id = $(this).val();
        const this_gene_data = $(this).text();
        if (!PL$5.regionNames.hasOwnProperty(bigg_id)) {
          PL$5.regionNames[bigg_id] = this_gene_data;
        }
      });
    },

    setGameMode(val: string, opt_validate?: boolean) {
      if (null == opt_validate) {
        opt_validate = true;
      }
      this.applyGameMode(val);
      this.gameMode = val;
      if (opt_validate) {
        this.reconnect();
      }
    },

    applyGameMode(value: string) {
      $("#helloContainer, #overlays-hud").attr("data-gamemode", value);
      $("#gamemode").val(value);
      if (value !== ":party") {
        this.replaceHistoryState(
          "/#" + self.encodeURIComponent(value.replace(":", "")),
        );
      }
    },

    handleChangeMode() {
      const n = $("#gamemode").val();
      this.setGameMode(n);
    },

    findServer(id: string, params: string) {
      const e = Date.now();
      if (!(e - this.findingServer < 500)) {
        if (self.core) {
          self.core.disconnect();
        }
        const picKey = "findServer";

        if (null == id) {
          id = "";
        }
        if (null == params) {
          params = ":ffa";
        }

        // source2 is undefined in original script, passed as undefined
        let source2: any;
        const options = this;

        const container = this.setRequestMsg(id, params, null, source2);
        const defaultWarningTime = ++this.curValidFindServer;
        this.findingServer = e;
        this.makeMasterRequest(
          headers.endpoint_version + "/" + picKey,
          container,
          function (response: any) {
            if (defaultWarningTime == options.curValidFindServer) {
              const key = response.endpoints;
              if (null !== key && "0.0.0.0:0" !== key.https) {
                options.serverIP = key.https;
                if (null !== response.token) {
                  options.partyToken = response.token;
                }
                options.backoffPeriod = 500;
                options.connect(options.serverIP);
              } else {
                options.findServer(id, params);
              }
            }
          },
          function () {
            options.backoffPeriod *= 2;
            setTimeout(function () {
              options.findServer(id, params);
            }, options.backoffPeriod);
          },
        );
      }
    },

    setRequestMsg(args: string, object: string, source: any, source2: any) {
      let output: number[] = [];
      let output2 = "";
      let output2a = 0;

      if (source2) {
        output2 = "" + window.friends;
      }
      if (!output2.length) {
        output2a = 0;
      } else {
        output2a = output2.length;
      }

      output = [10, 4 + args.length + object.length + output2a, 10];

      const getOwnPropertyNames = function (data: string) {
        output.push(data.length);
        let value = 0;
        for (; value < data.length; value++) {
          output.push(data.charCodeAt(value));
        }
      };
      const getOwnPropertyNames2 = function (data: any[]) {
        output.push(18);
        output.push(184);
        output.push(4);
        data.forEach(function (element) {
          output.push(18);
          getOwnPropertyNames(element);
        });
      };

      getOwnPropertyNames(args);
      output.push(18);
      getOwnPropertyNames(object);

      if (source2) getOwnPropertyNames2(source2);
      if (source) {
        output.push(26, 8, 10);
        getOwnPropertyNames(source);
      }

      return new Uint8Array(output);
    },

    makeMasterRequest(
      _wid_attr: string,
      data: any,
      callback: Function,
      timeout_callback: Function,
      type?: string,
    ) {
      // const header = this; // Unused
      if (null == type) {
        type = "application/octet-stream";
      }
      $.ajax("https://" + headers.master_url + "/" + _wid_attr, {
        beforeSend(xhr: any) {
          return xhr.setRequestHeader("Accept", "text/plain"),
            xhr.setRequestHeader("Accept", "*/*"),
            xhr.setRequestHeader("Accept", "text/plain, */*, q=0.01"),
            xhr.setRequestHeader("Content-Type", type),
            xhr.setRequestHeader(
              "x-support-proto-version",
              this.xsupportprotoversion,
            ),
            xhr.setRequestHeader("x-client-version", this.clientVersion),
            true;
        },
        error() {
          if (timeout_callback) {
            timeout_callback();
          }
        },
        success(playlistCopy: any) {
          callback(playlistCopy);
        },
        dataType: "json",
        method: "POST",
        data: data,
        processData: false,
        cache: false,
        crossDomain: true,
      });
    },

    makeMasterSimpleRequest(
      key: string,
      dataType: string,
      success: Function,
      error: Function,
    ) {
      // const obj = this; // Unused
      $.ajax("https://" + headers.master_url + "/" + key, {
        beforeSend(xhr: any) {
          return xhr.setRequestHeader(
            "x-support-proto-version",
            this.xsupportprotoversion,
          ),
            xhr.setRequestHeader("x-client-version", this.clientVersion),
            true;
        },
        error() {
          if (error) {
            error();
          }
        },
        success(nextModel: any) {
          success(nextModel);
        },
        dataType: dataType,
        method: "GET",
        cache: false,
        crossDomain: true,
      });
    },

    createParty() {
      this.setPartyState("3");
      this.setGameMode(":party");
    },

    joinParty(d: string) {
      const scopeHeaderOverrides = this;
      if (-1 != d.indexOf("#")) {
        d = d.split("#")[1];
      }
      this.setGameMode(":party", false);
      this.partyToken = d;
      this.replaceHistoryState("/#" + self.encodeURIComponent(d));
      const label = this.setRequestMsg(this.region, "", d, undefined); // Added undefined for source2
      this.makeMasterRequest(
        headers.endpoint_version + "/getToken",
        label,
        function (moduleParams: any) {
          scopeHeaderOverrides.endpoint = moduleParams.endpoints.https;
          scopeHeaderOverrides.setPartyState("9");
        },
        function () {
          scopeHeaderOverrides.setPartyState("6");
        },
      );
    },

    setPartyState(value: string) {
      if ("9" === value) {
        this.updatePartyToken();
        this.setGameMode(":party", false);
        this.connect(this.endpoint);
        value = "5";
      }
      $("#helloContainer").attr("data-party-state", value);
    },

    connect(body: string) {
      this.ws = "wss://" + body;
      if (":party" === this.gameMode && this.partyToken) {
        this.ws += "?party_id=" + self.encodeURIComponent(this.partyToken);
      }
      if (self.core) {
        self.core.connect(this.ws);
      }
    },

    reconnect(table?: boolean) {
      if (this.region) {
        if (table && this.serverIP) {
          this.connect(this.serverIP);
        } else {
          if (
            !(document.URL && document.URL.includes("jimboy3100.github.io"))
          ) {
            this.findServer(this.region, this.gameMode);
          }
        }
      }
    },

    onConnect() {
      if (this.gameMode === ":party") {
        this.updatePartyToken();
      }
    },

    onDisconnect() {
      console.log(
        "\x1b[31m%s\x1b[34m%s\x1b[0m",
        consoleMsgLMMaster,
        " onDisconnect called, reconnecting",
      );
      this.reconnect();
    },

    recaptchaRequested() {
      if (window.agarCaptcha) {
        window.agarCaptcha.requestCaptcha(true);
      }
    },

    sendRecaptchaResponse(mmCoreSplitViewBlock: any) {
      if (self.core) {
        self.core.recaptchaHandlerResponse(mmCoreSplitViewBlock);
      }
    },

    notifyToken(n: any) {
      this.sendRecaptchaResponse(n);
    },

    setNick() {
      this.login();
      let result = $("#nick").val();

      if (result && fancyCount2(result) > 15) {
        while (fancyCount2(result) > 15) {
          result = result.slice(0, -1);
        }
      }
      if (self.core) {
        self.core.sendNick(result);
      }
    },

    spectate() {
      if (self.core) {
        self.core.sendSpectate();
      }
    },

    updatePartyToken() {
      $("#party-token, .party-token").val(this.partyToken);
    },

    checkHash() {
      if (this.checkPartyHash()) {
        this.joinParty(self.location.hash);
      } else {
        const fm = ["#ffa", "#battleroyale", "#teams", "#experimental"];
        if (self.location.hash && -1 != fm.indexOf(self.location.hash)) {
          this.setGameMode(self.location.hash.replace("#", ":"));
        }
      }
    },

    checkPartyHash() {
      return self.location.hash && 7 == self.location.hash.length;
    },

    replaceHistoryState(name: string) {
      if (self.history && self.history.replaceState) {
        self.history.replaceState({}, self.document.title, name);
      }
    },

    facebookLogin() {
      self.facebookLogin();
    },

    doLoginWithFB(session: string) {
      this.context = "facebook";
      this.accessToken = session;
    },

    doLoginWithGPlus(value: string) {
      this.context = "google";
      this.accessToken = value;
    },

    login() {
      if (this.accessToken) {
        if (this.context === "facebook" && self.core && self.core.sendFbToken) {
          self.core.sendFbToken(this.accessToken);
        }
        if (
          this.context === "google" && self.core && self.core.sendGplusToken
        ) {
          self.core.sendGplusToken(this.accessToken);
        }
      }
    },

    logout() {
      this.accessToken = null;
      this.context = "";
      console.log(
        "\x1b[31m%s\x1b[34m%s\x1b[0m",
        consoleMsgLMMaster,
        " logout called, not reconnecting",
      );
      window.loggedIn = false;
    },

    setUI() {
      const chat = this;
      $("[data-itr]").each(function (this: any) {
        const o = $(this);
        const i = o.attr("data-itr");
        // self.i18n assumed existing on window or self
        if ((self as any).i18n) o.html((self as any).i18n(i));
      });
      $("#gamemode").on("change", function () {
        chat.handleChangeMode();
      });
      $(".btn-play, .btn-play-guest").on("click", function (result: any) {
        result.preventDefault();
        chat.setNick();
      });
      $(".btn-spectate").on("click", function (result: any) {
        result.preventDefault();
        chat.spectate();
      });
      $("#create-party-btn-2").on("click", function (event: any) {
        event.preventDefault();
        chat.createParty();
      });
      $("#join-party-btn-2").on("click", function (result: any) {
        result.preventDefault();
        chat.joinParty($("#party-token").val());
      });
      (self as any).toggleSocialLogin = function () {
        $("#socialLoginContainer").toggle();
      };
    },

    init() {
      const n = this;
      this.setUI();
      this.getRegionNames();
      if (!(document.URL && document.URL.includes("jimboy3100.github.io"))) {
        this.refreshRegionInfo();
        this.checkHash();
        this.getRegionCode();
        this.checkRegion();
        setInterval(function () {
          n.refreshRegionInfo();
        }, 18e4);
      }
    },

    findFacebookFriends() {
      self.FB.api("me/friends", "GET", {
        fields: "id, name, picture",
      }, function (response: any) {
        if (response != null && response.data != null) {
          window.facebookFriends = response.data;
          let _g = 0;
          window.friends = [];
          while (_g < response.data.length) {
            window.friends.push(response.data[_g].id);
            ++_g;
          }
        } else {
          console.log("Error calling: FP.api");
        }
      });
    },
  };

  // --- Global Helper Assignments ---

  (self as any).getStorage = function () {
    if (null !== self.localStorage.getItem("storeObjectInfo")) {
      options = JSON.parse(self.localStorage.getItem("storeObjectInfo")!);
    }
  };

  (self as any).updateStorage = function () {
    self.localStorage.setItem("storeObjectInfo", JSON.stringify(options));
  };

  (self as any).logout = function () {
    if (options.context === "google" && api) {
      api.signOut();
    }
    delete (self.localStorage as any).storeObjectInfo;
    $("#helloContainer").attr("data-logged-in", "0");
    $(".progress-bar-star3").text(0);
    $(".progress-bar-star2").text(0);
    $(".progress-bar-striped").width("0%");
    $(".progress-bar-striped2").width("0%");
    $("#login-facebook").attr("class", "menu-bar-button");
    $("#login-google").attr("class", "menu-bar-button");
    toastr.info(
      "<b>[" + window.Premadeletter123 + "]:</b> " + window.Premadeletter127 +
        "!",
    );
    potionsLogout();
    self.master.logout();
    continuelogout();
  };

  (self as any).facebookLogin = function () {
    alert(
      "You seem to have something blocking Facebook on your browser, please check for any extensions",
    );
  };

  if (!(document.URL && document.URL.includes("jimboy3100.github.io"))) {
    self.fbAsyncInit = function () {
      self.FB.init({
        appId: headers.fb_app_id,
        cookie: true,
        xfbml: true,
        status: true,
        version: "v2.8",
      });
      l = true;
      login();
    };
    self.gapiAsyncInit = function () {
      (self as any).getStorage();
      setup();
    };
  }
}

// ==========================================
// External Helper Functions
// ==========================================

function continuelogout() {
  $("#UserProfileName1").text("Guest");
  $("#UserProfileUID1").val("");
  $("#replayuid").val("");
  $("#UserProfileUUID1").val("");
  $(".agario-profile-picture").attr(
    "src",
    "https://jimboy3100.github.io/banners/profilepic_guest.png",
  );
  $("#stats-content").html("");
  $("#user-info").html("");
  $(".vanilla-skin-preview").attr(
    "src",
    "https://jimboy3100.github.io/banners/profilepic_guest.png",
  );
  $(".progress-bar-star").text("");
  $(".agario-profile-name-container").html(
    '<div class="agario-profile-name"></div>' +
      '<div id="coins" style="display: inline-block;">??000</div>' +
      '<div id="dna" style="display: inline-block;">??000</div>' +
      '<div id="trophy" style="display: inline-block;">??000</div>',
  );
  $("#quest-active").html("");
  $("#player-skins").html("");
}

function doFB() {
  let userid: string | null = null;

  window.FB.api("/me", {
    fields: "first_name, last_name, gender, id",
  }, function (fbresponse: any) {
    $(".agario-profile-picture").attr(
      "src",
      "https://graph.facebook.com/" + fbresponse.id + "/picture?type=large",
    );

    $("#UserProfileName1").text(fbresponse[Object.keys(fbresponse)[0]]);
    $("#UserProfileUID1").val(fbresponse[Object.keys(fbresponse)[2]]);
    $("#replayuid").val(fbresponse[Object.keys(fbresponse)[2]]);

    // Note: 'userid' logic from original script assumes 'userid' global exists or was defined elsewhere in closure
    // Assuming global usage for this conversion context
    userid = fbresponse[Object.keys(fbresponse)[2]];

    // This setLevelProgressBar call implies it exists globally
    if ((window as any).userid == userid) {
      (window as any).setLevelProgressBar();
    }

    const userfirstname = fbresponse[Object.keys(fbresponse)[0]];
    if (userfirstname != null) {
      localStorage.setItem("userfirstname", userfirstname);
    }
    const userlastname = fbresponse[Object.keys(fbresponse)[1]];
    if (userlastname != null) {
      localStorage.setItem("userlastname", userlastname);
    }

    if (userid != null) {
      localStorage.setItem("userid", userid);
    }
    const usergender = fbresponse[Object.keys(fbresponse)[3]];
    if (usergender != null) {
      localStorage.setItem("usergender", usergender);
    }
    return;
  });

  window.FB.api("/me/friends", function (response: any) {
    window.master.fbUsers = response.data;
  }, { scope: "user_friends" });
}

function doGl() {
  const GgImg = window.gapi.auth2.getAuthInstance().currentUser.get()
    .getBasicProfile().getImageUrl();
  const GgProfileName = window.gapi.auth2.getAuthInstance().currentUser.get()
    .getBasicProfile().getGivenName();
  const GgProfileSurName = window.gapi.auth2.getAuthInstance().currentUser.get()
    .getBasicProfile().getFamilyName(); // Unused but kept
  const GgUID = window.gapi.auth2.getAuthInstance().currentUser.get().getId();

  $(".agario-profile-picture").attr("src", GgImg);
  $("#UserProfileName1").text(GgProfileName);

  $("#UserProfileUID1").val(GgUID);
  $("#replayuid").val(GgUID);

  if ((window as any).userid == GgUID) {
    (window as any).setLevelProgressBar();
  }
  const userfirstname = GgProfileName;
  const userid = GgUID;
  const userlastname = GgProfileName;

  if (userfirstname != null) {
    localStorage.setItem("userfirstname", userfirstname);
  }
  if (userlastname != null) {
    localStorage.setItem("userlastname", userlastname);
  }
  if (userid != null) {
    localStorage.setItem("userid", userid);
  }
}

window.master.fbUsers = [];

const Lmagarversion = "";

window.LMGameConfiguration = $.ajax({
  type: "GET",
  url: "https://www.legendmod.ml/agario/live/" + Lmagarversion +
    "GameConfiguration.json",
  async: false,
  datatype: "jsonp",
  success: function (info: any) {},
}).responseJSON;

setTimeout(function () {
  if (window.LMGameConfiguration == undefined) {
    window.LMGameConfiguration = $.ajax({
      type: "GET",
      url: "https://configs-web.agario.miniclippt.com/live/" +
        window.agarversion + "GameConfiguration.json",
      async: false,
      datatype: "jsonp",
      success: function (info: any) {},
    }).responseJSON;
  }
}, 3000);

function getInfo() {
  $.ajax({
    type: "GET",
    url: window.master.master_url_http + "/info",
    datatype: "json",
    success: function (info: any) {
      const regions = info.regions;
      let currentRegion;
      for (const key in regions) {
        if (key == $("#region").val()) {
          currentRegion = regions[key];
          break;
        }
      }

      if (currentRegion != undefined) {
        $("#numPlayers").html(window.kFormatter(currentRegion.numPlayers));
        $("#numServers").html(currentRegion.numRealms);
        $("#pps").html(Math.round(currentRegion.avgPlayersPerRealm).toString());
      }
      $("#totalPlayers").html(window.kFormatter(info.totals.numPlayers));
    },
  });
}

function potionsLogout() {
  $("#potions").html(
    '<div id="potion1" class="potion">' +
      '<img src="https://jimboy3100.github.io/banners/potion_empty.png" />' +
      "<div>empty</div>" +
      "</div>" +
      '<div id="potion2" class="potion">' +
      '<img src="https://jimboy3100.github.io/banners/potion_empty.png" />' +
      "<div>empty</div>" +
      "</div>" +
      '<div id="potion3" class="potion">' +
      '<img src="https://jimboy3100.github.io/banners/potion_empty.png" />' +
      "<div>empty</div>" +
      "</div>",
  );
  $("#potions").hide();
}

function fancyCount2(str: string) {
  const joiner = "\u{200D}";
  const split = str.split(joiner);
  let count = 0;

  for (const s of split) {
    // Regex logic needs care in TS/JS, split separates by unicode variants
    const num = Array.from(s.split(/[\ufe00-\ufe0f]/).join("")).length;
    count += num;
  }

  return count / split.length;
}

function ajaxrequestMaster() {
  $.ajax("//agar.io/mc/agario.js", {
    error() {},
    success(sketchContents: string) {
      const optionMatch = sketchContents.match(
        /versionString\s?=\s,?"(\d+\.\d+).\d+"/,
      );
      const optionMatch2 = sketchContents.match(
        /x-support-proto-version\","(\d+\.\d+\.\d+)"/,
      );
      if (optionMatch && optionMatch2) {
        const pluginName = optionMatch[1];
        const pluginName2 = optionMatch2[1];
        console.log(
          "\x1b[31m%s\x1b[34m%s\x1b[0m",
          consoleMsgLMMaster,
          " Current client version from agario.js:",
          optionMatch[1],
        );
        let pluginNameLast = pluginName;

        pluginNameLast = pluginNameLast + ".11";
        console.log(
          "\x1b[31m%s\x1b[34m%s\x1b[0m",
          consoleMsgLMMaster,
          " Replace with 2 numbers on the end",
          pluginNameLast,
        );
        const data = window.master.parseClientVersion(pluginNameLast);
        window.master.setClientVersion(data, pluginNameLast);
        window.master.setxsupportprotoversion(pluginName2);
        console.log(
          "\x1b[31m%s\x1b[34m%s\x1b[0m",
          consoleMsgLMMaster,
          " Current client version:",
          data,
          pluginNameLast,
        );
        console.log(
          "\x1b[31m%s\x1b[34m%s\x1b[0m",
          consoleMsgLMMaster,
          " Current x-proto version:",
          pluginName2,
        );
      }
    },
    dataType: "text",
    method: "GET",
    cache: false,
    crossDomain: true,
  });
}