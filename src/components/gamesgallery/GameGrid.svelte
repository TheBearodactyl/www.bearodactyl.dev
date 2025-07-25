<script lang="ts">
	import type { Game } from '$lib/types';
	import GameCard from './GameCard.svelte';
	import { _ } from 'svelte-i18n';

	interface Props {
		games: Game[];
		isContentVisible: boolean;
		viewMode: string;
		expandedCard: string | number | null;
		onToggleCard: (bookId: string | number) => void;
	}

	let { games: books, isContentVisible, viewMode, expandedCard, onToggleCard }: Props = $props();
</script>

<div class="book-grid-container" class:fade-in={isContentVisible}>
	{#if books.length > 0}
		<div class="book-grid">
			{#each books as book, index (book.id)}
				<GameCard
					game={book}
					{index}
					{viewMode}
					isExpanded={expandedCard === book.id}
					onToggleCard={() => onToggleCard(book.id)}
				/>
			{/each}
		</div>
	{:else}
		<div class="no-results">
			{$_('no-results')}
		</div>
	{/if}
</div>
