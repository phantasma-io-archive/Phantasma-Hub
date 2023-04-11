<script lang="ts">
	import AirdropCardFT from '$lib/Components/Airdrop/AirdropCardFT.svelte';
	import AirdropCardNFT from '$lib/Components/Airdrop/AirdropCardNFT.svelte';
	import AirdropFT from '$lib/Components/Airdrop/AirdropFT.svelte';
	import AirdropNFT from '$lib/Components/Airdrop/AirdropNFT.svelte';

	let _contractName: string;
	let _isNFTAirDrop: boolean = false;

	let openAirdropFT = false;
	let openAirdropNFT = false;

	function onAirdropFTChange() {
		openAirdropNFT = false;
	}

	function onAirdropNFTChange() {
		openAirdropFT = false;
	}
</script>

<div class="mb-4 px-6 mx-auto">
	<div class="flex flex-wrap -mx-3">
		<AirdropCardFT bind:openAirdropFT on:change={onAirdropFTChange} />
		<AirdropCardNFT bind:openAirdropNFT on:change={onAirdropNFTChange} />
	</div>

	<div class="flex flex-wrap mt-6 -mx-3">
		{#if openAirdropFT}
			<AirdropFT />
		{:else if openAirdropNFT}
			<AirdropNFT />
		{/if}
	</div>
</div>
