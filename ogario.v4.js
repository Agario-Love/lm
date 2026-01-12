Here's the converted JavaScript code:

```javascript
window.OgVer = 3.334;
window.tempH = 6;
var consoleMsgLM = "[Client] ";
window.clanTagLc = "ZZX";
appendLMhiFbPs();
window.externalScriptMassBar = [];
window.capthaWindow = [];
window.RecordedProtocol = [];
window.RecordedProtocolArenas = [];
window.RecordedArenasSpecifications = [];
window.catholicCalculator = 0;
window.replayTiming = 20;
window.replayTimeOuts = [];
window.replaySkippedLoops = 100;
window.renderDelay = 0;
window.chatLimit = 15;
window.LMscore = 0;
var isMobile = false;
if (jQuery && jQuery.browser && jQuery.browser.mobile) isMobile = true;

$(function() {
    $('head').append('<meta name="referrer" content="no-referrer">');
});

var ranges = [10, 255, 255, 255, 255];

function toLong(ip) {
    var result = 0;
    for (var i = 0; i < ip.length; i++) {
        var value = ip[i];
        var temp = 1;
        for (var j = 0; j < i; j++) temp *= ranges[j] + 2;
        result += Math.floor((value / ranges[i]) * (ranges[i] + 1) + 0.5) * temp;
    }
    return result;
}

function fromLong(packed) {
    var arr = new Array(ranges.length).fill(0);
    for (var i = ranges.length; i--; ) {
        var divisor = 1;
        for (var j = 0; j < i; j++) divisor *= ranges[j] + 2;
        var value = Math.floor(packed / divisor);
        packed -= value * divisor;
        arr[i] = Math.round((value / (ranges[i] + 1)) * ranges[i]);
    }
    return arr;
}

var awsRegions = [
    'us-east-1',
    'sa-east-1',
    'eu-west-2',
    'eu-central-1',
    'ap-northeast-1',
    'ap-southeast-1',
    'us-east-2',
    'us-west-1',
    'us-west-2',
    'af-south-1',
    'ap-east-1',
    'ap-south-2',
    'ap-southeast-3',
    'ap-southeast-4',
    'ap-south-1',
    'ap-northeast-3',
    'ap-northeast-2',
    'ap-southeast-2',
    'ca-central-1',
    'ca-west-1',
    'eu-west-1',
    'eu-south-1',
    'eu-west-3',
    'eu-south-2',
    'eu-north-1',
    'eu-central-2',
    'il-central-1',
    'me-south-1',
    'me-central-1'
];

function changeregion() {
    if ($('#region').val() === "Private") {
        deleteGamemode(true);
    } else {
        if (window.gamemodeBackup) {
            $('#gamemode').empty();
            $("#gamemode").append(window.gamemodeBackup);
            window.gamemodeBackup = null;
            $('#gamemode option[value=":ffa"]').prop('selected', 'selected').change();
        }
        master.setRegion($('#region').val());
    }
}

function deleteGamemode(temp) {
    var privateModOptions = [
        {
            text: 'Delta FFA',
            value: 4001
        },
        {
            text: 'FeelForeverAlone',
            value: 34
        }, {
            text: 'Arctida',
            value: 6
        }, {
            text: 'Dagestan',
            value: 7
        }, {
            text: 'Zimbabwe',
            value: 31
        }, {
            text: 'Antarctic',
            value: 35
        },
        {
            text: 'Party MegaSplit',
            value: 19
        }, {
            text: 'Party Mode',
            value: 20
        }, {
            text: 'EatCells FFA 1',
            value: 21
        }, {
            text: 'EatCells FFA 2',
            value: 22
        }, {
            text: '1vs1 FFA #1',
            value: 23
        }, {
            text: '1vs1 FFA #2',
            value: 24
        }, {
            text: '1vs1 FFA #3',
            value: 25
        }, {
            text: '1vs1 EXP #1',
            value: 26
        }, {
            text: '1vs1 EXP #2',
            value: 27
        }, {
            text: '1vs1 EXP #3',
            value: 28
        }, {
            text: '2vs2',
            value: 29
        }, {
            text: '2vs2vs2',
            value: 30
        }, {
            text: 'Beta Party #1',
            value: 14
        }, {
            text: 'Beta Party v2 #1',
            value: 17
        }, {
            text: 'Beta Party v2 #2',
            value: 18
        }, {
            text: 'Bots',
            value: 33
        }, {
            text: 'MK Oceania',
            value: 37
        }, {
            text: 'MK Teams',
            value: 38
        }, {
            text: 'MK Bots WIP',
            value: 39
        },
        {
            text: 'FPS Test',
            value: 12
        }
    ];

    if (location.protocol !== 'https:') {
        privateModOptions.unshift({
            text: 'agarios.org NA',
            value: 103
        });
        privateModOptions.unshift({
            text: 'M16 Korea',
            value: 102
        });
    }

    if (!window.gamemodeBackup) {
        window.gamemodeBackup = $("#gamemode").html();
    }
    $('#gamemode').empty();
    $.each(privateModOptions, function(i, el) {
        $('#gamemode').append(new Option(el.text, el.value));
    });
    $('#gamemode').change(function() {
        if ($('#region').val() == "Private") {
        } else {}
        if ($('#gamemode').val() == 6) {
            core.connect('wss:');
        } else if ($('#gamemode').val() == 7) {
            core.connect('wss:');
        } else if ($('#gamemode').val() == 12) {
            // Connection logic would continue here
        }
    });
}
```