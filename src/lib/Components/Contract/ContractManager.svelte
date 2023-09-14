<script lang="ts">
	import {
		AllContracts,
		ContractDetails,
		SelectedContractName,
		PhantasmaAPIClient,
		ExplorerURL,
		LinkWallet
	} from '$lib/store';

	import type { Balance, Contract, PhantasmaAPI, Account, Token } from 'phantasma-ts/src';
	import { onMount } from 'svelte';
	import Card from '../Card/Card.svelte';
	import IncreaseStorageContract from '../Modals/IncreaseStorageContract.svelte';
	import { PhantasmaLink } from 'phantasma-ts';

	let selectContract;
	let api: PhantasmaAPI;
	let contractData: Contract;
	let contractAddress: string;
	let contractInformation: Account;
	let tokenDataInformation: Token;
	let increaseStorageModal: boolean = false;

	let link: PhantasmaLink;
	LinkWallet.subscribe((value) => {
		link = value;
	});

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
		AllContracts.set(localContracts);
	}

	AllContracts.subscribe((value) => {
		contracts = value;
	});

	PhantasmaAPIClient.subscribe((value) => {
		api = value;
	});

	async function fetchContractBalances() {
		balances = [];
		let account = await api.getAccount(contractData.address);
		contractInformation = account;
		console.log('Info: ', { account });
		balances = account.balances;
		let stakedBalance: Balance = {
			symbol: 'SOUL Staked',
			amount: account.stake,
			decimals: 8,
			chain: 'main'
		};

		balances.unshift(stakedBalance);
	}

	async function fetchContract(_contractName: string) {
		let tokenInfo: Token;
		if (_contractName.toUpperCase() == _contractName) {
			// It's a token
			tokenInfo = await api.getToken(_contractName);
		}
		let contractInfo = await api.getContract('main', _contractName);

		ContractDetails.set(contractInfo);
		SelectedContractName.set(_contractName);
		console.log({ tokenInfo });
		contractData = contractInfo;
		tokenDataInformation = tokenInfo;
		console.log({ contractData });
		await fetchContractBalances();
	}

	function fetchContractData() {
		fetchContract(selectContract);
	}

	function toggleIncreaseStorage() {
		increaseStorageModal = !increaseStorageModal;
	}
</script>

