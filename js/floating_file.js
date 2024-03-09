import {FromHTML, ClampLerp, GetCurrentTime, GetExtension} from "./lib.js";

export class FloatingFile {
    constructor(filename, CONFIG) {
        this.elements = [];

        this.filename = filename;
        this.hostElement = CONFIG.FLOATING_FILE_ELEMENT;
        this.extension = GetExtension(filename);
        this.icon = CONFIG.FILE_MAP[this.extension];
        this.imageRoot = CONFIG.ICON_ROOT || "/";
        this.height = CONFIG.ICONS_HEIGHT;
        this.width = CONFIG.ICONS_WIDTH;
        this.DetermineEasterEggType();

        this.distance = (2*(Math.random() - 0.5));
        this.speed = 50 * (1 - Math.random() * 0.5);
        this.Wrap();

        this.realY = this.hostElement.offsetHeight / 2;
        this.realX = -100;

        this.decoY = 0;
        this.decoX = 0;

        this.Attach();
    }

    Wrap(){
        this.startTime = GetCurrentTime();
        this.endTime = this.startTime + this.speed * 0.5;
    }

    DetermineEasterEggType() {
        this.isEasterEgg = Math.random() <= 0.03;
        if((this.extension === 'wav' || this.extension === 'ttf') && Math.random() <= 0.5){
            this.easterEggType = "umbrella";
        } else {
            this.easterEggType = "mustache";
        }
    }

    Attach() {
        let img = `<img class="floating-icon-file" alt="${this.filename}" src="${this.imageRoot}${this.icon}.png" \>`;
        let accessory = "";
        if (this.isEasterEgg){
            accessory = `<img class="easter-egg easter-egg-${this.easterEggType}" alt="${this.easterEggType}" src="${this.imageRoot}${this.easterEggType}.png" \>`
        }
        let wrap = `<div class="floating-icon">${img}${accessory}</div>`;

        this.elements.push(...FromHTML(wrap));

        this.hostElement.append(...this.elements)
    }

    //         let timer = setInterval(FloatingFileThink, 0.1);

    IsActiveFile() {
        return false;
    }

    Think() {
        let currentTime = GetCurrentTime();

        let delta = (currentTime - this.startTime) / (this.endTime - this.startTime);

        let x = ClampLerp(delta, -100, this.hostElement.offsetWidth + 100);
        let y = (this.hostElement.offsetHeight / 2) + (Math.sin(x * 0.01) * (this.distance * (this.hostElement.offsetHeight / 2)));

        this.realX = x;
        this.realY = y;

        // if (this.isEasterEgg) {
        //     if (this.isUmbrella) {
        //     } else {
        //         this.decoY = y + (-this.height / 1.5);
        //         this.decoX = x + (this.width / 6);
        //         // this.decoY = y + this.height / 2;
        //         // this.decoX = x + this.width / 4;
        //     }
        // }

        this.elements.forEach((value) => {
            value.style.setProperty('margin-top', `${this.realY}px`);
            value.style.setProperty('margin-left', `${this.realX}px`);
        })

        if (delta > 1.01) {
            if (this.IsActiveFile()) {
                this.Wrap();
            } else {
                return this.Destroy();
            }
        }
    }

    Destroy() {
        this.elements.forEach((value) => {
            value.remove();
        });
        // if (this.isEasterEgg && this.iconEasterEggElement) {
        //     this.iconEasterEggElement.remove();
        // }
        return true;
    }
}