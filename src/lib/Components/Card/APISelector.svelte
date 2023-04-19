<script lang="ts">
	import Icon from '@iconify/svelte';
	import Card from '$lib/Components/Card/Card.svelte';
	import { apiLink, apiStatus, MainnetURL, SimnetURL, TestnetURL } from '$lib/store';

	let selectedAPI: string = TestnetURL;

	apiLink.subscribe((value) => {
		selectedAPI = value;
	});

	function connectToAPI() {
		apiStatus.set(true);
	}

	function onChangeApi() {
		console.log('API Changed to: ' + selectedAPI);
		apiLink.set(selectedAPI);
		connectToAPI();
	}
</script>

<Card size="sm">
	<div class="flex-none w-2/3 max-w-full px-3">
		<div>
			<p class="mb-0 font-sans font-semibold leading-normal text-base">API Select</p>
			<h5 class="mb-0 font-normal text-sm">Select the desired API to connect to.</h5>
		</div>
		<div>
			<select name="api" bind:value={selectedAPI} class="w-full" on:change={onChangeApi}>
				<option value={SimnetURL} data-net="simnet">Local</option>
				<option value={TestnetURL} data-net="testnet">Testnet</option>
				<option value={MainnetURL} data-net="mainnet">Mainnet</option>
			</select>
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
				icon="eos-icons:api-outlined"
			/>
		</div>
	</div>
</Card>
