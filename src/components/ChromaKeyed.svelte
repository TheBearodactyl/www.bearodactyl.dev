<script lang="ts">
    import { onMount } from "svelte";
    import { GifReader } from "omggif";

    interface Props {
        src: string;
        greenThreshold: number;
        scale: number;
    }

    let { src, greenThreshold, scale }: Props = $props();

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    let width = 0;
    let height = 0;

    const frames: ImageData[] = [];
    const delayTimes: number[] = [];

    function isGreen(r: number, g: number, b: number): boolean {
        const total = r + g + b;
        if (!total) return false;
        const greenRatio = g / total;
        return greenRatio > greenThreshold && g > 80;
    }

    function chromaKey(pixels: Uint8ClampedArray): Uint8ClampedArray {
        for (let i = 0; i < pixels.length; i += 4) {
            const [r, g, b] = [pixels[i], pixels[i + 1], pixels[i + 2]];
            if (isGreen(r, g, b)) {
                pixels[i + 3] = 0;
            }
        }
        return pixels;
    }

    async function processGif(buffer: ArrayBuffer) {
        const reader = new GifReader(new Uint8Array(buffer));
        width = reader.width;
        height = reader.height;

        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width * scale}px`;
        canvas.style.height = `${height * scale}px`;

        ctx.setTransform(scale, 0, 0, scale, 0, 0);

        const raw = new Uint8ClampedArray(width * height * 4);
        for (let i = 0; i < reader.numFrames(); i++) {
            reader.decodeAndBlitFrameRGBA(i, raw);
            const cleaned = chromaKey(raw.slice());
            frames.push(new ImageData(cleaned, width, height));
            const { delay } = reader.frameInfo(i);
            delayTimes.push((delay > 0 ? delay : 10) * 10);
        }

        startPlayback();
    }

    function startPlayback() {
        let idx = 0;
        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.putImageData(frames[idx], 0, 0);
            idx = (idx + 1) % frames.length;
            setTimeout(draw, delayTimes[idx]);
        };
        draw();
    }

    onMount(async () => {
        ctx = canvas.getContext("2d")!;
        const resp = await fetch(src);
        const buf = await resp.arrayBuffer();
        await processGif(buf);
    });
</script>

<canvas bind:this={canvas}></canvas>

<style>
    canvas {
        display: block;
        image-rendering: pixelated;
    }
</style>
