<script lang="ts">
    // @ts-nocheck
    import { onMount } from "svelte";
    import { GifReader } from "omggif";

    interface Props {
        path: string;
        pixelateEnabled?: boolean;
        pixelSize?: number;
        invertEnabled?: boolean;
        vignetteEnabled?: boolean;
        vignetteStrength?: number;
        fisheyeEnabled?: boolean;
        fisheyeStrength?: number;
        colorDistortionEnabled?: boolean;
        colorDistortionAmount?: number;
        glitchEnabled?: boolean;
        glitchAmount?: number;
        noiseEnabled?: boolean;
        noiseAmount?: number;
        swirlEnabled?: boolean;
        swirlStrength?: number;
        posterizeEnabled?: boolean;
        posterizeLevels?: number;
        scanlinesEnabled?: boolean;
        scanlinesIntensity?: number;
        channelBoostEnabled?: boolean;
        channelToBoost?: "r" | "g" | "b";
        channelBoostAmount?: number;
        chromaticGlitchEnabled?: boolean;
        chromaticGlitchAmount?: number;

        stretchToWindow?: boolean;
        playbackSpeed?: number;

        onLoaded?: () => void;

        vhsPreset?: boolean;
    }

    let {
        path,

        pixelateEnabled = true,
        pixelSize = 10,

        invertEnabled = true,

        vignetteEnabled = true,
        vignetteStrength = 2.5,

        fisheyeEnabled = true,
        fisheyeStrength = 0.5,

        colorDistortionEnabled = true,
        colorDistortionAmount = 75,

        glitchEnabled = true,
        glitchAmount = 5,

        noiseEnabled = true,
        noiseAmount = 0.04,

        swirlEnabled = true,
        swirlStrength = 1.5,

        posterizeEnabled = true,
        posterizeLevels = 6,

        scanlinesEnabled = true,
        scanlinesIntensity = 0.15,
        channelBoostEnabled = false,
        channelToBoost = "r",
        channelBoostAmount = 50,
        chromaticGlitchEnabled = false,
        chromaticGlitchAmount = 6,

        stretchToWindow = true,
        playbackSpeed = 1.0,
        onLoaded = undefined,

        vhsPreset = false,
    }: Props = $props();

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let width = 0;
    let height = 0;
    let displayWidth = 0;
    let displayHeight = 0;

    const frames: ImageData[] = [];
    const delayTimes: number[] = [];

    const clamp = (v: number) => Math.min(255, Math.max(0, v));

    function chromaticGlitch(
        pixels: Uint8ClampedArray,
        w: number,
        h: number,
        amount: number,
    ): Uint8ClampedArray {
        const output = new Uint8ClampedArray(pixels.length);

        const shiftR = {
            x: Math.floor((Math.random() - 0.5) * 2 * amount),
            y: Math.floor((Math.random() - 0.5) * 2 * amount),
        };
        const shiftG = {
            x: Math.floor((Math.random() - 0.5) * 2 * amount),
            y: Math.floor((Math.random() - 0.5) * 2 * amount),
        };
        const shiftB = {
            x: Math.floor((Math.random() - 0.5) * 2 * amount),
            y: Math.floor((Math.random() - 0.5) * 2 * amount),
        };

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const base = (y * w + x) * 4;

                const getOffsetChannel = (dx: number, dy: number, offset: number) => {
                    const nx = Math.max(0, Math.min(w - 1, x + dx));
                    const ny = Math.max(0, Math.min(h - 1, y + dy));
                    return pixels[(ny * w + nx) * 4 + offset];
                };

                output[base] = getOffsetChannel(shiftR.x, shiftR.y, 0); // R
                output[base + 1] = getOffsetChannel(shiftG.x, shiftG.y, 1); // G
                output[base + 2] = getOffsetChannel(shiftB.x, shiftB.y, 2); // B
                output[base + 3] = pixels[base + 3]; // A (unchanged)
            }
        }

        return output;
    }

    function channelBoost(
        pixels: Uint8ClampedArray,
        channel: "r" | "g" | "b",
        amount: number,
    ): Uint8ClampedArray {
        const channelOffset = { r: 0, g: 1, b: 2 }[channel];

        for (let i = 0; i < pixels.length; i += 4) {
            pixels[i + channelOffset] = clamp(pixels[i + channelOffset] * amount);
        }

        return pixels;
    }

    function pixelate(
        pixels: Uint8ClampedArray,
        w: number,
        h: number,
        pixelSize: number,
    ): Uint8ClampedArray {
        const output = new Uint8ClampedArray(pixels.length);
        for (let y = 0; y < h; y += pixelSize) {
            for (let x = 0; x < w; x += pixelSize) {
                let r = 0,
                    g = 0,
                    b = 0,
                    count = 0;
                for (let py = 0; py < pixelSize; py++) {
                    for (let px = 0; px < pixelSize; px++) {
                        const nx = x + px;
                        const ny = y + py;
                        if (nx < w && ny < h) {
                            const i = (ny * w + nx) * 4;
                            r += pixels[i];
                            g += pixels[i + 1];
                            b += pixels[i + 2];
                            count++;
                        }
                    }
                }
                r /= count;
                g /= count;
                b /= count;

                for (let py = 0; py < pixelSize; py++) {
                    for (let px = 0; px < pixelSize; px++) {
                        const nx = x + px;
                        const ny = y + py;
                        if (nx < w && ny < h) {
                            const i = (ny * w + nx) * 4;
                            output[i] = r;
                            output[i + 1] = g;
                            output[i + 2] = b;
                            output[i + 3] = pixels[i + 3];
                        }
                    }
                }
            }
        }
        return output;
    }

    function invertColors(pixels: Uint8ClampedArray): Uint8ClampedArray {
        for (let i = 0; i < pixels.length; i += 4) {
            pixels[i] = 255 - pixels[i];
            pixels[i + 1] = 255 - pixels[i + 1];
            pixels[i + 2] = 255 - pixels[i + 2];
        }
        return pixels;
    }

    function applyVignette(
        pixels: Uint8ClampedArray,
        w: number,
        h: number,
        strength: number,
    ): Uint8ClampedArray {
        const cx = w / 2;
        const cy = h / 2;
        const maxDist = Math.sqrt(cx * cx + cy * cy);

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const dx = x - cx;
                const dy = y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const vignette = 1 - Math.pow(dist / maxDist, strength);

                const i = (y * w + x) * 4;
                pixels[i] *= vignette;
                pixels[i + 1] *= vignette;
                pixels[i + 2] *= vignette;
            }
        }
        return pixels;
    }

    function fisheye(
        pixels: Uint8ClampedArray,
        w: number,
        h: number,
        strength: number,
    ): Uint8ClampedArray {
        const output = new Uint8ClampedArray(pixels.length);
        const cx = w / 2;
        const cy = h / 2;
        const radius = Math.min(cx, cy);

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let dx = (x - cx) / radius;
                let dy = (y - cy) / radius;
                const r = Math.sqrt(dx * dx + dy * dy);

                if (r < 1) {
                    const nr = r + (1 - r) * strength * (1 - r);
                    const theta = Math.atan2(dy, dx);
                    const sx = cx + nr * radius * Math.cos(theta);
                    const sy = cy + nr * radius * Math.sin(theta);

                    const sxI = Math.min(w - 1, Math.max(0, Math.floor(sx)));
                    const syI = Math.min(h - 1, Math.max(0, Math.floor(sy)));

                    const srcIdx = (syI * w + sxI) * 4;
                    const dstIdx = (y * w + x) * 4;

                    output[dstIdx] = pixels[srcIdx];
                    output[dstIdx + 1] = pixels[srcIdx + 1];
                    output[dstIdx + 2] = pixels[srcIdx + 2];
                    output[dstIdx + 3] = pixels[srcIdx + 3];
                } else {
                    const i = (y * w + x) * 4;
                    output[i] = pixels[i];
                    output[i + 1] = pixels[i + 1];
                    output[i + 2] = pixels[i + 2];
                    output[i + 3] = pixels[i + 3];
                }
            }
        }
        return output;
    }

    function intenseColorDistortion(pixels: Uint8ClampedArray, amount: number): Uint8ClampedArray {
        for (let i = 0; i < pixels.length; i += 4) {
            pixels[i] = clamp(pixels[i] + (Math.random() * (amount * 2) - amount));
            pixels[i + 1] = clamp(pixels[i + 1] + (Math.random() * (amount * 2) - amount));
            pixels[i + 2] = clamp(pixels[i + 2] + (Math.random() * (amount * 2) - amount));
        }
        return pixels;
    }

    function glitch(
        pixels: Uint8ClampedArray,
        w: number,
        h: number,
        amount: number,
    ): Uint8ClampedArray {
        const output = new Uint8ClampedArray(pixels.length);
        for (let i = 0; i < pixels.length; i++) output[i] = pixels[i];

        const rShift = Math.floor((Math.random() * 2 - 1) * amount);
        const gShift = Math.floor((Math.random() * 2 - 1) * amount);
        const bShift = Math.floor((Math.random() * 2 - 1) * amount);

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const i = (y * w + x) * 4;
                const rSrc = (y * w + Math.min(w - 1, Math.max(0, x + rShift))) * 4;
                const gSrc = (y * w + Math.min(w - 1, Math.max(0, x + gShift))) * 4;
                const bSrc = (y * w + Math.min(w - 1, Math.max(0, x + bShift))) * 4;

                output[i] = pixels[rSrc];
                output[i + 1] = pixels[gSrc + 1];
                output[i + 2] = pixels[bSrc + 2];
                output[i + 3] = pixels[i + 3];
            }
        }
        return output;
    }

    function noise(pixels: Uint8ClampedArray, amount: number): Uint8ClampedArray {
        for (let i = 0; i < pixels.length; i += 4) {
            if (Math.random() < amount) {
                const val = Math.random() < 0.5 ? 0 : 255;
                pixels[i] = val;
                pixels[i + 1] = val;
                pixels[i + 2] = val;
            }
        }
        return pixels;
    }

    function swirl(
        pixels: Uint8ClampedArray,
        w: number,
        h: number,
        strength: number,
    ): Uint8ClampedArray {
        const output = new Uint8ClampedArray(pixels.length);
        const cx = w / 2;
        const cy = h / 2;
        const radius = Math.min(cx, cy);

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let dx = x - cx;
                let dy = y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < radius) {
                    const angle = (strength * (radius - dist)) / radius;
                    const s = Math.sin(angle);
                    const c = Math.cos(angle);

                    const nx = Math.floor(cx + c * dx - s * dy);
                    const ny = Math.floor(cy + s * dx + c * dy);

                    if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                        const srcIdx = (ny * w + nx) * 4;
                        const dstIdx = (y * w + x) * 4;
                        output[dstIdx] = pixels[srcIdx];
                        output[dstIdx + 1] = pixels[srcIdx + 1];
                        output[dstIdx + 2] = pixels[srcIdx + 2];
                        output[dstIdx + 3] = pixels[srcIdx + 3];
                        continue;
                    }
                }

                const i = (y * w + x) * 4;
                output[i] = pixels[i];
                output[i + 1] = pixels[i + 1];
                output[i + 2] = pixels[i + 2];
                output[i + 3] = pixels[i + 3];
            }
        }
        return output;
    }

    function posterize(pixels: Uint8ClampedArray, levels: number): Uint8ClampedArray {
        const step = 255 / (levels - 1);
        for (let i = 0; i < pixels.length; i += 4) {
            pixels[i] = Math.round(pixels[i] / step) * step;
            pixels[i + 1] = Math.round(pixels[i + 1] / step) * step;
            pixels[i + 2] = Math.round(pixels[i + 2] / step) * step;
        }
        return pixels;
    }

    function scanlines(
        pixels: Uint8ClampedArray,
        w: number,
        h: number,
        intensity: number,
    ): Uint8ClampedArray {
        for (let y = 0; y < h; y++) {
            if (y % 2 === 0) {
                for (let x = 0; x < w; x++) {
                    const i = (y * w + x) * 4;
                    pixels[i] *= 1 - intensity;
                    pixels[i + 1] *= 1 - intensity;
                    pixels[i + 2] *= 1 - intensity;
                }
            }
        }
        return pixels;
    }

    function applyVHSPreset(pixels: Uint8ClampedArray): Uint8ClampedArray {
        pixels = scanlines(pixels, width, height, 0.2);
        pixels = chromaticGlitch(pixels, width, height, 1);
        pixels = noise(pixels, 0.05);
        pixels = glitch(pixels, width, height, 2);
        pixels = channelBoost(pixels, "r", 1.3);
        pixels = channelBoost(pixels, "b", 1.2);
        pixels = posterize(pixels, 4);
        pixels = applyVignette(pixels, width, height, 1.2);
        return pixels;
    }

    function applyEffects(pixels: Uint8ClampedArray): Uint8ClampedArray {
        if (vhsPreset) {
            return applyVHSPreset(pixels);
        }

        if (colorDistortionEnabled) pixels = intenseColorDistortion(pixels, colorDistortionAmount);
        if (pixelateEnabled) pixels = pixelate(pixels, width, height, pixelSize);
        if (invertEnabled) pixels = invertColors(pixels);
        if (fisheyeEnabled) pixels = fisheye(pixels, width, height, fisheyeStrength);
        if (swirlEnabled) pixels = swirl(pixels, width, height, swirlStrength);
        if (glitchEnabled) pixels = glitch(pixels, width, height, glitchAmount);
        if (noiseEnabled) pixels = noise(pixels, noiseAmount);
        if (posterizeEnabled) pixels = posterize(pixels, posterizeLevels);
        if (scanlinesEnabled) pixels = scanlines(pixels, width, height, scanlinesIntensity);
        if (vignetteEnabled) pixels = applyVignette(pixels, width, height, vignetteStrength);
        if (channelBoostEnabled) pixels = channelBoost(pixels, channelToBoost, channelBoostAmount);
        if (chromaticGlitchEnabled)
            pixels = chromaticGlitch(pixels, width, height, chromaticGlitchAmount);
        return pixels;
    }

    async function processGif(buffer: ArrayBuffer) {
        const reader = new GifReader(new Uint8Array(buffer));
        width = reader.width;
        height = reader.height;

        canvas.width = width;
        canvas.height = height;

        const raw = new Uint8ClampedArray(width * height * 4);
        for (let i = 0; i < reader.numFrames(); i++) {
            reader.decodeAndBlitFrameRGBA(i, raw);
            const processed = applyEffects(raw.slice());
            frames.push(new ImageData(processed, width, height));
            const { delay } = reader.frameInfo(i);
            delayTimes.push((delay > 0 ? delay : 10) * 10);
        }

        startPlayback();
        if (onLoaded) {
            onLoaded();
        }
    }

    function createBitmapFromImageData(imageData: ImageData): HTMLCanvasElement {
        const temp = document.createElement("canvas");
        temp.width = imageData.width;
        temp.height = imageData.height;
        const tempCtx = temp.getContext("2d")!;
        tempCtx.putImageData(imageData, 0, 0);
        return temp;
    }

    function startPlayback() {
        let idx = 0;
        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            if (stretchToWindow) {
                ctx.clearRect(0, 0, displayWidth, displayHeight);
                ctx.drawImage(
                    createBitmapFromImageData(frames[idx]),
                    0,
                    0,
                    displayWidth,
                    displayHeight,
                );
            } else {
                ctx.clearRect(0, 0, width, height);
                ctx.putImageData(frames[idx], 0, 0);
            }

            idx = (idx + 1) % frames.length;
            setTimeout(draw, delayTimes[idx] / playbackSpeed);
        };
        draw();
    }

    onMount(async () => {
        ctx = canvas.getContext("2d")!;
        const resp = await fetch(path);
        const buf = await resp.arrayBuffer();
        await processGif(buf);

        if (stretchToWindow) {
            const resize = () => {
                displayWidth = window.innerWidth;
                displayHeight = window.innerHeight;
                canvas.width = displayWidth;
                canvas.height = displayHeight;
            };
            window.addEventListener("resize", resize);
            resize();
        }
    });
</script>

<canvas bind:this={canvas}></canvas>

<style>
    canvas {
        display: block;
        image-rendering: optimizeSpeed;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }
</style>