<script lang="ts">
	interface Props {
		modelValue: string;
		'onupdate:modelValue'?: (value: string) => void;
		'ontoggle-search-mode'?: () => void;
	}

	let {
		modelValue,
		'onupdate:modelValue': onUpdateModelValue,
		'ontoggle-search-mode': onToggleSearchMode
	}: Props = $props();

	const handleToggleSearchMode = () => {
		onToggleSearchMode?.();
	};

	const handleInput = (event: Event) => {
		const target = event.target as HTMLInputElement | null;
		if (target) {
			onUpdateModelValue?.(target.value);
		}
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'ArrowRight') {
			handleToggleSearchMode();
		}
	};
</script>

<div class="filter-pill-container">
	<div class="filter-pill">
		<input
			class="pill-search-input"
			placeholder="Search"
			value={modelValue}
			oninput={handleInput}
			onkeydown={handleKeydown}
		/>
		<button class="pill-filter-btn" onclick={handleToggleSearchMode}>
			<span class="icon">☰</span>
		</button>
	</div>
</div>
