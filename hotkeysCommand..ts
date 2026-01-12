// v1.3j - Updated for TypeScript (2026)

// 1. Define Types for the application and globals
interface HotkeyConfig {
    label: string;
    defaultKey: string;
    keyDown: () => void;s
    keyUp?: (() => void) | null;
    type: 'normal' | 'special' | 'command';
}

// Extend the Window interface for global variables used in the script
declare global {
    interface Window {
        followStraight: boolean;
        userBots: {
            startedBots: boolean;
            isAlive: boolean;
        };
        connectionBots: {
            send: (data: ArrayBuffer) => void;
        };
        // Assuming legendmod is a global object
        legendmod: {
            ws: string;
        };
    }
}

// Mocking external dependencies for compilation safety
// In your real project, these should be imported or declared in a .d.ts file
declare const textLanguage: Record<string, string>;
declare const chatCommand: Record<string, string>;
declare const application: any; // Replace 'any' with the actual Application class type if available
declare const $: any; // jQuery type definition

// 2. Variable Declarations
let keyBlind: Record<string, any> = {};
let hotkeys: Record<string, any> = {};

// 3. Command Generator Helper (To avoid writing lines 1-50 manually)
const generateCommKeys = (): Record<string, HotkeyConfig> => {
    const commKeys: Record<string, HotkeyConfig> = {};
    const controlMap: Record<number, string> = {
        15: 'CTRL+1', 16: 'CTRL+2', 17: 'CTRL+3', 18: 'CTRL+4', 19: 'CTRL+5',
        20: 'CTRL+7', 21: 'CTRL+8', 22: 'CTRL+9', 23: 'CTRL+0',
        24: 'CTRL+Z', 25: 'CTRL+X', 26: 'CTRL+Q', 27: 'CTRL+M',
        28: 'CTRL+B', 29: 'CTRL+L', 30: 'CTRL+D'
    };
    
    // Standard keys 0-9
    for (let i = 0; i <= 9; i++) {
        commKeys[`hk-comm${i}`] = {
            label: chatCommand[`comm${i}`],
            defaultKey: i.toString(),
            keyDown: () => application?.sendCommand(i),
            keyUp: null,
            type: 'command'
        };
    }

    // Special mapping keys (10-50)
    for (let i = 10; i <= 50; i++) {
        let defKey = '';
        if (i === 10) defKey = 'MOUSE WHEEL';
        else if (i === 11) defKey = 'LEFT';
        else if (i === 12) defKey = 'UP';
        else if (i === 13) defKey = 'RIGHT';
        else if (i === 14) defKey = 'DOWN';
        else if (controlMap[i]) defKey = controlMap[i];

        commKeys[`hk-comm${i}`] = {
            label: chatCommand[`comm${i}`],
            defaultKey: defKey,
            keyDown: () => application?.sendCommand(i),
            keyUp: null,
            type: 'command'
        };
    }
    return commKeys;
};

