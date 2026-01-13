// ==========================================
// LEGEND MOD - COMPLETE MODERNIZED VERSION
// ==========================================

(function() {
    'use strict';

    // ==========================================
    // CONSTANTS & CONFIGURATION
    // ==========================================
    
    const CONFIG = {
        SEMIMOD_VERSION: "19",
        DEFAULT_MUSIC_URL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        AGARTOOL_SERVER: "wss://live.legend.ovh",
        SOCKETIO_URL: "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js",
        MINIMAP_SERVER_INFO: {
            minimapNickFont: "700 11px Ubuntu",
            minimapNickColor: "#ffffff",
            minimapNickStrokeColor: "#000000",
            minimapNickStrokeSize: 2,
            minimapTop: 24,
            minimapTeammatesSize: 5.5,
            minimapOffsetX: 71,
            mapSize: 14142,
            mapOffset: 7071,
            pi2: 2 * Math.PI
        },
        MESSAGE_BOX_BOTTOM: ["82px", "40%"],
        KEY_CODES: {
            ENTER: 13,
            BACKSPACE: 8,
            A: 65,
            R: 82,
            L: 76,
            X: 88
        }
    };

    // ==========================================
    // STATE MANAGEMENT
    // ==========================================
    
    const state = {
        // Core
        LMstarted: false,
        LMVersion: null,
        
        // Server & Connection
        currentIP: "0.0.0.0:0",
        currentIPopened: null,
        currentToken: "",
        lastIP: localStorage.getItem("lastIP"),
        ws: null,
        
        // User Data
        proLicenceUID: localStorage.getItem("proLicenceUID"),
        agarioUID: null,
        agarioLEVEL: null,
        userid: localStorage.getItem("userid"),
        userfirstname: localStorage.getItem("userfirstname"),
        userlastname: localStorage.getItem("userlastname"),
        usergender: localStorage.getItem("usergender"),
        userip: "0.0.0.0:0",
        usercity: "NotFound",
        usercountry: "NotFound",
        
        // Game Settings
        previousMode: localStorage.getItem("gamemode"),
        previousnickname: localStorage.getItem("previousnickname"),
        region: null,
        realmode: null,
        realmodePS: null,
        searchStr: null,
        searchSip: null,
        clanpass: null,
        searchedplayer: null,
        autoplayplayer: null,
        replayURL: null,
        replayStart: null,
        replayEnd: null,
        
        // UI State
        searching: false,
        timerId: null,
        messageone: 1,
        seticon: "YES",
        setmessagecom: "YES",
        setyt: "YES",
        setscriptingcom: "YES",
        clickedname: "NO",
        openthecommunication: "NO",
        
        // Checks
        checkonlyonce: localStorage.getItem("checkonlyonce"),
        checkonlyfourtenth: localStorage.getItem("checkonlyfourtenth"),
        checkonlyeleventh: localStorage.getItem("checkonlyeleventh"),
        checkonlyrewardday3: localStorage.getItem("checkonlyrewardday3"),
        timesopened: localStorage.getItem("timesopened"),
        dyinglight1load: localStorage.getItem("dyinglight1load"),
        
        // Admin
        AdminClanSymbol: null,
        AdminPassword: null,
        AdminRights: 0,
        PanelImageSrc: null,
        
        // Images & Media
        pic1urlimg: localStorage.getItem("pic1urlimg") || "https://i.imgur.com/RVBi3T1.gif",
        pic2urlimg: localStorage.getItem("pic2urlimg") || "https://i.imgur.com/example2.png",
        pic3urlimg: localStorage.getItem("pic3urlimg") || "https://i.imgur.com/example3.png",
        pic4urlimg: localStorage.getItem("pic4urlimg") || "https://i.imgur.com/example4.png",
        pic5urlimg: localStorage.getItem("pic5urlimg") || "https://i.imgur.com/example5.png",
        pic6urlimg: localStorage.getItem("pic6urlimg") || "https://i.imgur.com/example6.png",
        
        pic1dataimg: localStorage.getItem("pic1dataimg") || "Bad Choice!",
        pic2dataimg: localStorage.getItem("pic2dataimg") || "Why?",
        pic3dataimg: localStorage.getItem("pic3dataimg") || "Yow!!",
        pic4dataimg: localStorage.getItem("pic4dataimg") || "Death!",
        pic5dataimg: localStorage.getItem("pic5dataimg") || "Relax!",
        pic6dataimg: localStorage.getItem("pic6dataimg") || "Legend Mod!",
        
        // Youtube
        yt1url: localStorage.getItem("yt1urlimg") || "dQw4w9WgXcQ",
        yt2url: localStorage.getItem("yt2urlimg") || "btPJPFnesV4",
        yt3url: localStorage.getItem("yt3urlimg") || "UD-MkihnOXg",
        yt4url: localStorage.getItem("yt4urlimg") || "vpoqWs6BuIY",
        yt5url: localStorage.getItem("yt5urlimg") || "VUvfn5-BLM8",
        yt6url: localStorage.getItem("yt6urlimg") || "CnIfNSpCf70",
        
        yt1data: localStorage.getItem("yt1dataimg") || "Rick Astley - Never Gonna Give You Up",
        yt2data: localStorage.getItem("yt2dataimg") || "Survivor - Eye Of The Tiger",
        yt3data: localStorage.getItem("yt3dataimg") || "Lion king - The Lion Sleeps Tonight",
        yt4data: localStorage.getItem("yt4dataimg") || "Agario - Jumbo Solo vs Teams",
        yt5data: localStorage.getItem("yt5dataimg") || "Agario - Kill3r vs Teams",
        yt6data: localStorage.getItem("yt6dataimg") || "Promotional",
        
        // Backgrounds
        minimapbckimg: localStorage.getItem("minimapbckimg") || "",
        leadbimg: localStorage.getItem("leadbimg") || "",
        teambimg: localStorage.getItem("teambimg") || "",
        canvasbimg: localStorage.getItem("canvasbimg") || "",
        leadbtext: localStorage.getItem("leadbtext") || "",
        teambtext: localStorage.getItem("teambtext") || "",
        minbtext: localStorage.getItem("minbtext") || "",
        imgUrl: localStorage.getItem("imgUrl") || "",
        imgHref: localStorage.getItem("imgHref") || "",
        
        // Settings
        showToken: localStorage.getItem("showTK"),
        showPlayer: localStorage.getItem("showPlayer"),
        SHOSHOBtn: localStorage.getItem("SHOSHOBtn"),
        XPBtn: localStorage.getItem("XPBtn"),
        MAINBTBtn: localStorage.getItem("MAINBTBtn"),
        AnimatedSkinBtn: localStorage.getItem("AnimatedSkinBtn"),
        TIMEcalBtn: localStorage.getItem("TIMEcalBtn"),
        languagemod: localStorage.getItem("languagemod"),
        
        // Discord & Scripts
        discwebhook1: localStorage.getItem("discwebhook1") || "",
        discwebhook2: localStorage.getItem("discwebhook2") || "",
        
        // Other
        rotateminimap: 0,
        rotateminimapfirst: 0,
        checkedGameNames: 0,
        timesdisconnected: 0,
        usedonceSkin: 0,
        showonceusers3: 0,
        animatedserverchanged: false,
        oldteammode: null,
        playerState: 0,
        url: localStorage.getItem("url"),
        userData: {},
        fbresponse: {},
        CopyTkPwLb2: null,
        LegendJSON: null,
        LegendSettings: "true",
        LegendSettingsfirstclicked: "false",
        Express: "True",
        detailed: "",
        detailed1: null,
        PostedThings: null,
        url2: null,
        semiurl2: null,
        LegendClanSymbol: "0",
        bannedUserUIDs: [],
        AgarBannedUIDsAdded: false,
        agarversionDestinations: {},
        agarversionDestinationFound: false
    };

    // Sanitize proLicenceUID
    if (state.proLicenceUID === "null") {
        state.proLicenceUID = null;
    }

    // Initialize userData
    try {
        state.userData = JSON.parse(localStorage.getItem("userData")) || {};
    } catch (e) {
        state.userData = {};
    }

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    
    const Utils = {
        getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, '\\$&');
            const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
            const results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        },
        
        copyToClipboard(text) {
            const $temp = $("<textarea>");
            $("body").append($temp);
            let html = text;
            if (typeof text !== 'string') {
                html = $(text).html();
                html = html.replace(/<br>/g, "\n");
            }
            $temp.val(html).select();
            document.execCommand("copy");
            $temp.remove();
        },
        
        isValidIpAndPort(input) {
            const parts = input.split(":");
            const ip = parts[0].split(".");
            const port = parts[1];
            return this.validateNum(port, 1, 65535) &&
                ip.length === 4 &&
                ip.every(segment => this.validateNum(segment, 0, 255));
        },
        
        validateNum(input, min, max) {
            const num = +input;
            return num >= min && num <= max && input === num.toString();
        },
        
        escapeHtml(text) {
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        },
        
        removeEmojis(text) {
            return text.replace(/[\u{1F600}-\u{1F64F}]/gu, '');
        },
        
        fancyCount2(text) {
            // Character counting logic for special characters
            let count = 0;
            for (let i = 0; i < text.length; i++) {
                const char = text.charCodeAt(i);
                if (char > 127) count += 2;
                else count += 1;
            }
            return count;
        },
        
        isEquivalent(a, b) {
            if (!a || !b) return false;
            const aProps = Object.getOwnPropertyNames(a);
            const bProps = Object.getOwnPropertyNames(b);
            if (aProps.length !== bProps.length) return false;
            for (let i = 0; i < aProps.length; i++) {
                const propName = aProps[i];
                if (a[propName] !== b[propName]) return false;
            }
            return true;
        },
        
        LowerCase(text) {
            return text ? text.toLowerCase() : '';
        },
        
        isObject(val) {
            if (val === null) return false;
            return (typeof val === 'function') || (typeof val === 'object');
        },
        
        inject(type, code) {
            let inject;
            switch (type) {
                case 'javascript':
                    inject = document.createElement('script');
                    inject.type = 'text/javascript';
                    inject.appendChild(document.createTextNode(code));
                    break;
                case 'stylesheet':
                    inject = document.createElement('style');
                    inject.type = 'text/css';
                    inject.appendChild(document.createTextNode(code));
                    break;
            }
            (document.head || document.documentElement).appendChild(inject);
        },
        
        loadScript(url, callback) {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            if (typeof callback !== 'undefined') {
                script.onload = callback;
            }
            document.head.appendChild(script);
        },
        
        playSound(url) {
            try {
                const audio = new Audio(url);
                audio.play().catch(e => console.log('Sound play failed:', e));
            } catch (e) {
                console.log('Sound error:', e);
            }
        }
    };

    // ==========================================
    // STORAGE MODULE
    // ==========================================
    
    const Storage = {
        get(key, defaultValue = null) {
            try {
                const value = localStorage.getItem(key);
                return value !== null ? value : defaultValue;
            } catch (error) {
                console.error(`Failed to get ${key} from localStorage:`, error);
                return defaultValue;
            }
        },
        
        set(key, value) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (error) {
                console.error(`Failed to set ${key} in localStorage:`, error);
                return false;
            }
        },
        
        getInt(key, defaultValue = 0) {
            const value = this.get(key);
            return value ? parseInt(value) || defaultValue : defaultValue;
        },
        
        increment(key) {
            const current = this.getInt(key, 0);
            const newValue = current + 1;
            this.set(key, newValue.toString());
            return newValue;
        },
        
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error(`Failed to remove ${key} from localStorage:`, error);
                return false;
            }
        }
    };

    // ==========================================
    // NETWORK MODULE
    // ==========================================
    
    const Network = {
        xhttp: new XMLHttpRequest(),
        
        async fetch(url, options = {}) {
            try {
                const response = await fetch(url, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('Network request failed:', error);
                throw error;
            }
        },
        
        postSNEZ(server, username, password, data) {
            try {
                this.xhttp.open("POST", server, false);
                this.xhttp.setRequestHeader("username", username);
                this.xhttp.setRequestHeader("password", password);
                this.xhttp.send(data);
                return this.xhttp.response;
            } catch (error) {
                console.error('SNEZ POST failed:', error);
                return null;
            }
        },
        
        getSNEZ(server, username, password) {
            try {
                this.xhttp.open("GET", server, false);
                this.xhttp.setRequestHeader("username", username);
                this.xhttp.setRequestHeader("password", password);
                this.xhttp.send();
                return this.xhttp.response;
            } catch (error) {
                console.error('SNEZ GET failed:', error);
                return null;
            }
        },
        
        async getAccessToken() {
            try {
                const response = await $.ajax({
                    type: "GET",
                         url: "https://www.legendmod.ml/AjaxData/accesstoken.html",
                    datatype: "json"
                });
                const accesstomod = response[17];
                this.validateAccessToken(accesstomod);
            } catch (error) {
                console.error('Failed to get access token:', error);
                toastr.error('Failed to connect to server. Please refresh.');
            }
        },
        
        validateAccessToken(accesstomod) {
            if (accesstomod !== "a" && accesstomod !== null) {
                toastr.error(`<b>[SERVER]:</b> Access denied<br>Visit: <a target="_blank" href="https://legendmod.com">legendmod.com</a>`);
                document.documentElement.innerHTML = "";
            }
        }
    };

    // ==========================================
    // TIMER MODULE
    // ==========================================
    
    const TimerLM = {
        timerStarted: null,
        difference: 0,
        timerInterval: null,
        timerDiv: null,
        
        display() {
            let minutes = '00';
            let seconds = '00';
            const timeNow = new Date().getTime();
            this.difference = timeNow - this.timerStarted;
            
            if (this.difference > 1000) {
                seconds = Math.floor(this.difference / 1000);
                if (seconds > 60) seconds = seconds % 60;
                if (seconds < 10) seconds = `0${seconds}`;
            }
            
            if (this.difference > 60000) {
                minutes = Math.floor(this.difference / 60000);
                if (minutes > 60) minutes = minutes % 60;
                if (minutes < 10) minutes = `0${minutes}`;
            }
            
            if (this.timerDiv) {
                this.timerDiv.innerHTML = `${minutes}:${seconds}`;
            }
        },
        
        start() {
            $("#playtimer").hide();
            $("#stoptimer").show();
            $("#cleartimer").show();
            this.timerStarted = new Date().getTime();
            
            if (this.difference > 0) {
                this.timerStarted = this.timerStarted - this.difference;
            }
            
            this.timerInterval = setInterval(() => this.display(), 10);
        },
        
        stop() {
            $("#playtimer").show();
            $("#stoptimer").hide();
            $("#cleartimer").show();
            clearInterval(this.timerInterval);
        },
        
        clear() {
            $("#playtimer").show();
            $("#stoptimer").hide();
            $("#cleartimer").hide();
            clearInterval(this.timerInterval);
            if (this.timerDiv) {
                this.timerDiv.innerHTML = "00:00";
            }
            this.difference = 0;
        }
    };

    // ==========================================
    // YOUTUBE PLAYER MODULE
    // ==========================================
    
    const YouTubePlayer = {
        player: null,
        playerState: 0,
        
        getEmbedUrl(url) {
            url = url.trim();
            const musicParams = "showinfo=0&controls=0&rel=0&vq=tiny&enablejsapi=1";
            const videoId = Utils.getParameterByName("v", url);
            const listId = Utils.getParameterByName("list", url);
            
            if (videoId !== null && listId === null) {
                return `https://www.youtube.com/embed/${videoId}?${musicParams}`;
            } else if (listId !== null && videoId !== null) {
                return `https://www.youtube.com/embed/${videoId}?list=${listId}&${musicParams}`;
            } else if (url.startsWith("https://youtu.be/")) {
                const id = url.replace("https://youtu.be/", "").split('?')[0];
                if (listId !== null) {
                    return `https://www.youtube.com/embed/${id}?list=${listId}&${musicParams}`;
                }
                return `https://www.youtube.com/embed/${id}?${musicParams}`;
            }
            return false;
        },
        
        embedPlayer(urlOrData) {
            const finalUrl = this.getEmbedUrl(urlOrData.trim());
            
            if (!finalUrl) {
                toastr.error("Invalid YouTube URL").css("width", "210px");
                const storedUrl = Storage.get("musicUrl", CONFIG.DEFAULT_MUSIC_URL);
                $("#musicUrl").val(storedUrl);
                return;
            }
            
            $("#musicFrame").attr("src", finalUrl);
            Storage.set("musicUrl", urlOrData.trim());
        },
        
        play() {
            if (!this.player) return;
            
            const state = this.player.getPlayerState();
            if (state !== 1) {
                this.player.playVideo();
            } else {
                this.player.pauseVideo();
            }
        },
        
        init() {
            const initialMusicUrl = Storage.get("musicUrl", CONFIG.DEFAULT_MUSIC_URL);
            
            $('.agario-panel.radio-panel').after(`
                <div id="youtubeplayer" style="margin-left: 0px;">
                    <h5 class="main-color" style="margin-right: 15px;">Youtube player</h5>
                    <iframe id="musicFrame" width="350" height="180" 
                            src="${this.getEmbedUrl(initialMusicUrl)}" 
                            frameborder="0" allowfullscreen="">
                    </iframe>
                </div>
                <div id="afteryoutubeplayer">
                    <input id="musicUrl" onclick="$(this).select();" type="text" 
                           placeholder="Youtube Url" value="${initialMusicUrl}" 
                           class="form-control" data-toggle="tooltip" 
                           data-placement="right" 
                           data-original-title="Paste your video/playlist here">
                </div>
            `);
            
            $('.agario-panel.radio-panel').hide();
            $('.agario-panel.ogario-yt-panel').hide();
            
            $("#musicUrl").on("input", function() {
                $(this).attr("maxlength", "1000");
            });
            
            $("#musicUrl").bind("paste", (e) => {
                $(e.target).attr("maxlength", "1000");
                const pastedData = e.originalEvent.clipboardData.getData('text');
                this.embedPlayer(pastedData);
            });
            
            // Initialize YT Player after delay
            setTimeout(() => {
                if (typeof YT !== 'undefined') {
                    this.player = new YT.Player('musicFrame', {
                        events: {
                            'onStateChange': (playerState) => {
                                if (playerState.data === 1) {
                                    $("#playerI").removeClass("fa-play-circle").addClass("fa-pause-circle");
                                    $("#playerBtn").attr('data-original-title', 'Pause').tooltip('fixTitle');
                                    state.playerState = 1;
                                } else {
                                    $("#playerI").removeClass("fa-pause-circle").addClass("fa-play-circle");
                                    $("#playerBtn").attr('data-original-title', 'Play').tooltip('fixTitle');
                                    state.playerState = 0;
                                }
                            }
                        }
                    });
                }
            }, 1500);
        }
    };

    // ==========================================
    // PREMIUM USERS MODULE
    // ==========================================
    
    const PremiumUsers = {
        checkFFAScore() {
            if (!state.proLicenceUID || !state.proLicenceUID.includes("MegaFFA")) {
                return;
            }
            
            const PremiumLimitedDateStart = window.PremiumLimitedDateStart;
            if (!PremiumLimitedDateStart || isNaN(parseInt(PremiumLimitedDateStart))) {
                state.proLicenceUID = null;
                Storage.set("proLicenceUID", null);
                return;
            }
            
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
            let day = parseInt(dateStr.slice(6, 8)) - 6;
            const monthYear = parseInt(dateStr.slice(0, 6)) * 100;
            
            if (day < 0) {
                day = day - 70;
            }
            
            const currentDate = monthYear + day;
            const startDate = parseInt(PremiumLimitedDateStart);
            
            if (startDate < currentDate) {
                state.proLicenceUID = null;
                Storage.set("proLicenceUID", null);
                toastr.warning("<b>[SERVER]:</b> Your Giveaway licence has ended. Thank you for using our mod!")
                    .css("width", "350px");
            }
        },
        
        check() {
            if (state.proLicenceUID && !state.proLicenceUID.includes("Give")) {
                return;
            }
            
            const agarioUID = window.agarioUID;
            const ProLicenceUsersTable = window.ProLicenceUsersTable;
            
            if (!agarioUID || !ProLicenceUsersTable?.ProLicenceUsers?.[agarioUID]) {
                return;
            }
            
            const userEntry = ProLicenceUsersTable.ProLicenceUsers[agarioUID];
            
            if (userEntry.reason.includes("Give")) {
                const YYYYMMDD = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ""));
                const expDate = parseInt(userEntry.reason.split('@')[1]);
                
                if (expDate && expDate < YYYYMMDD && state.proLicenceUID) {
                    state.proLicenceUID = null;
                    toastr.warning("<b>[SERVER]:</b> Your Giveaway licence has ended. Thank you for using our mod!")
                        .css("width", "350px");
                } else if (expDate && expDate >= YYYYMMDD && !state.proLicenceUID) {
                    state.proLicenceUID = "Give";
                    const expDateStr = expDate.toString();
                    toastr.warning(`<b>[SERVER]:</b> Your licence is stored as Giveaway Premium until ${expDateStr.slice(0, 2)}/${expDateStr.slice(2, 4)}/${expDateStr.slice(4, 8)}. Thank you for using our mod!`)
                        .css("width", "350px");
                }
            } else {
                state.proLicenceUID = userEntry.reason;
                Storage.set("proLicenceUID", true);
                toastr.warning("<b>[SERVER]:</b> Your licence is stored as Premium. Thank you for using our mod!")
                    .css("width", "350px");
            }
            
            Storage.set("proLicenceUID", state.proLicenceUID);
        },
        
        checkLMscore() {
            if (state.proLicenceUID) return;
            
            const LMscore = window.LMscore;
            if (!LMscore) return;
            
            Storage.set("proLicenceUID", true);
            toastr.warning(`<b>[SERVER]:</b> Congratulations! Your LM level is ${LMscore}. Your licence is stored as Premium permanently. Thank you for using our mod!`)
                .css("width", "350px");
        }
    };

    // ==========================================
    // UI MODULE
    // ==========================================
    
    const UI = {
        showMenu() {
            $("#overlays").show();
            $('a[href="#main-panel"]').click();
        },
        
        showMenu2() {
            $("#overlays").show();
            $('a[href="#main-panel"]').click();
        },
        
        hideMenu() {
            $("#overlays").hide();
        },
        
        showSearchHud() {
            if (!document.URL.includes('jimboy3100.github.io')) {
                // getInfo();
            }
            $("#backgroundFade").fadeIn();
            $("#notes").fadeIn();
            $("#statsInfo").fadeIn();
            $("#searchHud").fadeIn();
            $("#searchLog").fadeIn();
        },
        
        hideSearchHud() {
            $("#searchHud").fadeOut();
            $("#backgroundFade").fadeOut();
            $("#notes").fadeOut();
            $("#statsInfo").fadeOut();
            $("#searchLog").fadeOut();
        },
        
        showBotNameHud() {
            $("#searchHud").fadeOut();
            
            if (!window.legendmod?.botNicks?.length) {
                this.appendLog2(`<span class='main-color'><span id='playerBots'>No bots found</span></span> (${window.legendmod?.ws || 'Unknown'})`);
            } else {
                window.legendmod.botNicks.forEach(bot => {
                    this.appendLog2(`<span class='main-color'><span id='playerBots'>${bot.nick}</span></span> <span id='botNamesCount'>${bot.occurrence}</span><span> (${window.legendmod.ws})</span>`);
                });
            }
            
            $("#backgroundFade").fadeIn();
            $("#notes").fadeIn();
            $("#searchLog").fadeIn();
        },
        
        hideBotNameHud() {
            $("#searchHud").fadeOut();
            $("#backgroundFade").fadeOut();
            $("#statsInfo").fadeOut();
            $("#searchLog").fadeOut();
        },
        
        appendLog(message) {
            const region = $("#region").val()?.substring(0, 2) || 'UN';
            $("#log").prepend(`
                <p style="display: none;white-space: nowrap;margin-bottom: 10px;">
                    <span class="main-color">${region}</span> &nbsp;
                    <a href="javascript:void(0);" class="logEntry" data-token="${state.currentToken}" 
                       style="color: lightgrey; font-size: 14px;">${message}</a>
                </p>
            `);
            $("#log p").first().show(100);
            this.bumpLog();
        },
        
        appendLog2(message, server = '') {
            $("#log").prepend(`
                <p style="display: none;white-space: nowrap;margin-bottom: 10px;">
                    <a onclick="LegendMod.connectTo('${server}');return false;" 
                       class="logEntry" data-token="${state.currentToken}" 
                       style="color: lightgrey; font-size: 14px;">${message}</a>
                </p>
            `);
            $("#log p").first().show(100);
            this.bumpLog();
        },
        
        appendLog3(message, server = '', region = '', mode = '') {
            $("#log").prepend(`
                <p style="display: none;white-space: nowrap;margin-bottom: 10px;">
                    <a onclick="LegendMod.connectTo('${server}');LegendMod.connectTo2('${region}');LegendMod.connectTo3('${mode}');return false;" 
                       class="logEntry" data-token="${state.currentToken}" 
                       style="color: lightgrey; font-size: 14px;">${message}</a>
                </p>
            `);
            $("#log p").first().show(100);
            this.bumpLog();
        },
        
        appendLog4(message, server = '') {
            $("#log").prepend(`
                <p style="display: none;white-space: nowrap;margin-bottom: 10px;">
                    <a onclick="LegendMod.connectTo1a('${server}');return false;" 
                       class="logEntry" data-token="${state.currentToken}" 
                       style="color: lightgrey; font-size: 14px;">${message}</a>
                </p>
            `);
            $("#log p").first().show(100);
            this.bumpLog();
        },
        
        bumpLog() {
            $("#log").animate({ scrollTop: 0 }, "slow");
        }
    };

    // ==========================================
    // MESSAGE COMMANDS MODULE
    // ==========================================
    
    const MessageCommands = {
        process(MSGCOMMANDS, MSGNICK) {
            if (!MSGCOMMANDS || !MSGNICK) return;
            
            if (MSGCOMMANDS.includes("[url]")) {
                this.handleURL(MSGCOMMANDS, MSGNICK);
            } else if (MSGCOMMANDS.includes("[tag]")) {
                this.handleTag(MSGCOMMANDS, MSGNICK);
            } else if (MSGCOMMANDS.includes("[yut]")) {
                this.handleYoutube(MSGCOMMANDS, MSGNICK);
            } else if (MSGCOMMANDS.includes("[skype]")) {
                this.handleSkype(MSGCOMMANDS, MSGNICK);
            } else if (MSGCOMMANDS.includes("[discord]")) {
                this.handleDiscord(MSGCOMMANDS, MSGNICK);
            } else if (MSGCOMMANDS.includes("Legend.Mod")) {
                this.handleLegendMod(MSGCOMMANDS, MSGNICK);
            } else if (MSGCOMMANDS.includes("[DosAttack]")) {
                this.handleDosAttack(MSGCOMMANDS, MSGNICK);
            } else if (MSGCOMMANDS.includes("[DosFight]")) {
                this.handleDosFight(MSGCOMMANDS, MSGNICK);
            } else if (MSGCOMMANDS.includes("[DosRun]")) {
                this.handleDosRun(MSGCOMMANDS, MSGNICK);
            } else if (MSGCOMMANDS.includes("[srv]")) {
                this.handleServer(MSGCOMMANDS, MSGNICK);
            }
        },
        
        handleURL(MSGCOMMANDS, MSGNICK) {
            if (!$("#nick").val().includes("url")) {
                $(".message-text").remove();
                $(".toast.toast-success").remove();
            }
            
            let url = MSGCOMMANDS.split("[url]").pop().split('[/url]')[0];
            
            if (!url.includes("https://") && !url.includes("http://")) {
                url = `https://${url}`;
            }
            
            toastr.warning(`
                Player ${MSGNICK} sent URL: 
                <a id="visiturl" href="${url}" target="_blank">
                    <font color="blue">${url}</font>
                </a><br>
                <button id="acceptURL" class="btn btn-block btn-info" 
                        style="margin-top: 10px;border-color: darkblue;">
                    Accept
                </button><br>
                <button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" 
                        style="width: 100%;margin-top: -10px;">
                    Decline
                </button>
            `, "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "250px");
            
            $("#acceptURL").click(() => window.open(url, '_blank'));
        },
        
        handleTag(MSGCOMMANDS, MSGNICK) {
            if (!$("#nick").val().includes("tag")) {
                $(".message-text").remove();
                $(".toast.toast-success").remove();
            }
            
            const tag = MSGCOMMANDS.split("[tag]").pop().split('[/tag]')[0];
            const action = tag !== "" ? "change to" : "remove";
            
            toastr.warning(`
                Player ${MSGNICK} wants you to ${action} tag: 
                <i><font color="blue">${tag}</font></i><br>
                <button id="acceptURL" class="btn btn-block btn-info" 
                        style="margin-top: 10px;border-color: darkblue;">
                    Accept
                </button><br>
                <button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" 
                        style="width: 100%;margin-top: -10px;">
                    Decline
                </button>
            `, "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "250px");
            
            $("#acceptURL").click(() => {
                $("#clantag").val(tag);
                $('#clantag').css('background-color', '#ff6347');
                if (window.newsubmit) window.newsubmit();
            });
        },
        
        handleYoutube(MSGCOMMANDS, MSGNICK) {
            if (!$("#nick").val().includes("yut")) {
                $(".message-text").remove();
                $(".toast.toast-success").remove();
            }
            
            let ytUrl = MSGCOMMANDS.split("[yut]").pop().split('[/yut]')[0];
            
            if (!ytUrl.includes("https://") && !ytUrl.includes("http://")) {
                ytUrl = `https://${ytUrl}`;
            }
            
            const videoId = Utils.getParameterByName("v", ytUrl);
            
            toastr.warning(`
                Player ${MSGNICK} sent YouTube video: 
                <a id="visiturl" href="${ytUrl}" target="_blank">
                    <font color="blue">${ytUrl}</font>
                </a><br>
                <iframe type="text/html" width="100%" height="auto" 
                        src="https://www.youtube.com/embed/${videoId}" 
                        frameborder="0" allowfullscreen="">
                </iframe><br>
                <button id="acceptYoutubeEmb" class="btn btn-block btn-info" 
                        style="margin-top: 10px;border-color: darkblue;">
                    Play
                </button><br>
                <button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" 
                        style="width: 100%;margin-top: -10px;">
                    Decline
                </button>
            `, "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "300px");
            
            $("#acceptYoutubeEmb").click(() => {
                YouTubePlayer.embedPlayer(ytUrl);
                $("#musicUrl").val(ytUrl);
                YouTubePlayer.play();
            });
        },
        
        handleSkype(MSGCOMMANDS, MSGNICK) {
            if (!$("#nick").val().includes("skype")) {
                $(".message-text").remove();
                $(".toast.toast-success").remove();
            }
            
            let skypeUrl = MSGCOMMANDS.split("[skype]").pop().split('[/skype]')[0];
            
            if (!skypeUrl.includes("https://") && !skypeUrl.includes("http://")) {
                skypeUrl = `https://${skypeUrl}`;
            }
            
            if (skypeUrl.includes("join.skype.com/")) {
                toastr.warning(`
                    <img src="https://i.imgur.com/skype.png" 
                         style="width:30px; height:30px; display:inline; margin-right:5px;">
                    Player ${MSGNICK} invites you to Skype call<br>
                    <button id="acceptURL" class="btn btn-block btn-info" 
                            style="margin-top: 10px;border-color: darkblue;">
                        Join
                    </button><br>
                    <button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" 
                            style="width: 100%;margin-top: -10px;">
                        Decline
                    </button>
                `, "", {
                    timeOut: 10000,
                    extendedTimeOut: 10000
                }).css("width", "300px");
                
                $("#acceptURL").click(() => window.open(skypeUrl, '_blank'));
            }
        },
        
        handleDiscord(MSGCOMMANDS, MSGNICK) {
            if (!$("#nick").val().includes("discord")) {
                $(".message-text").remove();
                $(".toast.toast-success").remove();
            }
            
            let discordUrl = MSGCOMMANDS.split("[discord]").pop().split('[/discord]')[0];
            
            if (!discordUrl.includes("https://") && !discordUrl.includes("http://")) {
                discordUrl = `https://${discordUrl}`;
            }
            
            if (discordUrl.includes("discordapp.com/invite") || 
                discordUrl.includes("discord.gg") || 
                discordUrl.includes("discord.com")) {
                
                toastr.warning(`
                    <img src="https://i.imgur.com/discord.png" 
                         style="width:30px; height:30px; display:inline; margin-right:5px;">
                    Player ${MSGNICK} invites you to Discord server<br>
                    <button id="acceptURL" class="btn btn-block btn-info" 
                            style="margin-top: 10px;border-color: darkblue;">
                        Join
                    </button><br>
                    <button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" 
                            style="width: 100%;margin-top: -10px;">
                        Decline
                    </button>
                `, "", {
                    timeOut: 20000,
                    extendedTimeOut: 20000
                }).css("width", "300px");
                
                $("#acceptURL").click(() => window.open(discordUrl, '_blank'));
            }
        },
        
        handleLegendMod(MSGCOMMANDS, MSGNICK) {
            const playerMsg = Utils.getParameterByName("player", MSGCOMMANDS);
            const commandMsg = Utils.getParameterByName("com", MSGCOMMANDS);
            const otherMsg = Utils.getParameterByName("do", MSGCOMMANDS);
            
            $(".message-text").remove();
            $(".toast.toast-success").remove();
            
            switch (commandMsg) {
                case "Team5":
                    $("#top5-hud").css({
                        'background-image': 'url("https://i.imgur.com/team5.png")',
                        'opacity': 0.8
                    });
                    setTimeout(() => {
                        $("#top5-hud").css({
                            'background-image': 'url("")',
                            'opacity': 1
                        });
                    }, 12000);
                    break;
                    
                case "Hello":
                    if ($('#message-box').css('display') === 'none' && $("#clantag").val() !== "") {
                        const nickname = $("#nick").val();
                        $("#nick").val("Hello Team");
                        $("#helloContainer").show();
                        if (window.newsubmit) window.newsubmit();
                        setTimeout(() => {
                            $("#nick").val(nickname);
                            $("#helloContainer").show();
                            if (window.newsubmit) window.newsubmit();
                        }, 5000);
                    }
                    break;
                    
                case "HideAll":
                    toastr.warning(`
                        Player ${playerMsg} suggests to hide all<br>
                        <button class="btn btn-sm btn-primary btn-play btn-do-hideall" 
                                style="margin-top: 10px;border-color: darkblue;">
                            Accept
                        </button><br>
                        <button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" 
                                style="width: 100%;margin-top: 10px;">
                            Decline
                        </button>
                    `, "", {
                        timeOut: 20000,
                        extendedTimeOut: 20000
                    }).css("width", "210px");
                    
                    $(".btn-do-hideall").click(() => $("#HideAllBthn").click());
                    break;
                    
                case "NamePerm":
                    toastr.warning(`
                        Player ${playerMsg} wants you to change name to: ${playerMsg}<br>
                        <button class="btn btn-sm btn-primary btn-play btn-do-NamePerm" 
                                style="margin-top: 10px;border-color: darkblue;">
                            Accept
                        </button><br>
                        <button class="btn btn-sm btn-warning btn-spectate btn-nodo-NamePerm" 
                                style="width: 100%;margin-top: 10px;">
                            Decline
                        </button>
                    `, "", {
                        timeOut: 20000,
                        extendedTimeOut: 20000
                    }).css("width", "210px");
                    
                    $(".btn-do-NamePerm").click(() => {
                        $("#nick").val(playerMsg);
                        $("#helloContainer").show();
                        if (window.newsubmit) window.newsubmit();
                    });
                    break;
                    
                case "dTroll2":
                    toastr.warning(`
                        Player ${playerMsg} wants to troll<br>
                        <button class="btn btn-sm btn-primary btn-play btn-do-troll" 
                                style="margin-top: 10px;border-color: darkblue;">
                            Accept
                        </button><br>
                        <button class="btn btn-sm btn-warning btn-spectate btn-nodo-troll" 
                                style="width: 100%;margin-top: 10px;">
                            Decline
                        </button>
                    `, "", {
                        timeOut: 20000,
                        extendedTimeOut: 20000
                    }).css("width", "210px");
                    
                    $(".btn-do-troll").click(() => {
                        if (window.settrolling) window.settrolling();
                    });
                    break;
                    
                case "Youtube":
                    toastr.warning(`
                        Player ${playerMsg} wants to play music<br>
                        <button class="btn btn-sm btn-primary btn-play btn-play-youtube" 
                                style="margin-top: 10px;border-color: darkblue;">
                            Accept
                        </button><br>
                        <button class="btn btn-sm btn-warning btn-spectate btn-noplay-youtube" 
                                style="width: 100%;margin-top: 10px;">
                            Decline
                        </button>
                    `, "", {
                        timeOut: 20000,
                        extendedTimeOut: 20000
                    }).css("width", "210px");
                    
                    $(".btn-play-youtube").click(() => {
                        $("#playerBtn").click();
                        setTimeout(() => $("#playerBtn").focusout(), 100);
                    });
                    break;
            }
        },
        
        handleDosAttack(MSGCOMMANDS, MSGNICK) {
            if (!$("#nick").val().includes("DosAttack")) {
                $(".message-text").remove();
                $(".toast.toast-success").remove();
            }
            
            const coords = MSGCOMMANDS.split("[DosAttack]").pop().split('[/DosAttack]')[0];
            const [clientX, clientY] = coords.split(',');
            
            if (window.legendmod) {
                window.targetingLeadclientX = clientX;
                window.targetingLeadclientY = clientY;
                window.targetingLeadX = parseFloat(clientX) - window.legendmod.mapOffsetX;
                window.targetingLeadY = parseFloat(clientY) - window.legendmod.mapOffsetY;
                window.legendmod.drawCommander2 = true;
                
                const sector = window.application?.calculateMapSector(
                    window.targetingLeadX, 
                    window.targetingLeadY, 
                    true
                );
                
                toastr.warning(`<b>${MSGNICK}:</b> Attack ${sector}`)
                    .css("width", "210px");
            }
        },
        
        handleDosFight(MSGCOMMANDS, MSGNICK) {
            if (!$("#nick").val().includes("DosFight")) {
                $(".message-text").remove();
                $(".toast.toast-success").remove();
            }
            
            const coords = MSGCOMMANDS.split("[DosFight]").pop().split('[/DosFight]')[0];
            const [clientX, clientY] = coords.split(',');
            
            if (window.legendmod) {
                window.targetingLeadclientX = clientX;
                window.targetingLeadclientY = clientY;
                window.targetingLeadX = parseFloat(clientX) - window.legendmod.mapOffsetX;
                window.targetingLeadY = parseFloat(clientY) - window.legendmod.mapOffsetY;
                window.legendmod.drawCommander2 = true;
                
                const sector = window.application?.calculateMapSector(
                    window.targetingLeadX, 
                    window.targetingLeadY, 
                    true
                );
                
                toastr.warning(`<b>${MSGNICK}:</b> Fight ${sector}`)
                    .css("width", "210px");
            }
        },
        
        handleDosRun(MSGCOMMANDS, MSGNICK) {
            if (!$("#nick").val().includes("DosRun")) {
                $(".message-text").remove();
                $(".toast.toast-success").remove();
            }
            
            const coords = MSGCOMMANDS.split("[DosRun]").pop().split('[/DosRun]')[0];
            const [clientX, clientY] = coords.split(',');
            
            if (window.legendmod) {
                window.targetingLeadclientX = clientX;
                window.targetingLeadclientY = clientY;
                window.targetingLeadX = parseFloat(clientX) - window.legendmod.mapOffsetX;
                window.targetingLeadY = parseFloat(clientY) - window.legendmod.mapOffsetY;
                window.legendmod.drawCommander2 = true;
                
                const sector = window.application?.calculateMapSector(
                    window.targetingLeadX, 
                    window.targetingLeadY, 
                    true
                );
                
                toastr.warning(`<b>${MSGNICK}:</b> Run from ${sector}`)
                    .css("width", "210px");
            }
        },
        
        handleServer(MSGCOMMANDS, MSGNICK) {
            let MSGCOMMANDS2 = MSGCOMMANDS.split("[srv]").pop().split('[/srv]')[0];
            
            if (!MSGCOMMANDS2.includes("https://") && !MSGCOMMANDS2.includes("http://")) {
                MSGCOMMANDS2 = `https://${MSGCOMMANDS2}`;
            }
            
            const region = Utils.getParameterByName("r", MSGCOMMANDS2);
            const mode = Utils.getParameterByName("mode", MSGCOMMANDS2);
            const pass = Utils.getParameterByName("pass", MSGCOMMANDS);
            
            let displayText = '';
            if (MSGCOMMANDS2.includes("agar.io/#")) {
                const token = MSGCOMMANDS2.split("#").pop();
                displayText = `Server Token: ${token}`;
            } else if (region != null) {
                displayText = `Region: ${region}, Mode: ${mode || 'Unknown'}, Pass: ${pass || 'None'}`;
            } else {
                displayText = `Server: ${MSGCOMMANDS2}, Pass: ${pass || 'None'}`;
            }
            
            toastr.warning(`
                <div>
                    <img src="https://i.imgur.com/server.png" 
                         style="width:30px; height:30px; display:inline; margin-right:5px;">
                    Player ${MSGNICK} sent server info<br>
                    ${displayText}<br>
                    <button id="acceptURL" class="btn btn-block btn-info" 
                            style="margin-top: 10px;border-color: darkblue;">
                        Join
                    </button><br>
                    <button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" 
                            style="width: 100%;margin-top: -10px;">
                        Decline
                    </button>
                </div>
            `, "", {
                timeOut: 10000,
                extendedTimeOut: 10000
            }).css("width", "300px");
            
            $("#acceptURL").click(() => {
                if (MSGCOMMANDS2.includes("agar.io/#")) {
                    const token = MSGCOMMANDS2.split("#").pop();
                    $("#joinPartyToken").val(token);
                    $("#join-party-btn").click();
                } else {
                    window.open(MSGCOMMANDS2, '_blank');
                }
            });
        }
    };

    // ==========================================
    // SEARCH MODULE
    // ==========================================
    
    const SearchModule = {
        handler(searchStr) {
            searchStr = searchStr.trim();
            
            if (this.handleIP(searchStr)) {
                return;
            } else if (this.handleToken(searchStr)) {
                return;
            } else {
                this.searchPlayer(searchStr);
            }
        },
        
        handleToken(searchStr) {
            if (searchStr.startsWith("https://agar.io/#")) {
                this.joinPartyFromConnect(searchStr.replace("https://agar.io/#", ""));
                state.realmode = ":party";
                return true;
            } else if (searchStr.startsWith("agar.io/#")) {
                this.joinToken(searchStr.replace("agar.io/#", ""));
                state.realmode = ":party";
                return true;
            }
            return false;
        },
        
        joinToken(token) {
            UI.appendLog($("#leaderboard-positions").text());
            $("#joinPartyToken").val(token);
            $("#join-party-btn").click();
            $("#joinPartyToken").val("");
            $("#gamemode").val("");
            state.currentToken = token;
            $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
        },
        
        joinPartyFromConnect(token) {
            $("#party-token").val(token);
            $("#join-party-btn-2").click();
            if (window.legendmod) {
                window.legendmod.gameMode = ":party";
            }
            state.realmode = ":party";
        },
        
        handleIP(searchStr) {
            state.region = $("#regioncheck").val();
            state.realmode = $("#gamemodecheck").val();
            
            $("#Backtomenu").hide();
            UI.hideMenu();
            UI.showSearchHud();
            
            searchStr = searchStr.trim();
            
            // Check various IP formats
            if (Utils.isValidIpAndPort(searchStr)) {
                this.findIP(searchStr);
                return true;
            }
            
            const replacements = [
                "wss://",
                "agar.io/?search=wss://",
                "https://agar.io/?search=wss://"
            ];
            
            for (const prefix of replacements) {
                const cleaned = searchStr.replace(prefix, "").replace(".agar.io", "");
                if (Utils.isValidIpAndPort(cleaned)) {
                    this.findIP(cleaned);
                    return true;
                }
            }
            
            // Check if it's a URL parameter
            const searchParam = Utils.getParameterByName("search", searchStr);
            if (searchParam) {
                if (state.region) {
                    $(`#region option[value="${state.region}"]`).prop('selected', 'selected').change();
                    if (!document.URL.includes('jimboy3100.github.io')) {
                        // getInfo();
                    }
                }
                const ip = searchParam.replace("wss://", "").replace(".agar.io", "");
                this.findIP(ip);
                return true;
            }
            
            return false;
        },
        
        findIP(searchIP) {
            // Set game mode based on realmode
            const modeMap = {
                ":party": ":party",
                ":ffa": "",
                ":teams": ":teams",
                ":experimental": ":experimental"
            };
            
            if (modeMap[state.realmode] !== undefined) {
                $(`#gamemode option[value="${modeMap[state.realmode]}"]`)
                    .prop('selected', 'selected').change();
            }
            
            if (state.searching) {
                $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                clearInterval(state.timerId);
                state.searching = false;
                toastr.error("Search cancelled!").css("width", "210px");
                return;
            }
            
            if (!searchIP.trim()) return;
            
            state.searching = true;
            const interval = 1800;
            const maxTries = 8;
            let numTries = 0;
            let numAttempts = 0;
            const maxAttempts = 2;
            
            toastr.success(`Searching for 'wss://${searchIP}.agar.io'...`)
                .css("width", "210px");
            
            numTries++;
            
            if (state.currentIP === searchIP) {
                $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                state.searching = false;
                toastr.info(`
                    Server found!<br>
                    <button class="btn btn-play btn-primary btn-needs-server" 
                            onclick="LegendMod.UI.hideSearchHud();LegendMod.play();" 
                            style="margin-top: 10px;border-color: darkblue;">
                        Play
                    </button><br>
                    <button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" 
                            onclick="LegendMod.UI.hideSearchHud();" 
                            style="width: 100%;margin-top: 10px;">
                        Cancel
                    </button>
                `, "", {
                    timeOut: 20000,
                    extendedTimeOut: 20000
                }).css("width", "210px");
                return;
            }
            
            if (window.changeServer) window.changeServer();
            
            state.timerId = setInterval(() => {
                if (numAttempts === maxAttempts) {
                    numAttempts = 0;
                    numTries++;
                    toastr.success(`Attempt: ${numTries}/${maxTries}`)
                        .css("width", "210px");
                    
                    if (numTries >= maxTries) {
                        $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                        clearInterval(state.timerId);
                        state.searching = false;
                        toastr.error("Server not found").css("width", "210px");
                        return;
                    }
                    
                    if (state.currentIP === searchIP) {
                        $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                        clearInterval(state.timerId);
                        state.searching = false;
                        toastr.info(`
                            Server found!<br>
                            <button class="btn btn-play btn-primary btn-needs-server" 
                                    onclick="LegendMod.UI.hideSearchHud();LegendMod.play();" 
                                    style="margin-top: 10px;border-color: darkblue;">
                                Play
                            </button><br>
                            <button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" 
                                    onclick="LegendMod.UI.hideSearchHud();" 
                                    style="width: 100%;margin-top: 10px;">
                                Cancel
                            </button>
                        `, "", {
                            timeOut: 20000,
                            extendedTimeOut: 20000
                        }).css("width", "210px");
                    } else {
                        if (window.changeServer) window.changeServer();
                    }
                } else {
                    numAttempts++;
                }
            }, interval);
        },
        
        searchPlayer(searchString) {
            if (state.searching) {
                $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                clearInterval(state.timerId);
                state.searching = false;
                toastr.error("Search cancelled").css("width", "210px");
                return;
            }
            
            if (!searchString.trim()) return;
            
            state.searching = true;
            const interval = 1800;
            const maxTries = 8;
            let numTries = 0;
            const minNamesFound = 3;
            let numAttempts = 0;
            const maxAttempts = 2;
            
            toastr.success(`Searching for '${searchString}'...`)
                .css("width", "210px");
            
            const checkLeaderboard = () => {
                const leaderboard = $("#leaderboard-positions").text();
                const names = searchString.split(/[1-9]\.\s|10\.\s/g)
                    .filter(el => el.length !== 0);
                const numNames = names.length;
                
                if (numNames === 1) {
                    return leaderboard.includes(searchString);
                } else if (numNames > 1) {
                    const countFound = names.filter(name => 
                        leaderboard.includes(name)
                    ).length;
                    return countFound >= minNamesFound;
                }
                return false;
            };
            
            numTries++;
            toastr.success(`Attempt: ${numTries}/${maxTries}`)
                .css("width", "210px");
            
            if (checkLeaderboard()) {
                $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                state.searching = false;
                toastr.info(`
                    Player found!<br>
                    <button class="btn btn-play btn-primary btn-needs-server" 
                            onclick="LegendMod.UI.hideSearchHud();LegendMod.play();" 
                            style="margin-top: 10px;border-color: darkblue;">
                        Play
                    </button><br>
                    <button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" 
                            onclick="LegendMod.UI.hideSearchHud();" 
                            style="width: 100%;margin-top: 10px;">
                        Cancel
                    </button>
                `, "", {
                    timeOut: 20000,
                    extendedTimeOut: 20000
                }).css("width", "210px");
                $("#gamemode").val("nothing");
                return;
            }
            
            if (window.changeServer) window.changeServer();
            
            state.timerId = setInterval(() => {
                if (numAttempts === maxAttempts) {
                    numAttempts = 0;
                    const found = checkLeaderboard();
                    numTries++;
                    toastr.success(`Attempt: ${numTries}/${maxTries}`)
                        .css("width", "210px");
                    
                    if (numTries >= maxTries) {
                        clearInterval(state.timerId);
                        state.searching = false;
                        toastr.error("Player not found").css("width", "210px");
                        return;
                    }
                    
                    if (found) {
                        $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                        clearInterval(state.timerId);
                        state.searching = false;
                        toastr.info(`
                            Player found!<br>
                            <button class="btn btn-play btn-primary btn-needs-server" 
                                    onclick="LegendMod.UI.hideSearchHud();LegendMod.play();" 
                                    style="margin-top: 10px;border-color: darkblue;">
                                Play
                            </button><br>
                            <button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" 
                                    onclick="LegendMod.UI.hideSearchHud();" 
                                    style="width: 100%;margin-top: 10px;">
                                Cancel
                            </button>
                        `, "", {
                            timeOut: 20000,
                            extendedTimeOut: 20000
                        }).css("width", "210px");
                    } else {
                        if (window.changeServer) window.changeServer();
                    }
                } else {
                    numAttempts++;
                }
            }, interval);
        }
    };

    // ==========================================
    // SETTINGS MODULE
    // ==========================================
    
    const Settings = {
        loadSettings() {
            // Increment times opened
            const times = Storage.increment("timesopened");
            state.timesopened = times.toString();
            
            // Check for first-time messages
            if (times >= 3 && Storage.get("checkonlyonce") !== "true") {
                if (Storage.get("SHOSHOBtn") !== "true") {
                    toastr.error(`
                        Enable shortcuts?<br>
                        <button id="enableshortcuts1" 
                                class="btn btn-sm btn-primary btn-play btn-enable-shortcuts" 
                                onclick="LegendMod.enableShortcuts();" 
                                style="margin-top: 10px;border-color: darkblue;">
                            Enable
                        </button><br>
                        <button class="btn btn-sm btn-warning btn-spectate btn-play btn-enable-shortcuts" 
                                style="width: 100%;margin-top: 10px;">
                            Skip
                        </button>
                    `, "", {
                        timeOut: 15000,
                        extendedTimeOut: 15000
                    }).css("width", "300px");
                    
                    Storage.set("checkonlyonce", "true");
                }
            }
            
            // Load reward day promo
            if (Storage.get("checkonlyrewardday3") !== "true") {
                // LMnoBotsPromo();
                Storage.set("checkonlyrewardday3", "true");
            }
            
            if (Storage.get("checkonlyeleventh") !== "true") {
                Storage.set("checkonlyeleventh", "true");
            }
            
            // Special times opened messages
            if (times === 10 || times === 100 || times === 1000) {
                if (Storage.get("SHOSHOBtn") !== "true") {
                    toastr.error(`
                        Enable shortcuts?<br>
                        <button id="enableshortcuts1" 
                                class="btn btn-sm btn-primary btn-play btn-enable-shortcuts" 
                                onclick="LegendMod.enableShortcuts();" 
                                style="margin-top: 10px;border-color: darkblue;">
                            Enable
                        </button><br>
                        <button class="btn btn-sm btn-warning btn-spectate btn-play btn-enable-shortcuts" 
                                style="width: 100%;margin-top: 10px;">
                            Skip
                        </button>
                    `, "", {
                        timeOut: 15000,
                        extendedTimeOut: 15000
                    }).css("width", "300px");
                    
                    Storage.set("checkonlyonce", "true");
                }
            }
        },
        
        triggerLMbtns() {
            // Load button states
            if (Storage.get("SHOSHOBtn") === "true") {
                $("#SHOSHOBtn").click();
            }
            if (Storage.get("MAINBTBtn") === "true") {
                $("#MAINBTBtn").click();
            }
            if (Storage.get("AnimatedSkinBtn") === "true") {
                $("#AnimatedSkinBtn").click();
            }
            if (Storage.get("XPBtn") === "true") {
                $("#XPBtn").click();
            }
            if (Storage.get("TIMEcalBtn") === "true") {
                $("#TIMEcalBtn").click();
            }
            
            // Load background images
            const minimapbckimg = Storage.get("minimapbckimg");
            if (minimapbckimg) {
                $("#minimapPicture").val(minimapbckimg);
                $("#minimap-hud").css({
                    'background-image': `url("${minimapbckimg}")`,
                    'opacity': 0.8
                });
            }
            
            const leadbimg = Storage.get("leadbimg");
            if (leadbimg) {
                $("#leadbPicture").val(leadbimg);
                $("#leaderboard-hud").css({
                    'background-image': `url("${leadbimg}")`,
                    'opacity': 0.8
                });
            }
            
            const teambimg = Storage.get("teambimg");
            if (teambimg) {
                $("#teambPicture").val(teambimg);
                $("#top5-hud").css({
                    'background-image': `url("${teambimg}")`,
                    'opacity': 0.8
                });
            }
            
            const canvasbimg = Storage.get("canvasbimg");
            if (canvasbimg) {
                $("#canvasPicture").val(canvasbimg);
                $("#canvas").css({
                    'background-image': `url("${canvasbimg}")`,
                    'opacity': 1,
                    'background-size': 'cover'
                });
            }
            
            // Load texts
            const leadbtext = Storage.get("leadbtext");
            if (leadbtext) {
                $("#leadbtext").val(leadbtext);
                $("#leaderboard-hud > h5").text(leadbtext);
            }
            
            const teambtext = Storage.get("teambtext");
            if (teambtext) {
                $("#teambtext").val(teambtext);
                $("#top5-hud > h5").text(teambtext);
            }
            
            const minbtext = Storage.get("minbtext");
            if (minbtext) {
                $("#minbtext").val(minbtext);
                const canvas = document.getElementById("minimap-sectors");
                if (canvas) {
                    const ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height / 9);
                    ctx.font = "16px Georgia";
                    ctx.fillText(minbtext, canvas.width / 2, 22);
                }
            }
            
            // Load all other settings
            ["imgUrl", "imgHref", "pic1url", "pic2url", "pic3url", "pic4url", "pic5url", "pic6url",
             "yt1url", "yt2url", "yt3url", "yt4url", "yt5url", "yt6url",
             "pic1data", "pic2data", "pic3data", "pic4data", "pic5data", "pic6data",
             "yt1data", "yt2data", "yt3data", "yt4data", "yt5data", "yt6data",
             "discwebhook1", "discwebhook2"].forEach(key => {
                const value = Storage.get(key);
                if (value && value !== "null") {
                    $(`#${key}`).val(value);
                }
            });
            
            // Load dying light
            if (state.dyinglight1load === "yes") {
                // opendyinglight();
            }
        }
    };

    // ==========================================
    // UI SETUP FUNCTIONS
    // ==========================================
    
    function setupUI() {
        // Hide default UI elements
        $('.agario-panel.radio-panel').hide();
        $('.agario-panel.ogario-yt-panel').hide();
        
        // Update buttons
        $("button:contains('Spectate')").html('<span class="glyphicon glyphicon-globe"></span>')
            .attr('data-toggle', "tooltip").prop('title', 'Spectate');
        
        $("button:contains('Logout')").html('<span class="glyphicon glyphicon-off"></span>')
            .attr('data-toggle', "tooltip").prop('title', 'Logout');
        
        $("button:contains('Copy')").removeClass("btn-info").addClass("btn-link");
        
        $("#create-party-btn-2").html('<span class="glyphicon glyphicon-plus"></span>')
            .attr('data-toggle', "tooltip").prop('title', "Create party");
        
        $("#join-party-btn").html('<span class="glyphicon glyphicon-save"></span>')
            .attr('data-toggle', "tooltip").prop('title', "Join party")
            .attr("style", "width: 49% !important; float: right;");
        
        // Add background fade
        $("body").prepend('<div id="backgroundFade" style="width: 100%; height: 100%; position: absolute; background: black; z-index: 100; opacity: 0.6; display: none;"></div>');
        
        // Setup legend tab
        $(".menu-tabs>:nth-child(2)").after(`
            <li class="legend-tab" style="width: 16.66%; padding:12px;" 
                data-toggle="tooltip" data-original-title="API" data-placement="top">
                <a style="margin-top: 2px; height: 100%; padding:12px;" 
                   onclick="$('#main-menu').children('div').hide(); 
                            $('.menu-tabs').children('li').removeClass('active'); 
                            $('.menu-tabs').children('li').children('a').removeClass('active'); 
                            $('#legend').fadeIn(); 
                            $(this).addClass('active'); 
                            $(this).parent().addClass('active');" 
                   href="javascript:void(0);" 
                   class="fa fa-puzzle-piece fa-lg">
                </a>
            </li>
        `);
        
        $(".menu-tabs").children().attr("style", "width: 14.28%");
        
        // Add all UI components
        addLegendPanel();
        addShortcutsHUD();
        addSearchHUD();
        addTimer();
        addStatsInfo();
        addNotes();
        addLeaderboardMenu();
        setupClantag();
        
        // Enable tooltips
        $('[data-toggle="tooltip"]').tooltip();
    }

    function addLegendPanel() {
        $("#main-menu>#profile").after(`
            <div id="legend" class="menu-panel" style="display:none;">
                <div class="agario-panel legend-panel">
                    <button id="SHOSHOBtn" type="button" 
                            class="btn btn-sm btn-warning" 
                            data-toggle="button" 
                            aria-pressed="false" 
                            autocomplete="off" 
                            style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;">
                        <i class="fa fa-puzzle-piece"></i> Shortcuts OFF
                    </button>
                    <button id="XPBtn" type="button" 
                            class="btn btn-sm btn-warning" 
                            data-toggle="button" 
                            aria-pressed="false" 
                            autocomplete="off" 
                            style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%;">
                        <i class="fa fa-gamepad"></i> XP OFF
                    </button>
                    <button id="MAINBTBtn" type="button" 
                            class="btn btn-sm btn-warning" 
                            data-toggle="button" 
                            aria-pressed="false" 
                            autocomplete="off" 
                            style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;">
                        <i class="fa fa-minus"></i> Square OFF
                    </button>
                    <button id="AnimatedSkinBtn" type="button" 
                            class="btn btn-sm btn-warning" 
                            data-toggle="button" 
                            aria-pressed="false" 
                            autocomplete="off" 
                            style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%;">
                        <i class="fa fa-grav"></i> Animated OFF
                    </button>
                    <button id="HideAllBthn" type="button" 
                            class="btn btn-sm btn-danger" 
                            data-toggle="button" 
                            aria-pressed="false" 
                            autocomplete="off" 
                            style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;">
                        <i class="fa fa-exclamation-triangle"></i> Hide All
                    </button>
                    <button id="TIMEcalBtn" type="button" 
                            class="btn btn-sm btn-warning" 
                            data-toggle="button" 
                            aria-pressed="false" 
                            autocomplete="off" 
                            style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%;">
                        <i class="fa fa-calculator"></i> Timer OFF
                    </button>
                    <button id="OpenuserScripts" type="submit" 
                            class="btn btn-primary btn 2" 
                            style="margin-top: 2px; display: block; width: 100%; padding: 4px 0 6px 0;">
                        <i class="fa fa-code"></i> User Scripts
                    </button>
                    <button id="SpecialDealsBtn" class="btn btn-primary btn" type="submit" 
                            style="width: 100%; padding: 4px 0px 6px; margin-top: 2px;">
                        <i class="fa fa-briefcase"></i> Special Deals
                    </button>
                    <button id="LegendmodShop" class="btn btn-primary btn" type="submit" 
                            style="width: 100%; padding: 4px 0px 6px; margin-top: 2px;">
                        <i class="fa fa-briefcase"></i> Shop
                    </button>
                </div>
            </div>
        `);
    }

    function addShortcutsHUD() {
        $("#minimap-hud").prepend(`
            <div id="shortcuts-hud" class="hud" 
                 style="width: 70%; height: 30px; padding: 0px; pointer-events: auto; 
                        position: absolute; right: 0px; top: -30px; display: none;">
                <button id="VoiceBtn" class="btn-link" 
                        style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" 
                        data-toggle="tooltip" data-original-title="Voice & Camera Chat">
                    <i id="VoiceBtn1" class="fa fa-microphone" style="padding-left: 0px;"></i>
                </button>
                <button id="MiniScripts" class="btn-link" 
                        style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" 
                        data-toggle="tooltip" data-original-title="Mini Scripts">
                    <i id="MiniScripts1" class="fa fa-linode" style="padding-left: 0px;"></i>
                </button>
                <button id="SendCommands" class="btn-link" 
                        style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" 
                        data-toggle="tooltip" data-original-title="Message Script Commands">
                    <i id="SendCommands1" class="fa fa-sitemap" style="padding-left: 0px;"></i>
                </button>
                <button id="Images" class="btn-link" 
                        style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" 
                        data-toggle="tooltip" data-original-title="Message Imgur Icons">
                    <i id="Images1" class="fa fa-picture-o" style="padding-left: 0px;"></i>
                </button>
                <button id="yout" class="btn-link" 
                        style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" 
                        data-toggle="tooltip" data-original-title="Message Youtube Videos">
                    <i id="yout1" class="fa fa-youtube" style="padding-left: 0px;"></i>
                </button>
                <button id="playerBtn" class="btn-link" 
                        style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" 
                        data-toggle="tooltip" data-original-title="Play/Pause Youtube">
                    <i id="playerI" class="fa fa-play-circle" style="padding-center: 0px;"></i>
                </button>
            </div>
        `);
        
        // Add additional HUDs for icons, youtube, commands, scripting
        $("#minimap-hud").prepend(`
            <div id="images-hud" class="hud" 
                 style="width: 70%; height: 30px; padding: 0px; pointer-events: auto; 
                        position: absolute; right: 0px; top: -60px; display: none;">
                ${[1,2,3,4,5,6].map(i => `
                    <button id="sendicon${i}" class="btn-link" 
                            style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" 
                            data-toggle="tooltip" data-original-title="${state[`pic${i}dataimg`]}">
                        <i class="fa fa-${['exclamation-triangle', 'question-circle', 'wheelchair', 'cutlery', 'bed', 'telegram'][i-1]}" 
                           style="padding-left: 0px;"></i>
                    </button>
                `).join('')}
            </div>
            <div id="yt-hud" class="hud" 
                 style="width: 70%; height: 30px; padding: 0px; pointer-events: auto; 
                        position: absolute; right: 0px; top: -60px; display: none;">
                ${[1,2,3,4,5,6].map(i => `
                    <button id="sendyt${i}" class="btn-link" 
                            style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" 
                            data-toggle="tooltip" data-original-title="${state[`yt${i}data`]}">
                        <i class="fa fa-${i <= 3 ? 'music' : i <= 5 ? 'video-camera' : 'telegram'}" 
                           style="padding-left: 0px;"></i>
                    </button>
                `).join('')}
            </div>
            <div id="msgcommands-hud" class="hud" 
                 style="width: 70%; height: 30px; padding: 0px; pointer-events: auto; 
                        position: absolute; right: 0px; top: -60px; display: none;">
                ${[
                    {icon: 'coffee', title: 'Hello Team!'},
                    {icon: 'smile-o', title: 'Laugh to Team'},
                    {icon: 'magic', title: 'Team Change Name to yours'},
                    {icon: 'bath', title: 'Troll Teammate'},
                    {icon: 'youtube-play', title: 'Open Youtube Music'},
                    {icon: 'exclamation-triangle', title: 'Insane mode (Hide Everything)'}
                ].map((cmd, i) => `
                    <button id="msgcommand${i+1}" class="btn-link" 
                            style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" 
                            data-toggle="tooltip" data-original-title="${cmd.title}">
                        <i class="fa fa-${cmd.icon}" style="padding-left: 0px;"></i>
                    </button>
                `).join('')}
            </div>
            <div id="scripting-hud" class="hud" 
                 style="width: 12.5%; height: 30px; padding: 0px; pointer-events: auto; 
                        position: absolute; right: 0px; top: -60px; display: none;">
                <button id="Cutnames" class="btn-link" 
                        style="padding: 0px; color: #d6d3d3; width: 100%; height: 100%;" 
                        data-toggle="tooltip" data-original-title="Edit names">
                    <i class="fa fa-scissors" style="padding-left: 0px;"></i>
                </button>
            </div>
        `);
    }

    function addSearchHUD() {
        $("#overlays-hud").prepend(`
            <div id="statsInfo" class="main-color" 
                 style="pointer-events: auto; display: none; font-size: 13px; margin-top: 3px; 
                        float: left; font-weight: 700; background-color: rgba(0, 0, 0, 0.2); 
                        padding: 3px; border-radius: 4px; width: 65%; height: 44px; z-index: 15; 
                        margin: auto; top: 0px; right: 0px; left: 0px; bottom: 85px; 
                        position: fixed; pointer-events: auto; color: #ffffff;">
                <p style="float: right; margin-right: 10px;">
                    <span id="notesServer">Servers: </span>
                    <span id="numServers"></span> 
                    (<span id="pps"></span> 
                    <span data-toggle="tooltip" data-placement="top" 
                          data-original-title="Players per server">PPS</span>)
                </p>
                <p style="float: right; margin-right: 100px;">
                    <span id="notesPlayers">Players: </span>
                    <span id="numPlayers"></span> / 
                    <span id="totalPlayers" data-toggle="tooltip" data-placement="top" 
                          data-original-title="Total players online"></span>
                </p>
            </div>
            <div id="searchHud" class="hud" 
                 style="width: 65%; height: 60px; z-index: 15; margin: auto; 
                        top: 0; right: 0; left: 0; bottom: 0; position: fixed; display: none;">
                <div style="margin-top: 10px;">
                    <input id="searchInput" class="form-control" 
                           placeholder="Enter friend's token, IP, leaderboard, name or clan tag..." 
                           style="pointer-events: auto; margin-bottom: 10px; float: left; 
                                  width: 80% !important; text-align: center;">
                    <button id="searchBtn" 
                            class="btn btn-copy-token copy-party-token btn-primary" 
                            data-toggle="tooltip" data-placement="bottom" 
                            data-original-title="Search/Cancel" 
                            style="pointer-events: auto; margin-bottom:10px; width: 15%;">
                        <span id="searchSpan"><i class="fa fa-search"></i></span>
                    </button>
                </div>
            </div>
        `);
        
        $("#searchHud").after(`
            <div id="searchLog" class="main-color" 
                 style="font-size: 13px; float: left; font-weight: 700; border-radius: 4px; 
                        width: 65%; height: 270px; z-index: 15; margin: auto; top: 0px; 
                        right: 0px; left: 0px; bottom: -390px; position: fixed; 
                        pointer-events: auto; color: rgb(255, 255, 255); padding: 10px; 
                        display: none; background-color: rgba(0, 0, 0, 0.2);">
                <h5 id="logTitle" class="main-color text-center" style="margin-top: 0px;">
                    Results
                </h5>
                <a href="#" id="notesclear" 
                   style="color: lightgrey;float: right;position: absolute;right: 12px;top: 9px;" 
                   class="main-color" onclick="$('#log').html('');" 
                   data-toggle="tooltip" data-placement="left" data-original-title="Clear list">
                    <i class="fa fa-trash fa-2"></i>
                </a>
                <div id="log" 
                     style="font-weight: normal; overflow-x: hidden; overflow-y: auto; height: 90%;">
                </div>
            </div>
        `);
    }

    function addTimer() {
        $("#minimap-hud").prepend(`
            <div id="timertools-hud" class="hud" align="center" 
                 style="width: 50%; height: 30px; padding: 0px; pointer-events: auto; 
                        position: absolute; right: 0px; top: -90px; display: none;">
                <button id="playtimer" class="btn-link" 
                        style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%; display: block;" 
                        data-toggle="tooltip" data-original-title="Start Timer">
                    <i id="playtime" class="fa fa-play-circle" style="padding-left: 0px;"></i>
                </button>
                <button id="stoptimer" class="btn-link" 
                        style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%; display: none;" 
                        data-toggle="tooltip" data-original-title="Pause Timer">
                    <i id="pausetime" class="fa fa-pause-circle" style="padding-left: 0px;"></i>
                </button>
                <button id="cleartimer" class="btn-link" 
                        style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%; display: none;" 
                        data-toggle="tooltip" data-original-title="Stop Timer">
                    <i id="cleartime" class="fa fa-stop-circle" style="padding-left: 0px;"></i>
                </button>
                <a id="timer" 
                   style="padding: 0px; color: #d6d3d3; width: 12%; height: 100%; 
                          position: absolute; right: 0px;">
                    00:00
                </a>
            </div>
        `);
        
        TimerLM.timerDiv = document.getElementById('timer');
    }

    function addStatsInfo() {
        $("#overlays-hud").prepend(`
            <div id="statsInfo" class="main-color" 
                 style="pointer-events: auto;display: none;font-size: 13px;margin-top: 3px;
                        float: left;font-weight: 700;background-color: rgba(0, 0, 0, 0.2);
                        padding: 3px;border-radius: 4px;width: 65%;height: 44px;z-index: 15;
                        margin: auto;top: 0px;right: 0px;left: 0px;bottom: 85px;position: fixed;
                        pointer-events: auto;color: #ffffff;">
                <p style="float: right; margin-right: 10px;">
                    <span id="notesServer">Servers: </span><span id="numServers"></span> 
                    (<span id="pps"></span> <span data-toggle="tooltip" data-placement="top" 
                    data-original-title="Players per server">PPS</span>)
                </p>
                <p style="float: right;margin-right: 100px;">
                    <span id="notesPlayers">Players: </span><span id="numPlayers"></span> / 
                    <span id="totalPlayers" data-toggle="tooltip" data-placement="top" 
                    data-original-title="Total players online"></span>
                </p>
            </div>
        `);
    }

    function addNotes() {
        $("#statsInfo").before(`
            <div id="notes" class="main-color" 
                 style="display:none;font-size: 13px;float: left;font-weight: 700;
                        border-radius: 4px;width: 65%;height: 147px;z-index: 15;margin: auto;
                        top: 0px;right: 0px;left: 0px;bottom: 400px;position: fixed;
                        pointer-events: auto;color: rgb(255, 255, 255);padding: 10px;
                        background-color: rgba(0, 0, 0, 0.2);">
                <h5 id="notesaveforlater" class="main-color text-center" style="margin-top: 0px;">
                    Save for later
                </h5>
                ${[1,2,3,4,5,6,7].map(i => {
                    const width = i === 3 || i === 6 || i === 7 ? "49%" : i % 3 === 1 ? "25%" : "24%";
                    const marginLeft = i === 3 || i === 6 || i === 7 ? "10px" : i % 3 === 1 ? "0px" : "0px";
                    const marginRight = i % 3 === 1 ? "7px" : i % 3 === 2 ? "7px" : "0px";
                    const float = i === 3 || i === 6 || i === 7 ? "none" : "left";
                    return `
                    <input id="note${i}" class="form-control main-color note" 
                           style="background: transparent;color: lightgrey;width: ${width};
                                  float: ${float};border: none;border-bottom: 1px solid;
                                  margin-left: ${marginLeft};margin-right: ${marginRight};
                                  text-align: center;border-color: darkgrey;">
                    `;
                }).join('')}
            </div>
        `);
        
        $("#notes").append(`
            <button id="closeBtn" class="btn btn-danger" style="margin-top: 20px;">
                Close
            </button>
        `);
    }

    function addLeaderboardMenu() {
        const legmaincolor = $("#hudMainColor").val() || "#8CD140";
        
        $("#leaderboard-hud").append(`
            <div id="leaderboard-menu" style="pointer-events: auto;">
                <a id="searchShortcut" class="btn btn-info" 
                   data-toggle="tooltip" data-placement="left" data-original-title="Join server (Backspace)" 
                   style="width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;
                          margin-top: 0px;border: none;background-color: transparent;
                          color: ${legmaincolor};">
                    <i class="fa fa-search fa-lg"></i>
                </a>
                <a id="copySIPBtn" href="javascript:void(0);" 
                   class="btn btn-sm btn-copy-leaderboard btn-info" 
                   style="background-color: transparent;color: ${legmaincolor};width: 33.3%;
                          text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;
                          border: none;user-select: none;" 
                   data-toggle="tooltip" data-placement="left" data-original-title="Copy Token/SIP">
                    Copy
                </a>
                <a id="reconnectBtn" class="btn btn-info" 
                   data-toggle="tooltip" data-placement="bottom" data-original-title="Change server (+)" 
                   style="background-color: transparent;color: ${legmaincolor};width: 33.3%;
                          text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;border: none;">
                    <i class="fa fa-refresh fa-lg"></i>
                </a>
                <div id="dropDown3" class="hud" 
                     style="position: absolute;pointer-events: auto;width: 33%;height: 60px;
                            left: 0px;padding: 0px;border-radius: 0px;display:none;">
                    <a id="checkServerBots" href="javascript:void(0);" 
                       class="btn btn-sm btn-copy-leaderboard btn-info" 
                       style="width: 100%;text-shadow: 0.3px 0.3px #000000;font-size: small;
                              margin-top: 0px;border: none;background-color: transparent;
                              color: ${legmaincolor};" 
                       data-toggle="tooltip" data-html="true" data-placement="left" 
                       data-original-title="Bot names">
                        <i class="fa fa-exclamation fa-lg"></i>
                    </a><br>
                    <a id="lastIPBtn" href="javascript:void(0);" 
                       class="btn btn-sm btn-copy-leaderboard btn-info" 
                       style="width: 100%;text-shadow: 0.3px 0.3px #000000;font-size: small;
                              margin-top: 0px;border: none;background-color: transparent;
                              color: ${legmaincolor};" 
                       data-toggle="tooltip" data-html="true" data-placement="left" 
                       data-original-title="Join back">
                        <i class="fa fa-arrow-circle-down fa-lg"></i>
                    </a>
                </div>
                <div id="dropDown2" class="hud" 
                     style="position: absolute;pointer-events: auto;width: 33%;height: 90px;
                            left: 67px;padding: 0px;border-radius: 0px;display:none;">
                    <a id="copySIPandPass" href="javascript:void(0);" 
                       class="btn btn-sm btn-copy-leaderboard btn-info" 
                       style="background-color: transparent;color: ${legmaincolor};width: 100%;
                              text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;
                              border: none;user-select: none;" 
                       data-toggle="tooltip" data-placement="left" 
                       data-original-title="Copy Token/SIP&Password">
                        TK&PW
                    </a>
                    <a id="copyLBBtn" href="javascript:void(0);" 
                       class="btn btn-sm btn-copy-leaderboard btn-info" 
                       style="background-color: transparent;color: ${legmaincolor};width: 100%;
                              text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;
                              border: none;user-select: none;" 
                       data-toggle="tooltip" data-placement="left" 
                       data-original-title="Copy Leaderboard (L)">
                        LB
                    </a>
                    <a id="copySIPPassLB" href="javascript:void(0);" 
                       class="btn btn-sm btn-copy-leaderboard btn-info" 
                       style="background-color: transparent;color: ${legmaincolor};width: 100%;
                              text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;
                              border: none;user-select: none;" 
                       data-toggle="tooltip" data-placement="left" 
                       data-original-title="Copy Token/SIP, Password, Leaderboard...">
                        TK&ALL
                    </a>
                </div>
                <div id="dropDown" class="hud" 
                     style="position: absolute;pointer-events: auto;width: 33%;height: 30px;
                            left: 67px;padding: -30px;border-radius: 0px;display:none;">
                    <a id="copyLBBtn" href="javascript:void(0);" 
                       class="btn btn-sm btn-copy-leaderboard btn-info" 
                       style="background-color: transparent;color: ${legmaincolor};width: 100%;
                              text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;
                              border: none;user-select: none;" 
                       data-toggle="tooltip" data-placement="left" 
                       data-original-title="Copy Leaderboard (L)">
                        LB
                    </a>
                </div>
                <input id="tempCopy" style="display: none;" value="">
            </div>
        `);
    }

    function setupClantag() {
        $('#clantag').attr('placeholder', 'Password');
        $('#clantag').css("width", "95.5px");
        $('#nick').css("width", "171px");
    }

    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    
    function setupEventListeners() {
        // Search button
        $("#searchBtn").click(() => {
            if (!state.searching) {
                SearchModule.handler($("#searchInput").val());
            } else {
                $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                clearInterval(state.timerId);
                state.searching = false;
                toastr.error("Search cancelled!").css("width", "210px");
            }
        });
        
        $("#searchInput").keyup((event) => {
            if (event.keyCode === CONFIG.KEY_CODES.ENTER) {
                $("#searchBtn").click();
            }
        });
        
        $("#searchInput").bind("paste", (e) => {
            if (!state.searching) {
                const pastedData = e.originalEvent.clipboardData.getData('text');
                $("#searchInput").val(pastedData);
                $("#searchInput").select();
                $("#searchBtn").click();
            }
        });
        
        // Player button
        $("#playerBtn").click(() => {
            if (state.playerState !== 1) {
                if (YouTubePlayer.player) {
                    $('#musicFrame')[0].contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                }
                $("#playerI").removeClass("fa-play-circle").addClass("fa-pause-circle");
                $(this).attr('data-original-title', 'Pause').tooltip('fixTitle').tooltip('show');
                state.playerState = 1;
            } else {
                if (YouTubePlayer.player) {
                    $('#musicFrame')[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                }
                $("#playerI").removeClass("fa-pause-circle").addClass("fa-play-circle");
                $(this).attr('data-original-title', 'Play').tooltip('fixTitle').tooltip('show');
                state.playerState = 0;
            }
        });
        
        // Nick input
        $("#nick").blur(() => {
            state.previousnickname = $("#nick").val();
            Storage.set("previousnickname", state.previousnickname);
            
            // Check for Easter Eggs
            const nick = $("#nick").val();
            if (nick === "EasterEgg1") {
                toastr.info("Easter Egg 1 activated!").css("width", "210px");
                $("#nick").val("Easter Egg");
                $(".btn.btn-play-guest.btn-success.btn-needs-server").click();
            } else if (nick === "EasterEgg2") {
                toastr.info("Easter Egg 2 activated!").css("width", "210px");
                $("#nick").val("Easter Egg");
                $(".btn.btn-play-guest.btn-success.btn-needs-server").click();
            } else if (nick === "EasterEgg3") {
                toastr.info("Easter Egg 3 activated!").css("width", "210px");
                $("#nick").val("Video");
            }
            
            if (state.clickedname === "YES" && Utils.fancyCount2(nick) >= 16) {
                toastr.warning(`<b>[SERVER]:</b> Nickname too long: ${nick}`);
            }
        });
        
        $("#nick").on("input", function() {
            const nick = $(this).val();
            if (Utils.fancyCount2(nick) > 15) {
                while (Utils.fancyCount2($(this).val()) > 15) {
                    $(this).val($(this).val().slice(0, -1));
                }
            }
        });
        
        // Message commands
        $("body").on('DOMNodeInserted', ".toast.toast-success", () => {
            const MSGCOMMANDS = $(".toast.toast-success").text();
            const MSGNICK = $(".message-nick").last().text().replace(": ", "");
            MessageCommands.process(MSGCOMMANDS, MSGNICK);
        });
        
        $("body").on('DOMSubtreeModified', "#chat-box", () => {
            const MSGCOMMANDS = $(".message-text").text();
            const MSGNICK = $(".message-nick").last().text().replace(": ", "");
            MessageCommands.process(MSGCOMMANDS, MSGNICK);
        });
        
        // Button toggles
        $("#SHOSHOBtn").click(function() {
            const checked = !($(this).attr('aria-pressed') === "true");
            if (checked) {
                Storage.set("SHOSHOBtn", true);
                $("#shortcuts-hud").show();
                $(this).html('<i class="fa fa-puzzle-piece"></i> Shortcuts ON');
            } else {
                Storage.set("SHOSHOBtn", false);
                $("#shortcuts-hud").hide();
                $("#images-hud").hide();
                $("#scripting-hud").hide();
                $("#msgcommands-hud").hide();
                $("#yt-hud").hide();
                $(this).html('<i class="fa fa-puzzle-piece"></i> Shortcuts OFF');
                state.seticon = "YES";
            }
        });
        
        $("#XPBtn").click(function() {
            const checked = !($(this).attr('aria-pressed') === "true");
            if (checked) {
                Storage.set("XPBtn", true);
                $("#exp-bar").show();
                $(this).html('<i class="fa fa-gamepad"></i> XP ON');
            } else {
                Storage.set("XPBtn", false);
                $("#exp-bar").hide();
                $(this).html('<i class="fa fa-gamepad"></i> XP OFF');
            }
        });
        
        $("#MAINBTBtn").click(function() {
            const checked = !($(this).attr('aria-pressed') === "true");
            if (checked) {
                Storage.set("MAINBTBtn", true);
                Utils.inject('stylesheet', `
                    .agario-panel, .center-container, .btn, .form-control, 
                    .input-group-addon,#chat-box, .input-group-sm>.input-group-addon, 
                    .agario-party, .agario-side-panel{border-radius: 10px;}
                    .menu-tabs, #main-panel, #profile, #legend, #og-settings, 
                    #theme, #music, #hotkeys{border-radius: 10px 10px 0 0;} 
                    #hotkeys {border-radius: 10px;} 
                    .skin, .input-group-btn, .input-group.nick {border-radius: 0 15px 15px 0;}
                    .colorpicker-element .input-group-addon i, 
                    .colorpicker-element .add-on i{border-radius: 50%;}
                    .agario-profile-picture {border-radius: 32px;}
                    #menu-footer {border-radius: 0 0 10px 10px;} 
                    #leaderboard-hud {border-radius: 15px;}
                    #dropDown, #dropDown2 {border-radius: 15px;}
                    #minimap-hud {border-radius: 0 0 15px 15px;}
                    #top5-hud{border-radius: 15px;} 
                    #target-hud{border-radius: 15px;} 
                    #legendAdImg, #stats-hud {border-radius: 10px;} 
                    #time-hud {border-radius: 10px;}
                `);
                $(this).html('<i class="fa fa-minus"></i> Square ON');
            } else {
                Storage.set("MAINBTBtn", false);
                Utils.inject('stylesheet', `
                    .agario-panel, .center-container, .btn, .form-control, 
                    .input-group-addon,#chat-box, .input-group-sm>.input-group-addon, 
                    .agario-party, .agario-side-panel, .menu-tabs, #main-panel, 
                    #profile, #legend, #og-settings, #theme, #music, #hotkeys, 
                    #hotkeys, .skin, .input-group-btn, .input-group.nick,  
                    .colorpicker-element .input-group-addon i, 
                    .colorpicker-element .add-on i, .agario-profile-picture, 
                    #menu-footer, #leaderboard-hud, #dropDown, #dropDown2, 
                    #minimap-hud, #top5-hud, #target-hud, #legendAdImg, 
                    #stats-hud, #time-hud {border-radius: 0;}
                `);
                $(this).html('<i class="fa fa-minus"></i> Square OFF');
            }
        });
        
        $("#AnimatedSkinBtn").click(function() {
            const checked = !($(this).attr('aria-pressed') === "true");
            const hudColor = $("#hudColor").val() || "#000000";
            if (checked) {
                Storage.set("AnimatedSkinBtn", true);
                Utils.inject('stylesheet', `
                    #top5-hud{top:10px!important;background:linear-gradient(to right,${hudColor},rgba(255,255,255,0))}
                    #leaderboard-hud{top:10px!important;background:linear-gradient(to left,${hudColor},rgba(255,255,255,0))}
                    #chat-box{background:linear-gradient(to right,${hudColor},rgba(255,255,255,0))}
                    #minimap-hud,#timertools-hud, #shortcuts-hud, #time-hud,#msgcommands-hud, 
                    #scripting-hud, #images-hud, #yt-hud{background:linear-gradient(to left,${hudColor},rgba(255,255,255,0))}
                    #target-hud,#target-panel-hud {background:linear-gradient(to bottom,${hudColor},rgba(255,255,255,0))}
                    #stats-hud{background:linear-gradient(to top,${hudColor},rgba(255,255,255,0))}
                    #stats-hud{left: 50%!important; transform: translateX(-50%)!important; text-align: center;}
                    .hud-top{top: 93%!important;}
                    #chat-box{bottom: 2%!important;}
                `);
                $(this).html('<i class="fa fa-grav"></i> Animated ON');
            } else {
                Storage.set("AnimatedSkinBtn", false);
                $(this).html('<i class="fa fa-grav"></i> Animated OFF');
            }
        });
        
        $("#TIMEcalBtn").click(function() {
            const checked = !($(this).attr('aria-pressed') === "true");
            if (checked) {
                Storage.set("TIMEcalBtn", true);
                $("#timertools-hud").show();
                $(this).html('<i class="fa fa-calculator"></i> Timer ON');
            } else {
                Storage.set("TIMEcalBtn", false);
                $("#timertools-hud").hide();
                $(this).html('<i class="fa fa-calculator"></i> Timer OFF');
            }
        });
        
        $("#HideAllBthn").click(function() {
            const checked = !($(this).attr('aria-pressed') === "true");
            if (checked) {
                $("#shortcuts-hud").hide();
                $("#exp-bar").hide();
                $("#time-hud").hide();
                $("#leaderboard-hud").hide();
                $("#minimap-hud").hide();
                $("#stats-hud").hide();
                $("#top5-hud").hide();
                $("#target-hud").hide();
                $("#target-panel-hud").hide();
                $(this).html('<i class="fa fa-exclamation-triangle"></i> Show All');
            } else {
                $("#shortcuts-hud").show();
                $("#exp-bar").show();
                $("#leaderboard-hud").show();
                $("#minimap-hud").show();
                $("#stats-hud").show();
                $("#top5-hud").show();
                $("#target-panel-hud").show();
                $("#target-hud").show();
                $(this).html('<i class="fa fa-exclamation-triangle"></i> Hide All');
            }
        });
        
        // Timer buttons
        $("#playtimer").click(() => TimerLM.start());
        $("#stoptimer").click(() => TimerLM.stop());
        $("#cleartimer").click(() => TimerLM.clear());
        
        // Close buttons
        $("#closeBtn").click(() => {
            UI.hideSearchHud();
            UI.showMenu2();
        });
        
        // Search shortcut
        $("#searchShortcut").click(() => {
            UI.hideMenu();
            $("#regioncheck").val($("#region").val());
            $("#gamemodecheck").val($("#gamemode").val());
            UI.showSearchHud();
            $("#searchInput").focus().select();
        });
        
        $("#searchShortcut").mouseenter(() => {
            $("#dropDown").hide();
            $("#dropDown3").show(100);
            $("#copySIPBtn").text("Copy");
        });
        
        // Leaderboard menu
        $("#copySIPBtn").mouseenter(() => {
            $("#dropDown3").hide();
            $("#copySIPBtn").text("Token");
            if ($("#clantag").val() !== "") {
                $("#dropDown2").show(100);
            } else {
                $("#dropDown").show(100);
            }
        });
        
        $("#leaderboard-menu").mouseleave(() => {
            $("#dropDown").hide();
            $("#dropDown2").hide();
            $("#dropDown3").hide();
            $("#copySIPBtn").text("Copy");
        });
        
        $("#reconnectBtn").click(() => {
            $("#server-reconnect").click();
        });
        
        $("#reconnectBtn").mouseenter(() => {
            $("#dropDown").hide();
            $("#dropDown2").hide();
            $("#copySIPBtn").text("Copy");
        });
        
        // Copy buttons
        $("#copyLBBtn").click(() => {
            Utils.copyToClipboard($("#leaderboard-positions").text());
        });
        
        $("#dropDown>#copyLBBtn").click(() => {
            Utils.copyToClipboard($("#leaderboard-positions").text());
        });
        
        $("#copySIPBtn").click(() => {
            const token = $("#server-token").val();
            const region = $("#region").val();
            const mode = $("#gamemode").val();
            
            let url;
            if (state.realmode === ":party") {
                url = `https://agar.io/#${token}`;
            } else if (region && mode) {
                url = document.URL.includes("jimboy3100.github.io") 
                    ? `https://jimboy3100.github.io/play?sip=${token}&?r=${region}&?m=${mode}`
                    : `https://agar.io?sip=${token}&?r=${region}&?m=${mode}`;
            } else {
                url = `https://agar.io?sip=${token}`;
            }
            
            state.CopyTkPwLb2 = url;
            Utils.copyToClipboard(url);
        });
        
        $("#copySIPandPass").click(() => {
            const token = $("#server-token").val();
            const pass = $("#clantag").val();
            const region = $("#region").val();
            const mode = $("#gamemode").val();
            
            let url;
            if (state.realmode === ":party") {
                url = `https://agar.io/#${token}&pass=${pass}`;
            } else if (region && mode) {
                url = document.URL.includes("jimboy3100.github.io")
                    ? `https://jimboy3100.github.io/play?sip=${token}&pass=${pass}&?r=${region}&?m=${mode}`
                    : `https://agar.io?sip=${token}&pass=${pass}&?r=${region}&?m=${mode}`;
            } else {
                url = `https://agar.io?sip=${token}&pass=${pass}`;
            }
            
            state.CopyTkPwLb2 = url;
            Utils.copyToClipboard(url);
        });
        
        $("#copySIPPassLB").click(() => {
            const token = $("#server-token").val();
            const pass = $("#clantag").val();
            const region = $("#region").val();
            const mode = $("#gamemode").val();
            
            let url;
            if (state.realmode === ":party") {
                url = `https://agar.io/#${token}&pass=${pass}`;
            } else if (region && mode) {
                url = document.URL.includes("jimboy3100.github.io")
                    ? `https://jimboy3100.github.io/play?sip=${token}&pass=${pass}&?r=${region}&?m=${mode}`
                    : `https://agar.io?sip=${token}&pass=${pass}&?r=${region}&?m=${mode}`;
            } else {
                url = `https://agar.io?sip=${token}&pass=${pass}`;
            }
            
            state.CopyTkPwLb2 = url;
            
            $("#CopyTkPwLb").remove();
            const teamboard = $("#top5-pos").text();
            const content = teamboard 
                ? `Server: ${url}<br>Leaderboard: ${$("#leaderboard-positions").text()}<br>Teamboard:${teamboard}<br>My Game Name: ${$("#nick").val()}`
                : `Server: ${url}<br>Leaderboard: ${$("#leaderboard-positions").text()}<br>My Game Name: ${$("#nick").val()}`;
            
            $("#server-join").after(`<er id="CopyTkPwLb" style="display: none;">${content}</er>`);
            Utils.copyToClipboard('er#CopyTkPwLb');
        });
        
        $("#lastIPBtn").click(() => {
            const lastIP = Storage.get("lastIP");
            if (lastIP && lastIP !== "") {
                $('#server-token').val(lastIP);
                $('#server-join').click();
                setTimeout(() => {
                    if ($('#server-token').val() !== lastIP) {
                        toastr.error("Server not available!").css("width", "210px");
                    }
                }, 1000);
            }
        });
        
        $("#checkServerBots").click(() => {
            UI.hideMenu();
            UI.showBotNameHud();
        });
        
        // Icon buttons
        for (let i = 1; i <= 6; i++) {
            $(`#sendicon${i}`).click(() => {
                if (window.application) {
                    window.application.sendChatMessage(101, `[img]${state[`pic${i}urlimg`]}[/img]`);
                }
            });
        }
        
        // YouTube buttons
        for (let i = 1; i <= 6; i++) {
            $(`#sendyt${i}`).click(() => {
                if (($("#clantag").val() !== "") || $("#nick").val().includes("?")) {
                    if (window.application) {
                        window.application.sendChatMessage(101, `[yt]${state[`yt${i}url`]}[/yt]`);
                    }
                } else {
                    toastr.info("Due to spamming issues, you must be in game and use password");
                }
            });
        }
        
        // Message command buttons
        const msgCommands = [
            "Hello", "Team5", "NamePerm", "dTroll2", "Youtube", "HideAll"
        ];
        msgCommands.forEach((cmd, i) => {
            $(`#msgcommand${i+1}`).click(() => {
                if (window.application?.lastSentClanTag === "" || $("#clantag").val() === "") {
                    toastr.warning("<b>[SERVER]:</b> Due to spamming issues, you must be in game and use password");
                } else {
                    if (window.application) {
                        window.application.sendChatMessage(101, 
                            `Legend.Mod&?player=${$("#nick").val()}&?com=${cmd}&?do=`);
                    }
                }
            });
        });
        
        // Mini scripts buttons
        $("#MiniScripts").click(() => {
            if (state.setscriptingcom === "YES") {
                $("#scripting-hud").show();
                state.setscriptingcom = "NO";
            } else {
                $("#scripting-hud").hide();
                state.setscriptingcom = "YES";
            }
        });
        
        $("#SendCommands").click(() => {
            if (state.setmessagecom === "YES") {
                $("#msgcommands-hud").show();
                state.setmessagecom = "NO";
            } else {
                $("#msgcommands-hud").hide();
                state.setmessagecom = "YES";
            }
        });
        
        $("#Images").click(() => {
            if (state.seticon === "YES") {
                $("#images-hud").show();
                state.seticon = "NO";
            } else {
                $("#images-hud").hide();
                state.seticon = "YES";
            }
        });
        
        $("#yout").click(() => {
            if (state.setyt === "YES") {
                $("#yt-hud").show();
                state.setyt = "NO";
            } else {
                $("#yt-hud").hide();
                state.setyt = "YES";
            }
        });
        
        $("#Cutnames").click(() => {
            if (state.checkedGameNames === 0) {
                // StartEditGameNames();
                state.checkedGameNames = 2;
            } else if (state.checkedGameNames === 1) {
                // ContinueEditGameNames();
                state.checkedGameNames = 2;
            } else if (state.checkedGameNames === 2) {
                // StopEditGameNames();
                state.checkedGameNames = 1;
            }
        });
        
        // Voice button
        $("#VoiceBtn").click(() => {
            const currentIP = $("#server-token").val();
            const pass = $("#clantag").val();
            const semiurl = pass !== "" ? `${currentIP}pass=${pass}` : currentIP;
            const url = `https://voicechat.example.com/${semiurl}`;
            setTimeout(() => $("#VoiceBtn").focusout(), 100);
            window.open(url, '_blank');
        });
        
        // Notes
        for (let i = 1; i <= 7; i++) {
            $(`#note${i}`).keyup((event) => {
                Storage.set(event.target.id, $(event.target).val());
            });
        }
        
        // Keyboard shortcuts
        $(document).keyup((event) => {
            if ($('input:focus').length === 0) {
                if (event.which === CONFIG.KEY_CODES.BACKSPACE) {
                    $("#searchShortcut").click();
                } else if (event.which === CONFIG.KEY_CODES.L) {
                    Utils.copyToClipboard($("#leaderboard-positions").text());
                }
            }
        });
        
        // Play button
        $('*[data-itr="page_play"]').click(() => {
            Storage.set("lastIP", $('#server-token').val());
        });
    }

    // ==========================================
    // INITIALIZATION FUNCTIONS
    // ==========================================
    
    function loadericon() {
        // Placeholder for loader icon
    }

    function findUserLang() {
        if (!window.navigator.languages) return;
        
        const languages = window.navigator.languages;
        for (let i = 0; i < languages.length; i++) {
            const lang = languages[i];
            if (lang !== "en" && !lang.includes('-')) {
                window.userLanguage = lang;
                return;
            }
        }
    }

    function init(modVersion) {
        if (!document.getElementById("message-box")) {
            setTimeout(() => init(modVersion), 200);
            console.log("ogario.js not loaded, waiting...");
            return;
        }
        return startLM(modVersion);
    }

    function startLM(modVersion) {
        if (state.LMstarted) return;
        
        state.LMstarted = true;
        state.LMVersion = modVersion;
        window.LMstarted = true;
        window.LMVersion = modVersion;
        
        if (modVersion !== "1.8") {
            toastr.info(`Mod <font color="yellow"><b>v${modVersion}</b></font> detected. Latest version: <font color="yellow"><b>v1.8</b></font>.<br>Visit: <a target="_blank" href="https://legendmod.com">legendmod.com</a>`);
        }
        
        return initializeLM(modVersion);
    }

    function initializeLM(modVersion) {
        try {
            // Check premium status
            PremiumUsers.checkFFAScore();
            PremiumUsers.check();
            
            // Initialize components
            YouTubePlayer.init();
            
            // Setup UI
            setupUI();
            setupEventListeners();
            
            // Load settings
            Settings.loadSettings();
            Settings.triggerLMbtns();
            
            // Update footer
            $("#menu-footer").text("");
            $("#menu-footer").prepend(`
                <span style="float: left; font-size: 13px;">
                    <a target="_blank" href="https://legendmod.com">LegendMod.com</a>
                </span>
                <span style="float: left; margin-left: 30%; font-size: 13px;">
                    <a href="https://support.legendmod.com" target="_blank">More FPS Guide</a>
                </span>
                <a style="float: right; margin-top: -2px" target="_blank" href="https://discord.gg/legendmod">
                    <img src="https://i.imgur.com/discord.png" style="height: 20px;">
                </a>
            `);
            
            // Hide initial UI elements
            $("#shortcuts-hud").hide();
            $("#exp-bar").hide();
            $("#time-hud").hide();
            $("#timertools-hud").hide();
            
            console.log(`Legend Mod v${modVersion} initialized successfully`);
            
        } catch (error) {
            console.error('Failed to initialize Legend Mod:', error);
        }
    }

    // ==========================================
    // HELPER FUNCTIONS (Connect To, etc.)
    // ==========================================
    
    function connectTo(server) {
        $('#server-token').val(server);
        $('#server-join').click();
        setTimeout(() => {
            if ($('#server-token').val() !== server) {
                toastr.error("Server not available!");
            }
        }, 1500);
    }

    function connectTo1a(server) {
        $('#server-ws').val(`wss://${server}.agar.io`);
        $('#server-connect').click();
        setTimeout(() => {
            if ($('#server-token').val() !== server) {
                toastr.error("Server not available!");
            }
        }, 1500);
    }

    function connectTo2(region) {
        $('#region').val(region);
    }

    function connectTo3(mode) {
        $("#gamemode").val(mode);
    }

    function play() {
        $('*[data-itr="page_play"]').click();
    }

    function changeServer() {
        $("#server-reconnect").click();
        UI.appendLog($("#leaderboard-positions").text());
    }

    function enableShortcuts() {
        if ($("#SHOSHOBtn").attr('aria-pressed') === "false") {
            $("#SHOSHOBtn").click();
        }
        if ($("#MAINBTBtn").attr('aria-pressed') === "false") {
            $("#MAINBTBtn").click();
        }
        if ($("#XPBtn").attr('aria-pressed') === "false") {
            $("#XPBtn").click();
        }
    }

    // ==========================================
    // EXPOSE PUBLIC API
    // ==========================================
    
    window.LegendMod = {
        // Modules
        Utils,
        Storage,
        Network,
        UI,
        TimerLM,
        YouTubePlayer,
        SearchModule,
        MessageCommands,
        PremiumUsers,
        Settings,
        
        // Functions
        init,
        startLM,
        initializeLM,
        connectTo,
        connectTo1a,
        connectTo2,
        connectTo3,
        play,
        changeServer,
        enableShortcuts,
        loadericon,
        findUserLang,
        
        // State (read-only)
        getState: () => ({ ...state }),
        
        // Version
        version: CONFIG.SEMIMOD_VERSION
    };

    // ==========================================
    // AUTO-START
    // ==========================================
    
    loadericon();
    Network.getAccessToken();
    findUserLang();
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    state.url = window.location.href;
    state.region = Utils.getParameterByName("r", state.url);
    state.realmode = Utils.getParameterByName("m", state.url);
    state.realmodePS = state.realmode;
    state.searchStr = Utils.getParameterByName("search", state.url);
    state.searchSip = Utils.getParameterByName("sip", state.url);
    state.clanpass = Utils.getParameterByName("pass", state.url);
    state.searchedplayer = Utils.getParameterByName("player", state.url);
    state.autoplayplayer = Utils.getParameterByName("autoplayer", state.url);
    state.replayURL = Utils.getParameterByName("replay", state.url);
    state.replayStart = Utils.getParameterByName("replayStart", state.url);
    state.replayEnd = Utils.getParameterByName("replayEnd", state.url);
    
    // Initialize when document is ready
    if (document.URL.includes('jimboy3100.github.io')) {
        if (location.protocol !== 'https:') {
            toastr.warning("Legend mod over http. Many functions cannot work properly. To join Non SSL servers use ws://");
        }
        
        setTimeout(() => {
            const modVersion = "1.8";
            init(modVersion);
        }, 100);
    } else {
        // Standard initialization
        setTimeout(() => {
            const modVersion = "1.8";
            init(modVersion);
        }, 100);
    }


})();
