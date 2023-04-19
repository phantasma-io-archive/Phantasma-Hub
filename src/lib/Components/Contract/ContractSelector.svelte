<script lang="ts">
	import Icon from '@iconify/svelte';
	import Card from '$lib/Components/Card/Card.svelte';
	import {
		LinkWallet,
		LinkDapp,
		PhantasmaAPIClient,
		contractDetails,
		contractName,
		allContracts
	} from '$lib/store';
	import type { PhantasmaAPI } from 'phantasma-ts/core';
	import { onMount } from 'svelte';
	import { PhantasmaLink } from 'phantasma-ts';
	//import { PhantasmaLink } from 'phantasma-ts/src/core/link/phantasmaLink';

	let contractSelectedName: string;

	let contracts: Array<string> = new Array<string>();

	let api: PhantasmaAPI;
	PhantasmaAPIClient.subscribe((value) => {
		api = value;
	});

	onMount(async () => {
		await loadContracts();
	});

	async function loadContracts() {
		let chain = await api.getChains();
		let tokens = await api.getTokens();
		chain[0].contracts.forEach((contract) => {
			contracts.push(contract);
		});

		tokens.forEach((token) => {
			//console.log(token.symbol);
			contracts.push(token.symbol);
		});
		contracts = contracts;
		allContracts.set(contracts);
	}

	async function fetchContract(_contractName) {
		let contractInfo = await api.getContract('main', _contractName);
		contractDetails.set(contractInfo);
		contractName.set(_contractName);
	}

	function selectContract() {
		fetchContract(contractSelectedName);
		console.log(contractSelectedName);
		LinkDapp.set(contractSelectedName);
		LinkWallet.set(new PhantasmaLink(contractSelectedName, true));
	}
</script>

<Card size="sm">
	<div class="flex-none w-2/3 max-w-full px-3">
		<div>
			<p class="mb-0 font-sans font-semibold leading-normal text-base">Contract Select</p>
			<h5 class="mb-0 font-normal text-sm">Select the contract to interact.</h5>
		</div>
		<div>
			<select
				name="contract"
				bind:value={contractSelectedName}
				class="w-full"
				on:change={selectContract}
			>
				<option value selected>No contract selected.</option>
				{#each contracts as contract}
					<option value={contract}>{contract}</option>
				{/each}
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
				icon="fa6-solid:file-contract"
			/>
		</div>
	</div>
</Card>
