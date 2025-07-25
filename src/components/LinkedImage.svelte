<script lang="ts">
	import { _ } from 'svelte-i18n';

    interface Props {
        imageSrc: string;
        audioSrc: string;
        gotoLink?: string;
        delay?: number;
    }

	let { imageSrc, audioSrc, gotoLink, delay = 100 }: Props = $props();
	let audio = $state<HTMLAudioElement | null>(null);

	const handleClick = async () => {
		try {
			if (!audio) {
				let audioPath = audioSrc;
				if (!audioPath.startsWith('http') && !audioPath.startsWith('/')) {
					audioPath = `/${audioPath}`;
				}

				audio = new Audio(audioPath);
				audio.addEventListener('error', (e) => {
					console.error('Audio failed to load:', audioPath, e);
				});
			}

			await audio.play();

			if (gotoLink) {
				setTimeout(() => {
					if ((gotoLink ?? window.location.href).startsWith('http')) {
						window.open(gotoLink, '_blank');
					} else {
						window.location.href = gotoLink ?? window.location.href;
					}
				}, delay);
			}
		} catch (error) {
			console.error('Failed to play audio:', error);
		}
	};

	$effect(() => {
		return () => {
			// Cleanup on unmount
			if (audio) {
				audio.pause();
				audio = null;
			}
		};
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<img src={imageSrc} alt={$_('click-to-play-audio')} class="clickable" on:click={handleClick} />

<style>
	.clickable {
		cursor: pointer;
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		object-fit: fill;
		overflow: hidden;
		display: block;
	}
</style>