<Card size="xl" title="Contract Manager" description="Deploy your Smart Contract" class="mb-20">
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
						<a
							href="{$ExplorerURL}/en/contract?id={contractData.name}"
							target="_blank"
							rel="noreferrer"
							id="contractName"
							class="block py-2.5 px-0 w-full text-sm text-blue-500 hover:text-blue-700 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						>
							{contractData.name}
						</a>

						<label
							for="subject"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>Contract Name</label
						>
					</div>
					<div class="relative z-0 w-full mb-6 group">
						<a
							href="{$ExplorerURL}/en/address?id={contractData.address}"
							target="_blank"
							rel="noreferrer"
							id="contractAddress"
							class="block py-2.5 px-0 w-full text-sm text-blue-500 hover:text-blue-700 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						>
							{contractData.address}
						</a>
						<label
							for="subject"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>Contract Address</label
						>
					</div>

					{#if tokenDataInformation}
						<div class="relative z-0 w-full mb-6 group">
							<a
								href="{$ExplorerURL}/en/address?id={tokenDataInformation.owner}"
								target="_blank"
								rel="noreferrer"
								id="contractAddress"
								class="block py-2.5 px-0 w-full text-sm text-blue-500 hover:text-blue-700 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							>
								{tokenDataInformation.owner}
							</a>
							<label
								for="subject"
								class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
								>Contract Owner</label
							>
						</div>
					{/if}
				</div>

				{#if contractInformation}
					<h5 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Contract Storage</h5>

					<div class="grid md:grid-cols-2 md:gap-6">
						<div class="relative z-0 w-full mb-2 group">
							<a
								id="contractName"
								class="block py-2.5 px-0 w-full text-sm text-black hover:text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							>
								{#if contractInformation.storage.available < 1024 * 1024}
									{(contractInformation.storage.available / 1024).toFixed(2)} Kb
								{:else if contractInformation.storage.available < 1024 * 1024 * 1024}
									{(contractInformation.storage.available / 1024 / 1024).toFixed(2)} Mb
								{:else}
									{(contractInformation.storage.available / 1024 / 1024 / 1024).toFixed(2)} Gb
								{/if}
							</a>

							<label
								for="subject"
								class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
								>Storage Available</label
							>
						</div>
						<div class="relative z-0 w-full mb-2 group">
							<a
								id="contractName"
								class="block py-2.5 px-0 w-full text-sm text-black hover:text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							>
								{#if contractInformation.storage.used < 1024 * 1024}
									{(contractInformation.storage.used / 1024).toFixed(2)} Kb
								{:else if contractInformation.storage.used < 1024 * 1024 * 1024}
									{(contractInformation.storage.used / 1024 / 1024).toFixed(2)} Mb
								{:else}
									{(contractInformation.storage.used / 1024 / 1024 / 1024).toFixed(2)} Gb
								{/if}
							</a>

							<label
								for="subject"
								class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
								>Storage Used</label
							>
						</div>
					</div>

					{#if tokenDataInformation && link}
						{#if link.account && link.account.address == tokenDataInformation.owner}
							<div class="mb-6">
								<button
									on:click={toggleIncreaseStorage}
									class="p-3 bg-cyan-500 hover:bg-cyan-700 rounded-md text-white"
									>Increase Storage</button
								>
							</div>
						{/if}
					{/if}
				{/if}

				{#if tokenDataInformation}
					<h5 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Token Information</h5>
					<div class="grid md:grid-cols-2 md:gap-6">
						<div class="relative z-0 w-full mb-2 group">
							<a
								id="contractName"
								class="block py-2.5 px-0 w-full text-sm text-black hover:text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							>
								{tokenDataInformation.symbol}
							</a>

							<label
								for="subject"
								class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
								>Token Symbol</label
							>
						</div>

						<div class="relative z-0 w-full mb-2 group">
							<a
								id="contractName"
								class="block py-2.5 px-0 w-full text-sm text-black hover:text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							>
								{tokenDataInformation.name}
							</a>

							<label
								for="subject"
								class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
								>Token Name</label
							>
						</div>
						<div class="relative z-0 w-full mb-2 group">
							<a
								id="contractName"
								class="block py-2.5 px-0 w-full text-sm text-black hover:text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							>
								{tokenDataInformation.maxSupply}
							</a>

							<label
								for="subject"
								class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
								>Token Max Supply Available</label
							>
						</div>
						<div class="relative z-0 w-full mb-2 group">
							<a
								id="contractName"
								class="block py-2.5 px-0 w-full text-sm text-black hover:text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							>
								{tokenDataInformation.currentSupply}
							</a>

							<label
								for="subject"
								class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
								>Token Current Supply</label
							>
						</div>
						<div class="relative z-0 w-full mb-2 group">
							<a
								id="contractName"
								class="block py-2.5 px-0 w-full text-sm text-black hover:text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							>
								{tokenDataInformation.burnedSupply}
							</a>

							<label
								for="subject"
								class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
								>Token Burned Supply</label
							>
						</div>
						<div class="relative z-0 w-full mb-2 group">
							<a
								id="contractName"
								class="block py-2.5 px-0 w-full text-sm text-black hover:text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							>
								{tokenDataInformation.decimals}
							</a>

							<label
								for="subject"
								class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
								>Token Decimals</label
							>
						</div>
						<div class="relative z-0 w-full mb-2 group">
							<a
								id="contractName"
								class="block py-2.5 px-0 w-full text-sm text-black hover:text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							>
								{tokenDataInformation.flags}
							</a>

							<label
								for="subject"
								class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
								>Token Flags</label
							>
						</div>
					</div>
				{/if}
				<h5 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Contract Balances</h5>

				<div class="grid md:grid-cols-3 md:gap-6 max-h-50 overflow-y-scroll my-2 pt-2">
					{#each balances as balance}
						<div class="relative z-0 w-full mb-6 group">
							<span
								class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							>
								{(parseInt(balance.amount) / 10 ** balance.decimals).toFixed(2)}</span
							>
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

{#if increaseStorageModal}
	<IncreaseStorageContract
		bind:contractAddress={contractData.address}
		on:close={toggleIncreaseStorage}
	/>
{/if}
