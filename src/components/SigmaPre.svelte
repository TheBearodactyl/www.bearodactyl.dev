<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";

    let contentContainer: HTMLElement;
    let { children } = $props();

    async function applyAnimation() {
        const preElement = contentContainer?.querySelector("pre");

        if (!preElement) {
            console.warn("SigmaPre component expects a <pre> element in its slot to animate.");
            return;
        }

        const originalText = preElement.textContent || "";
        preElement.innerHTML = "";

        const characters = originalText.split("");
        characters.forEach((char) => {
            if (char === "\n") {
                preElement.appendChild(document.createElement("br"));
            } else {
                const span = document.createElement("span");
                span.textContent = char;
                span.classList.add("sigma-char");
                preElement.appendChild(span);
            }
        });

        await tick();

        const charsToAnimate = preElement.querySelectorAll(".sigma-char");

        gsap.set(charsToAnimate, {
            opacity: 0,
            scale: 0.1,
            y: 10,
            filter: "blur(2px)",
            transformOrigin: "center center",
            color: "var(--rp-text)",
            backgroundColor: "#ffffff"
        });

        gsap.to(charsToAnimate, {
            opacity: 1,
            scale: 1,
            backgroundColor: "transparent",
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.04,
            ease: "expo.out",
            overwrite: "auto",
            onStart: function () {
                const charElement = this.targets()[0] as HTMLElement;

                gsap.fromTo(
                    charElement,
                    {
                        color: "var(--rp-text)",
                        textShadow:
                            "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.5)"
                    },
                    {
                        color: "var(--rp-text)",
                        textShadow: "none",
                        duration: 0.3,
                        ease: "power2.out",
                        delay: 0
                    }
                );
            }
        });
    }

    import { tick } from "svelte";

    onMount(() => {
        applyAnimation();
    });
</script>

<div class="sigma-text-wrapper">
    <div bind:this={contentContainer} class="sigma-text-content-host">
        {@render children?.()}
    </div>
</div>

<style lang="scss">
    :global {
        .sigma-text-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100px;
            padding: 20px;
        }

        .sigma-text-content-host {
            width: 100%;
            max-width: fit-content;
        }

        .sigma-text-content-host pre {
            white-space: pre-wrap;
            word-break: break-word;
            font-family: "Inter", monospace;
            font-size: 1.2em;
            line-height: 1.5;
            color: var(--rp-text);
            background-color: transparent;
            padding: 1.5rem 2rem;
            border-radius: 12px;
            overflow-x: auto;
            position: relative;
        }

        .sigma-char {
            display: inline-block;
        }
    }
</style>
