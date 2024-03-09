import {file_map, GetCurrentTime, lerp, PickRandomProperty} from "./lib.js";

const DATA = {
    need: 0,
    downloaded: 0,
    changeExtTime: 0,
};

const event_order = [
    '@GameDetails',
    '@SetFilesNeeded',
    '@SetFilesTotal',
    '1/171 (0 B) - Fetching info about workshop addons...',
    '@SetFilesNeeded',
    '@SetFilesTotal',
    '1/171 (826.9 MB) - Loading \'[TTT] Boomerang\'',
    'Mounting Addons',
    'Workshop Complete',
    'Sending client info...',
    'Client info sent!',
    'Requesting 3 Lua files from the server...',
]

const str_random_v2 = function (length) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    if (!length) {
        length = 12;
    }

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};

export function IsGmod() {
    return navigator.userAgent.toLowerCase().indexOf('valve') !== -1;
}

export function WrapGmodEvents() {
    window.GameDetails = function (servername, serverurl, mapname, maxplayers, steamid, gamemode, volume, language) {
        document.dispatchEvent(new CustomEvent('GameDetails', {
            detail: {
                servername: servername,
                serverurl: serverurl,
                mapname: mapname,
                maxplayers: maxplayers,
                steamid: steamid,
                gamemode: gamemode,
                volume: volume,
                language: language
            }
        }));
    };

    window.SetFilesTotal = function (total) {
        document.dispatchEvent(new CustomEvent('SetFilesTotal', {
            detail: {
                total: total
            }
        }));
    };

    window.SetFilesNeeded = function (needed) {
        document.dispatchEvent(new CustomEvent('SetFilesNeeded', {
            detail: {
                needed: needed
            }
        }));
    };

    window.DownloadingFile = function (fileName) {
        document.dispatchEvent(new CustomEvent('DownloadingFile', {
            detail: {
                fileName: fileName
            }
        }));
    };

    window.SetStatusChanged = function (status) {
        document.dispatchEvent(new CustomEvent('SetStatusChanged', {
            detail: {
                status: status
            }
        }));
    };
}

export function SimulateDownload() {
    SetFilesNeeded(Math.floor(Math.random() * 150) + 75);
    GameDetails('gmodload', window.location.href, 'gm_construct', 24, '76561197960287930', 'sandbox', Math.floor(Math.random() * 100) + 1, 'en', 'Sandbox');

    DATA.loop = setInterval(function () {
        if (DATA.downloaded >= DATA.needed) {
            DATA.downloaded = 0;
        }

        // const nextTime = 0.05 + Math.random() * 700;

        const extension = PickRandomProperty(file_map);

        let time = GetCurrentTime();
        if (DATA.changeExtTime < time) {
            DATA.changeExtTime = time + (lerp(Math.random(), 700, 1400) / 10000);
            DownloadingFile('example/folder/file-' + str_random_v2() + '.' + extension);
        }


        /*
                if (CONFIG.FLOATING_ICONS) {

        }
        if (CONFIG.ICONS_BOX)
            FileListing("." + extension);
        if (CONFIG.ICONS_BOX || CONFIG.FLOATING_ICONS)
            UpdateText("Downloading file " + FilesNeeded + "...")

        FilesNeeded--;
        RefreshFileBox();
         */
    }, 125);

}