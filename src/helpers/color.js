class Color {

    r = 0;
    g = 0;
    b = 0;

    constructor() {}

    setRGB(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    
    setHSV(h, s, v) {

        var rgb = HSVtoRGB(h, s, v);
        console.log('!!!' + rgb)

        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b;
    }
    
    setHEX(hex) {
        var rgb = HEXtoRGB(hex);

        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b;
    }

    // ----------------------

    getRGB() {
        return {r: this.r, g: this.g, b: this.b};
    }

    getHSV() {

        return RGBtoHSV(this.r, this.g, this.b);

    }

    getHex() {
        return RGBtoHEX(this.r, this.g, this.b);
    }

}

//RGB -> ...

function RGBtoHSV(r, g, b) {

    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return {
        h: h,
        s: s,
        v: v
    };
}

function RGBtoHEX(r, g, b) {
    return "#" + INTtoHEX(r) + INTtoHEX(g) + INTtoHEX(b);
}

//HSV ->

function HSVtoRGB(h, s, v) {

    var r, g, b, i, f, p, q, t;

    h /= 360;
    s /= 100;
    v /= 100;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };

}

function HSVtoHEX(h, s, v) {
    var rgb = HSVtoRGB(h, s, v);

    return RGBtoHEX(rgb.r, rgb.g, rgb.b);
}

//HEX ->

function HEXtoRGB(hex) {

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };

}

function HEXtoHSV(hex) {
    var rgb = HEXtoRGB(hex);
    return RGBtoHSV(rgb.r, rgb.g, rgb.b);
}

//MISC
function INTtoHEX(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

//EXPORTS
exports.Color = Color;

exports.RGBtoHSV = RGBtoHSV
exports.RGBtoHEX = RGBtoHEX

exports.HSVtoRGB = HSVtoRGB;
exports.HSVtoHEX = HSVtoHEX;

exports.HEXtoRGB = HEXtoRGB;
exports.HEXtoHSV = HEXtoHSV;

exports.INTtoHEX = INTtoHEX;