// 4. Main Configuration Object
const hotkeysCommand: Record<string, HotkeyConfig> = {
    'hk-feed': {
        label: textLanguage['hk-feed'],
        defaultKey: 'W',
        keyDown() {
            application?.feed();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-macroFeed': {
        label: textLanguage['hk-macroFeed'],
        defaultKey: 'E',
        keyDown() {
            application?.macroFeed(true);
        },
        keyUp() {
            application?.macroFeed(false);
        },
        type: 'normal'
    },
    'hk-macroFeedPerm': {
        label: textLanguage['hk-macroFeedPerm'],
        defaultKey: 'CTRL+E',
        keyDown() {
            application?.macroFeedPerm(true);
        },
        type: 'normal'
    },
    'hk-split': {
        label: textLanguage['hk-split'],
        defaultKey: 'SPACE',
        keyDown() {
            application?.split();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-doubleSplit': {
        label: textLanguage['hk-doubleSplit'],
        defaultKey: 'Q',
        keyDown() {
            application?.doubleSplit();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-tripleSplit': {
        label: textLanguage['hk-tripleSplit'],
        defaultKey: '',
        keyDown() {
            application?.tripleSplit();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-popSplit': {
        label: 'Popsplit',
        defaultKey: 'ALT+Q',
        keyDown() {
            application?.popSplit();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-split16': {
        label: textLanguage['hk-split16'],
        defaultKey: 'SHIFT',
        keyDown() {
            application?.split16();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-crazyDoubleSplit': {
        label: textLanguage['hk-crazyDoubleSplit'],
        defaultKey: '',
        keyDown() {
            application?.crazyDoubleSplit();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-pause': {
        label: textLanguage['hk-pause'],
        defaultKey: 'R',
        keyDown() {
            application?.setPause();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-dance': {
        label: textLanguage['hk-dance'],
        defaultKey: 'ALT+R',
        keyDown() {
            application?.dance(true);
        },
        keyUp() {
            application?.dance(false);
        },
        type: 'normal'
    },
    'hk-limitposition': {
        label: textLanguage['hk-limitposition'],
        defaultKey: '',
        keyDown() {
            window.followStraight = true;
        },
        keyUp() {
            window.followStraight = false;
        },
        type: 'normal'
    },
    'hk-multiboxswap': {
        label: textLanguage['hk-multiboxswap'],
        defaultKey: 'TAB',
        keyDown() {
            application?.multiboxswap();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-multiboxFollowMouse': {
        label: textLanguage['hk-multiboxFollowMouse'],
        defaultKey: 'TILDE',
        keyDown() {
            application?.multiboxFollowMouse();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showTop5': {
        label: textLanguage['hk-showTop5'],
        defaultKey: 'T',
        keyDown() {
            application?.setShowTop5();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showTime': {
        label: textLanguage['hk-showTime'],
        defaultKey: 'ALT+T',
        keyDown() {
            application?.setShowTime();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showSplitRange': {
        label: textLanguage['hk-showSplitRange'],
        defaultKey: 'U',
        keyDown() {
            application?.setShowSplitRange();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showSplitInd': {
        label: textLanguage['hk-showSplitInd'],
        defaultKey: 'I',
        keyDown() {
            application?.setShowSplitInd();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showTeammatesInd': {
        label: textLanguage['hk-showTeammatesInd'],
        defaultKey: 'ALT+I',
        keyDown() {
            application?.setShowTeammatesInd();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showOppColors': {
        label: textLanguage['hk-showOppColors'],
        defaultKey: 'O',
        keyDown() {
            application?.setShowOppColors();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-toggleSkins': {
        label: textLanguage['hk-toggleSkins'],
        defaultKey: 'A',
        keyDown() {
            application?.toggleSkins();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-transparentSkins': {
        label: textLanguage['hk-transparentSkins'],
        defaultKey: '',
        keyDown() {
            application?.setTransparentSkins();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showSkins': {
        label: textLanguage['hk-showSkins'],
        defaultKey: 'S',
        keyDown() {
            application?.setShowSkins();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showStats': {
        label: textLanguage['hk-showStats'],
        defaultKey: 'ALT+S',
        keyDown() {
            application?.setShowStats();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-toggleCells': {
        label: textLanguage['hk-toggleCells'],
        defaultKey: 'D',
        keyDown() {
            application?.toggleCells();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showFood': {
        label: textLanguage['hk-showFood'],
        defaultKey: 'F',
        keyDown() {
            application?.setShowFood();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showGrid': {
        label: textLanguage['hk-showGrid'],
        defaultKey: 'G',
        keyDown() {
            application?.setShowGrid();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showMiniMapGuides': {
        label: textLanguage['hk-showMiniMapGuides'],
        defaultKey: 'ALT+G',
        keyDown() {
            application?.setShowMiniMapGuides();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-hideChat': {
        label: textLanguage['hk-hideChat'],
        defaultKey: 'H',
        keyDown() {
            application?.hideChat();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showHUD': {
        label: textLanguage['hk-showHUD'],
        defaultKey: 'ALT+H',
        keyDown() {
            application?.setShowHUD();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-copyLb': {
        label: textLanguage['hk-copyLb'],
        defaultKey: 'L',
        keyDown() {
            application?.copyLb();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showLb': {
        label: textLanguage['hk-showLb'],
        defaultKey: 'ALT+L',
        keyDown() {
            application?.setShowLb();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-toggleAutoZoom': {
        label: textLanguage['hk-toggleAutoZoom'],
        defaultKey: '',
        keyDown() {
            application?.toggleAutoZoom();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-resetZoom': {
        label: textLanguage['hk-resetZoom'],
        defaultKey: 'Z',
        keyDown() {
            application?.resetZoom(true);
        },
        keyUp() {
            application?.resetZoom(false);
        },
        type: 'normal'
    },
    'hk-toggleDeath': {
        label: textLanguage['hk-toggleDeath'],
        defaultKey: 'X',
        keyDown() {
            application?.toggleDeath();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-clearChat': {
        label: textLanguage['hk-clearChat'],
        defaultKey: 'C',
        keyDown() {
            application?.displayChatHistory(true);
        },
        keyUp() {
            application?.displayChatHistory(false);
        },
        type: 'normal'
    },
    'hk-showBgSectors': {
        label: textLanguage['hk-showBgSectors'],
        defaultKey: 'B',
        keyDown() {
            application?.setShowBgSectors();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-hideBots': {
        label: textLanguage['hk-hideBots'],
        defaultKey: 'ALT+B',
        keyDown() {
            application?.setHideSmallBots();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showNames': {
        label: textLanguage['hk-showNames'],
        defaultKey: 'N',
        keyDown() {
            application?.setShowNames();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-hideTeammatesNames': {
        label: textLanguage['hk-hideTeammatesNames'],
        defaultKey: '',
        keyDown() {
            application?.setHideTeammatesNames();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showMass': {
        label: textLanguage['hk-showMass'],
        defaultKey: 'M',
        keyDown() {
            application?.setShowMass();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showMiniMap': {
        label: textLanguage['hk-showMiniMap'],
        defaultKey: 'ALT+M',
        keyDown() {
            application?.setShowMiniMap();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-chatMessage': {
        label: textLanguage['hk-chatMessage'],
        defaultKey: 'ENTER',
        keyDown() {
            application?.enterChatMessage();
        },
        keyUp: null,
        type: 'special'
    },
    'hk-quickResp': {
        label: textLanguage['hk-quickResp'],
        defaultKey: 'Y',
        keyDown() {
            application?.quickResp();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-autoResp': {
        label: textLanguage['hk-autoResp'],
        defaultKey: '',
        keyDown() {
            application?.toggleAutoResp();
        },
        keyUp: null,
        type: 'normal'
    },
    // Dynamically generated zoom keys could be used here, but kept manual for fidelity
    'hk-zoom1': {
        label: `${textLanguage['hk-zoomLevel']} 1`,
        defaultKey: 'ALT+1',
        keyDown: () => application?.setZoom(0.5),
        keyUp: null,
        type: 'normal'
    },
    'hk-zoom2': {
        label: `${textLanguage['hk-zoomLevel']} 2`,
        defaultKey: 'ALT+2',
        keyDown: () => application?.setZoom(0.25),
        keyUp: null,
        type: 'normal'
    },
    'hk-zoom3': {
        label: `${textLanguage['hk-zoomLevel']} 3`,
        defaultKey: 'ALT+3',
        keyDown: () => application?.setZoom(0.125),
        keyUp: null,
        type: 'normal'
    },
    'hk-zoom4': {
        label: `${textLanguage['hk-zoomLevel']} 4`,
        defaultKey: 'ALT+4',
        keyDown: () => application?.setZoom(0.075),
        keyUp: null,
        type: 'normal'
    },
    'hk-zoom5': {
        label: `${textLanguage['hk-zoomLevel']} 5`,
        defaultKey: 'ALT+5',
        keyDown: () => application?.setZoom(0.05),
        keyUp: null,
        type: 'normal'
    },
    'hk-voiceChat': {
        label: textLanguage['hk-voiceChat'],
        defaultKey: '=',
        keyDown() {
            // application?.enterChatMessage();
            // if ($('#message-box').css('display') == 'block') {
            $('.voice-start.icon-mic').click();
            // }
        },
        keyUp: null,
        type: 'special'
    },
    'hk-GhostCellsInfo': {
        label: textLanguage['hk-GhostCellsInfo'],
        defaultKey: 'K',
        keyDown() {
            application?.setShowGhostCellsInfo();
        },
        keyUp: null,
        type: 'special'
    },
    'hk-Autoplay': {
        label: textLanguage['hk-Autoplay'],
        defaultKey: 'J',
        keyDown() {
            application?.setAutoPlay();
        },
        keyUp: null,
        type: 'special'
    },
    'hk-switchServerMode': {
        label: textLanguage['hk-switchServerMode'],
        defaultKey: '-',
        keyDown() {
            application?.switchServerMode();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showTargeting': {
        label: textLanguage['hk-showTargeting'],
        defaultKey: '',
        keyDown() {
            application?.setShowTargeting();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-setTargeting': {
        label: textLanguage['hk-setTargeting'],
        defaultKey: '',
        keyDown() {
            application?.setTargeting();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-cancelTargeting': {
        label: textLanguage['hk-cancelTargeting'],
        defaultKey: '',
        keyDown() {
            application?.cancelTargeting();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-changeTarget': {
        label: textLanguage['hk-changeTarget'],
        defaultKey: '',
        keyDown() {
            application?.changeTarget();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-privateMiniMap': {
        label: textLanguage['hk-privateMiniMap'],
        defaultKey: '',
        keyDown() {
            application?.setPrivateMiniMap();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showQuest': {
        label: textLanguage['hk-showQuest'],
        defaultKey: '',
        keyDown() {
            application?.setShowQuest();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showSpectator': {
        label: textLanguage['hk-showSpectator'],
        defaultKey: 'V',
        keyDown() {
            application?.setShowFullSpectator();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showIngameSpectator': {
        label: textLanguage['hk-showIngameSpectator'],
        defaultKey: '',
        keyDown() {
            application?.setShowIngameSpectator();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-bots-macrofeed': {
        label: textLanguage['hk-bots-macrofeed'],
        defaultKey: '',
        keyDown() {
            // if (window.userBots.startedBots && window.userBots.isAlive) window.connectionBots.send(new Uint8Array([3]).buffer)
            if (window.legendmod?.ws?.includes("imsolo.pro") && application) {
                application.macrobotFeed(true);
                // application.Botseject();
            }
        },
        keyUp() {
            if (window.legendmod?.ws?.includes("imsolo.pro") && application) {
                application.macrobotFeed(false);
            }
        },
        type: 'normal'
    },
    'hk-bots-feed': {
        label: textLanguage['hk-bots-feed'],
        defaultKey: 'L',
        keyDown() {
            if (window.userBots?.startedBots && window.userBots?.isAlive) {
                window.connectionBots.send(new Uint8Array([3]).buffer);
            } else if (window.legendmod?.ws?.includes("imsolo.pro") && application) {
                application.Botseject();
            }
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-bots-split': {
        label: textLanguage['hk-bots-split'],
        defaultKey: 'M',
        keyDown() {
            if (window.userBots?.startedBots && window.userBots?.isAlive) {
                window.connectionBots.send(new Uint8Array([2]).buffer);
            } else if (window.legendmod?.ws?.includes("imsolo.pro") && application) {
                application.Botsplit();
            }
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-doubleBotSplit': {
        label: textLanguage['hk-doubleBotSplit'],
        defaultKey: '',
        keyDown() {
            if (window.legendmod?.ws?.includes("imsolo.pro") && application) {
                application.doubleBotSplit();
            }
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-popBotSplit': {
        label: 'Bots Popsplit (Private servers)',
        defaultKey: '',
        keyDown() {
            if (window.legendmod?.ws?.includes("imsolo.pro") && application) {
                application.popBotSplit();
            }
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-splitBot16': {
        label: textLanguage['hk-splitBot16'],
        defaultKey: '',
        keyDown() {
            if (window.legendmod?.ws?.includes("imsolo.pro") && application) {
                application.splitBot16();
            }
        },
        keyUp: null,
        type: 'normal'
    },
'hk-comm17': {
                label: chatCommand['comm17'],
                defaultKey: 'CTRL+3',
                keyDown() {
                    application && application.sendCommand(17);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm18': {
                label: chatCommand['comm18'],
                defaultKey: 'CTRL+4',
                keyDown() {
                    application && application.sendCommand(18);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm19': {
                label: chatCommand['comm19'],
                defaultKey: 'CTRL+5',
                keyDown() {
                    application && application.sendCommand(19);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm20': {
                label: chatCommand['comm20'],
                defaultKey: 'CTRL+7',
                keyDown() {
                    application && application.sendCommand(20);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm21': {
                label: chatCommand['comm21'],
                defaultKey: 'CTRL+8',
                keyDown() {
                    application && application.sendCommand(21);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm22': {
                label: chatCommand['comm22'],
                defaultKey: 'CTRL+9',
                keyDown() {
                    application && application.sendCommand(22);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm23': {
                label: chatCommand['comm23'],
                defaultKey: 'CTRL+0',
                keyDown() {
                    application && application.sendCommand(23);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm24': {
                label: chatCommand['comm24'],
                defaultKey: 'CTRL+Z',
                keyDown() {
                    application && application.sendCommand(24);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm25': {
                label: chatCommand['comm25'],
                defaultKey: 'CTRL+X',
                keyDown() {
                    application && application.sendCommand(25);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm26': {
                label: chatCommand['comm26'],
                defaultKey: 'CTRL+Q',
                keyDown() {
                    application && application.sendCommand(26);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm27': {
                label: chatCommand['comm27'],
                defaultKey: 'CTRL+M',
                keyDown() {
                    application && application.sendCommand(27);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm28': {
                label: chatCommand['comm28'],
                defaultKey: 'CTRL+B',
                keyDown() {
                    application && application.sendCommand(28);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm29': {
                label: chatCommand['comm29'],
                defaultKey: 'CTRL+L',
                keyDown() {
                    application && application.sendCommand(29);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm30': {
                label: chatCommand['comm30'],
                defaultKey: 'CTRL+D',
                keyDown() {
                    application && application.sendCommand(30);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm31': {
                label: chatCommand['comm31'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(31);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm32': {
                label: chatCommand['comm32'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(32);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm33': {
                label: chatCommand['comm33'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(33);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm34': {
                label: chatCommand['comm34'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(34);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm35': {
                label: chatCommand['comm35'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(35);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm36': {
                label: chatCommand['comm36'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(36);
                },
                keyUp: null,
                type: 'command'
            },
            'hk-comm37': {
                label: chatCommand['comm37'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(37);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm38': {
                label: chatCommand['comm38'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(38);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm39': {
                label: chatCommand['comm39'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(39);
                },
                keyUp: null,
                type: 'command'
            },		
            'hk-comm40': {
                label: chatCommand['comm40'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(40);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm41': {
                label: chatCommand['comm41'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(41);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm42': {
                label: chatCommand['comm42'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(42);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm43': {
                label: chatCommand['comm43'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(43);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm44': {
                label: chatCommand['comm44'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(44);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm45': {
                label: chatCommand['comm45'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(45);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm46': {
                label: chatCommand['comm46'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(46);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm47': {
                label: chatCommand['comm47'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(47);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm48': {
                label: chatCommand['comm48'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(48);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm49': {
                label: chatCommand['comm49'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(49);
                },
                keyUp: null,
                type: 'command'
            },	
            'hk-comm50': {
                label: chatCommand['comm50'],
                defaultKey: '',
                keyDown() {
                    application && application.sendCommand(50);
                },
                keyUp: null,
                type: 'command'
            }			
        }
    ...generateCommKeys()
};