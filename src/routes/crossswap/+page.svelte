<script lang="ts">
	import CrossSwapCard from '$lib/Components/CrossSwap/CrossSwapCard.svelte';
	import CrossSwap from '$lib/Components/CrossSwap/CrossSwap.svelte';

	let _contractName: string;

	let openSwap = false;

	function onOpenSwapChange() {}
</script>

<div class="mb-4 px-6 mx-auto">
	<div class="flex flex-wrap -mx-3">
		<CrossSwapCard bind:openSwap on:change={onOpenSwapChange} />
	</div>

	<div class="flex flex-wrap mt-6 -mx-3">
		{#if openSwap}
			<CrossSwap />
		{/if}
	</div>
</div>
