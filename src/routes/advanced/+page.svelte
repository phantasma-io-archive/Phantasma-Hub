<script lang="ts">
	import APISelector from '$lib/Components/Card/APISelector.svelte';
	import RunHexCard from '$lib/Components/Contract/Advanced/AdvancedRunHexScriptCard.svelte';
	import RunHexScript from '$lib/Components/Contract/Advanced/AdvancedRunHexScript.svelte';
	import ContractConsole from '$lib/Components/Contract/ContractConsole.svelte';
	import AdvancedInteractionsCard from '$lib/Components/Contract/Advanced/AdvancedInteractionsCard.svelte';
	import AdvancedInteractions from '$lib/Components/Contract/Advanced/AdvancedInteractions.svelte';
	let runHexScript = false;
	let advancedInteractions = false;
</script>

<div class="mb-4 px-6 mx-auto">
	<div class="flex flex-wrap -mx-3">
		<APISelector />
		<RunHexCard bind:openHexScript={runHexScript} />
		<AdvancedInteractionsCard bind:openAdvancedInteraction={advancedInteractions} />
	</div>

	<div class="flex flex-wrap mt-6 -mx-3">
		{#if runHexScript}
			<RunHexScript />
		{/if}

		{#if advancedInteractions}
			<AdvancedInteractions />
		{/if}
	</div>

	<div class="flex flex-wrap mt-6 -mx-3">
		{#if runHexScript || advancedInteractions}
			<ContractConsole />
		{/if}
	</div>
</div>
