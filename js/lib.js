export const file_map = {
    png: "picture.png",
    vtf: "picture.png",
    vmt: "page_white_picture.png",

    wav: "sound.png",
    mp3: "sound.png",
    ogg: "sound.png",

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
    wdo: "package_go.png", // Fake extension for Workshop Downloading

    generic: "bug.png",

    dbg: "bug.png", // Debug
};

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

export function ParseStatusString(str) {
    let workshop = str.match(/(\d+)\/(\d+) \(([\d.]+) (\S+)\) - (Loading '(.*(?=')|.*)|.*)/)
    if (workshop) {
        return {
            currentWorkshopFile: workshop[1],
            totalWorkshopFiles: workshop[2],
            size: workshop[3],
            sizeUnits: workshop[4],
            status: workshop[5],
            workshopName: workshop[6],
        }
    }
}

export function GetCurrentTime() {
    return new Date().getTime() / 1000;
}

export function GetExtension(str) {
    return str.substring(str.lastIndexOf('.') + 1, str.length) || "generic"
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