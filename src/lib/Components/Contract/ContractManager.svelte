<script type="ts">
	import { allContracts, contractDetails, contractName, PhantasmaAPIClient } from '$lib/store';
	import type { Balance, Contract, PhantasmaAPI } from 'phantasma-ts/core';
	import { onMount } from 'svelte';
	import Card from '../Card/Card.svelte';

	let selectContract;
	let api: PhantasmaAPI;
	let contractData: Contract;
	export let contractAddress;

	let contracts: Array<string> = [];
	let balances: Array<Balance> = [];

	onMount(async () => {
		await loadContracts();
	});

	async function loadContracts() {
		let chain = await api.getChains();
		let tokens = await api.getTokens();
		let localContracts = [];
		chain[0].contracts.forEach((contract) => {
			//console.log(contract);
			localContracts.push(contract);
		});

		tokens.forEach((token) => {
			//console.log(token.symbol);
			localContracts.push(token.symbol);
		});
		//localContracts = contracts;
		allContracts.set(localContracts);
	}

	allContracts.subscribe((value) => {
		contracts = value;
	});

	PhantasmaAPIClient.subscribe((value) => {
		api = value;
	});

	async function fetchContractBalances() {
		balances = [];
		let account = await api.getAccount(contractData.address);
		balances = account.balances;
		let stakedBalance: Balance = {
			symbol: 'SOUL Staked',
			amount: account.stake,
			decimals: 8,
			chain: 'main'
		};

		balances.unshift(stakedBalance);
	}

	async function fetchContract(_contractName) {
		let contractInfo = await api.getContract('main', _contractName);
		contractDetails.set(contractInfo);
		contractName.set(_contractName);
		contractData = contractInfo;
		await fetchContractBalances();
	}

	function fetchContractData() {
		fetchContract(selectContract);
	}
</script>

<Card size="xl" title="Contract Manager" description="Deploy your Smart Contract">
	<div class="my-1">
		<form on:submit|preventDefault={() => null}>
			<div class="grid md:grid-cols-2 md:gap-6">
				<div class="relative z-0 w-full mb-6 group">
					<select
						name="contract"
						id="contract"
						bind:value={selectContract}
						on:change={fetchContractData}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
					>
						<option value selected>No contract selected.</option>
						{#each contracts as contractName}
							<option value={contractName}>
								{contractName}
							</option>
						{/each}
					</select>
					<label
						for="organization"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>Contract</label
					>
				</div>
			</div>

			<h5 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Contract Details</h5>

			{#if contractData}
				<div class="grid md:grid-cols-2 md:gap-6">
					<div class="relative z-0 w-full mb-6 group">
						<input
							type="text"
							name="contractName"
							id="contractName"
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							bind:value={contractData.name}
							required
							disabled
						/>
						<label
							for="subject"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>Contract Address</label
						>
					</div>
					<div class="relative z-0 w-full mb-6 group">
						<input
							type="text"
							name="contractAddress"
							id="contractAddress"
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							bind:value={contractData.address}
							required
							disabled
						/>
						<label
							for="subject"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>Contract Address</label
						>
					</div>
				</div>

				<h5 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Contract Balances</h5>

				<div class="grid md:grid-cols-3 md:gap-6 max-h-50 overflow-y-scroll my-2 pt-2">
					{#each balances as balance}
						<div class="relative z-0 w-full mb-6 group">
							<input
								type="number"
								name="id"
								id="id"
								class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
								placeholder=" "
								value={(parseInt(balance.amount) / 10 ** balance.decimals).toFixed(2)}
								required
								disabled
							/>
							<label
								for="subject"
								class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
								>{balance.symbol}</label
							>
						</div>
					{/each}
				</div>

				<h5>Methods</h5>
				<div class="grid md:grid-cols-3 md:gap-6">
					{#each contractData.methods as method}
						<div class="relative z-0 w-full mb-6 group">
							<input
								type="text"
								name="contractName"
								id="contractName"
								class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
								placeholder=" "
								bind:value={method.name}
								required
								disabled
							/>
							<label
								for="subject"
								class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
								>{method.name}
							</label>
						</div>
					{/each}
				</div>
			{/if}
		</form>
	</div>
</Card>
