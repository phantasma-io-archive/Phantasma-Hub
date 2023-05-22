<script lang="ts">
	import Icon from '@iconify/svelte';
	import Card from '$lib/Components/Card/Card.svelte';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();
	const change = () => dispatch('change');

	export let openAdvancedInteraction = false;

	function openAdvancedInteractions() {
		openAdvancedInteraction = !openAdvancedInteraction;
		change();
	}
</script>

<Card size="sm">
	<div class="flex-none w-2/3 max-w-full px-3">
		<div>
			<p class="mb-0 font-sans font-semibold leading-normal text-base">
				Create Advanced Interactions
			</p>
			<h5 class="mb-0 font-normal text-sm">
				This is used to create advanced interaction and concatenating method calls.
			</h5>
		</div>
		<div>
			<button
				class:airdrop-open={!openAdvancedInteraction}
				class:airdrop-close={openAdvancedInteraction}
				class="rounded-md text-white p-2"
				on:click={openAdvancedInteractions}
			>
				{#if !openAdvancedInteraction}
					Open Advanced Interactions
				{:else}
					Close
				{/if}
			</button>
		</div>
	</div>
	<div class="px-3 text-right basis-1/3">
		<div
			class="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500"
		>
			<Icon
				height="18"
				width="18"
				class="text-lg relative top-2.5 text-white"
				icon="fa6-solid:file-contract"
			/>
		</div>
	</div>
</Card>

<style>
	.airdrop-open {
		@apply bg-green-500;
	}

	.airdrop-close {
		@apply bg-red-500;
	}
</style>
