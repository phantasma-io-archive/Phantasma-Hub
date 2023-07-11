<script lang="ts">
	import Icon from '@iconify/svelte';
	import Card from '$lib/Components/Card/Card.svelte';
	import { API_URL, APIStatus } from '$lib/store';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	const change = () => dispatch('change');

	export let openAirdropFT = false;

	function onOpenAirdropFT() {
		openAirdropFT = !openAirdropFT;
		change();
	}
</script>

<Card size="md">
	<div class="flex-none w-2/3 max-w-full px-3">
		<div>
			<p class="mb-0 font-sans font-semibold leading-normal text-base">Airdrop Fungible Tokens</p>
			<h5 class="mb-0 font-normal text-sm">
				Airdrop Fungible Tokens to your community with just a push of a button.
			</h5>
		</div>
		<div>
			<button
				class:airdrop-open={!openAirdropFT}
				class:airdrop-close={openAirdropFT}
				class="rounded-md text-white p-2"
				on:click={onOpenAirdropFT}
			>
				{#if !openAirdropFT}
					Airdrop Tokens
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
				icon="uil:money-withdraw"
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
