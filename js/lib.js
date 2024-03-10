export const file_map = {
    png: "picture.png",
    vtf: "picture.png",
    vmt: "page_white_picture.png",

    wav: "sound.png",
    mp3: "sound.png",
    ogg: "sound.png",

    lua: "script_code.png",

    txt: "page_white_text.png",
    htm: "page_white_world.png",
    tml: "page_white_world.png", // html

    bsp: "world.png",
    ain: "world_add.png",

    ttf: "font.png",
    otf: "font.png",

    mdl: "brick.png",
    vvd: "brick_add.png",
    vtx: "brick_add.png",
    phy: "brick_add.png",

    db: "database.png",

    wlo: "package.png", // Fake extension for Workshop Loading
    wle: "package_go.png", // Fake extension for Workshop Extracting
    wdo: "package_add.png", // Fake extension for Workshop Downloading

    generic: "bug.png",

    dbg: "bug.png", // Debug
};

function rotate_left(n, s) {
    return (n << s) | (n >>> (32 - s));
}

function SHA1(msg) {
    const W = new Array(80),
        H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];
    let block_start, i, j, G = [], temp, utf_text = "";
    msg = msg.replace(/\r\n/g, "\n");

    for (let n = 0; n < msg.length; n++) {
        const c = msg.charCodeAt(n);

        if (c < 128) {
            utf_text += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
            utf_text += String.fromCharCode((c >> 6) | 192);
            utf_text += String.fromCharCode((c & 63) | 128);
        } else {
            utf_text += String.fromCharCode((c >> 12) | 224);
            utf_text += String.fromCharCode(((c >> 6) & 63) | 128);
            utf_text += String.fromCharCode((c & 63) | 128);
        }
    }
    msg = utf_text;

    const word_array = [];
    for (i = 0; i < msg.length - 3; i += 4) {
        j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 | msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
        word_array.push(j);
    }

    switch (msg.length % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = msg.charCodeAt(msg.length - 1) << 24 | 0x0800000;
            break;

        case 2:
            i = msg.charCodeAt(msg.length - 2) << 24 | msg.charCodeAt(msg.length - 1) << 16 | 0x08000;
            break;

        case 3:
            i = msg.charCodeAt(msg.length - 3) << 24 | msg.charCodeAt(msg.length - 2) << 16 | msg.charCodeAt(msg.length - 1) << 8 | 0x80;
            break;
    }

    word_array.push(i);

    while ((word_array.length % 16) !== 14) word_array.push(0);

    word_array.push(msg.length >>> 29);
    word_array.push((msg.length << 3) & 0x0ffffffff);


    for (block_start = 0; block_start < word_array.length; block_start += 16) {
        for (i = 0; i < 16; i++) W[i] = word_array[block_start + i];
        for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

        G = [...H];

        for (i = 0; i <= 79; i++) {
            if (i >= 0 && i <= 19 ) {
                temp = (rotate_left(G[0], 5) + ((G[1] & G[2]) | (~G[1] & G[3])) + G[4] + W[i] + 0x5A827999) & 0x0ffffffff;
            }
            if (i >= 20 && i <= 39 ) {
                temp = (rotate_left(G[0], 5) + (G[1] ^ G[2] ^ G[3]) + G[4] + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            }
            if (i >= 40 && i <= 59 ) {
                temp = (rotate_left(G[0], 5) + ((G[1] & G[2]) | (G[1] & G[3]) | (G[2] & G[3])) + G[4] + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            }
            if (i >= 60 || i <= 79) {
                temp = (rotate_left(G[0], 5) + (G[1] ^ G[2] ^ G[3]) + G[4] + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            }
            G[4] = G[3];
            G[3] = G[2];
            G[2] = rotate_left(G[1], 30);
            G[1] = G[0];
            G[0] = temp;
        }

        H[0] = (H[0] + G[0]) & 0x0ffffffff;
        H[1] = (H[1] + G[1]) & 0x0ffffffff;
        H[2] = (H[2] + G[2]) & 0x0ffffffff;
        H[3] = (H[3] + G[3]) & 0x0ffffffff;
        H[4] = (H[4] + G[4]) & 0x0ffffffff;
    }

    for (let k = 0; k < H.length; k++) {
        let str = "", i, v;
        for (i = 7; i >= 0; i--) {
            v = (H[k] >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        temp += str;
    }
    temp = temp.toLowerCase();
    if ( temp.charAt(0) === '-' ) temp = temp.substring(1);
    return temp;
}

export function FromHTML(html, trim = true) {
    // Process the HTML string.
    html = trim ? html.trim() : html;
    if (!html) return null;

    // Then set up a new template element.
    const template = document.createElement('template');
    template.innerHTML = html;
    // Then return either an HTMLElement or HTMLCollection,
    // based on whether the input HTML had one or more roots.
    // if (result.length === 1) return result[0];
    return template.content.children;
}


export function PickRandomProperty(obj) {
    let result;
    let count = 0;
    for (const prop in obj) {
        if (Math.random() < 1 / ++count) {
            result = prop;
        }
    }
    if (result === "dbg") {
        result = "generic";
    }
    return result;
}

/**
 *
 * @param str
 */
export function ParseStatusString(str) {
    let statusObject = {};
    let workshop = str.match(/(\d+)\/(\d+) \(([\d.]+) (\S+)\) - (.*)/)
    if (workshop) {
        statusObject.type = "workshop";
        statusObject.currentWorkshopFile = workshop[1];
        statusObject.totalWorkshopFiles = workshop[2];
        statusObject.size = workshop[3];
        statusObject.sizeUnits = workshop[4];
        statusObject.status = workshop[5];

        let workshopStatus = statusObject.status.match(/((Loading|Extracting) '(.*(?=')|.*)'?|.*)/)
        if (workshopStatus) {
            statusObject.workshopState = workshopStatus[2];
            statusObject.workshopName = workshopStatus[3];
        }

        return statusObject;
    }

    let luaDownload = str.match(/Downloaded (\d+) of (\d+) Lua files/)
    if (luaDownload) {
        statusObject.type = "luaDownload";
        statusObject.currentLuaFile = luaDownload[1];
        statusObject.totalLuaFile = luaDownload[2];
        statusObject.fakeLuaFileName = `${SHA1(luaDownload[1])}.lua`;

        return statusObject;
    }

    return null;
}

// 'Mounting Addons',
// 'Workshop Complete',
// 'Sending client info...',
// 'Client info sent!',
// 'Requesting 3 Lua files from the server...',
// 'Downloaded 1 of 694 Lua files',
// 'Received all Lua files we needed!',
// 'Starting Lua...',
// 'Lua Started!',
// 'Fully connected!',

export function GetCurrentTime() {
    return new Date().getTime() / 1000;
}

export function GetExtension(str) {
    const out = str.substring(str.lastIndexOf('.') + 1, str.length);
    return out === str ? "generic" : out;
}

export function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

export function lerp(alpha, a, b) {
    return a + alpha * (b - a);
}

export function ClampLerp(alpha, a, b) {
    return clamp(lerp(alpha, a, b), a, b);
}