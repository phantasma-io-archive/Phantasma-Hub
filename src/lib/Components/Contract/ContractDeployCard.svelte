<script type="ts">
	import Icon from '@iconify/svelte';
	import Card from '../Card/Card.svelte';

	export let deployContract = false;
</script>

<Card size="sm">
	<div class="flex-none w-2/3 max-w-full px-3">
		<div>
			<p class="mb-0 font-sans font-semibold leading-normal text-base">Deploy a Smart contract</p>
			<h5 class="mb-0 font-normal text-sm">Let's deploy a smart contract together.</h5>
		</div>
		<div>
			<button
				class:create-transaction={!deployContract}
				class:close-transaction={deployContract}
				class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400"
				on:click={() => (deployContract = !deployContract)}
			>
				{#if deployContract}
					Close
				{:else}
					Deploy new contract
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
