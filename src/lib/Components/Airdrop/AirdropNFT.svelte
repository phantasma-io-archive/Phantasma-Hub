<script type="ts">
	import Card from '$lib/Components/Card/Card.svelte';
	import {
		PhantasmaAPIClient,
		allContracts,
		consoleOutput,
		contractMethod,
		contractName
	} from '$lib/store';
	import {
		Base16,
		type ABIMethod,
		type ABIParameter,
		Address,
		PhantasmaAPI
	} from 'phantasma-ts/core';
	import { InvokeRawScript, SendRawTransaction } from '$lib/Components/Contract/ContractCommands';
	import { onMount } from 'svelte';
	let api: PhantasmaAPI;

	let _contractName: string;

	let symbol: string;
	let selectedToken: string;
	let amount: number;
	let amountMin: number;
	let amountMax: number;
	let random: number;
	let userDistribution: number;
	let numberOfUsers = 0;
	let args = [];
	let userAddressessRAW = '';
	let userAddressess: Array<any> = [];
	let numberOfInvalidAddresses = 0;

	let _tokens: Array<string> = [];

	onMount(async () => {
		await loadContracts();
	});

	async function loadContracts() {
		let tokens = await api.getTokens();
		let localContracts = [];
		tokens.forEach((token) => {
			if (!token.flags.includes('Fungible')) localContracts.push(token.symbol);
		});
		//localContracts = contracts;
		_tokens = localContracts;
	}

	PhantasmaAPIClient.subscribe((value) => {
		api = value;
	});

	function AirdropNFTTokens() {
		let x = 0;
	}

	function onListUsersChange(e) {
		let listBefore = e.target.value.split(',');
		numberOfInvalidAddresses = 0;
		userAddressess = [];
		for (let addr of listBefore) {
			addr = addr.trim();
			if (addr.length != 34) {
				//console.log('Invalid address: ' + addr);
				numberOfInvalidAddresses++;
				continue;
			}

			if (!Address.IsValidAddress(addr)) {
				//console.log('Invalid address: ' + addr);
				numberOfInvalidAddresses++;
				continue;
			}

			userAddressess.push(addr);
		}
	}

	function onTypeChange() {
		console.log(random);
	}

	function onSelectedTokenChange() {
		console.log(selectedToken);
	}
</script>

<Card
	size="xl"
	title="Airdrop Non-Fungible Tokens"
	description="Airdrop non-fungible tokens to a list of users."
>
	<div class="my-1">
		<form on:submit|preventDefault={() => null}>
			<div class="grid md:grid-cols-3 md:gap-6">
				<div class="relative z-0 w-full mb-6 group">
					<select
						name="token"
						id="token"
						bind:value={selectedToken}
						on:change={onSelectedTokenChange}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
					>
						<option value selected>No Token selected.</option>
						{#each _tokens as token}
							<option value={token}>
								{token}
							</option>
						{/each}
					</select>
					<label
						for="token"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>Token (Symbol)</label
					>
				</div>
				<div class="relative z-0 w-full mb-6 group">
					<select
						name="typedist"
						bind:value={random}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						on:change={onTypeChange}
					>
						<option value="1">Random amounts (Between a threshold)</option>
						<option value="0">Specific amount (Per Address)</option>
					</select>
					<label
						for="typedist"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>Type of Amount distribution</label
					>
				</div>
				<div class="relative z-0 w-full mb-6 group">
					<select
						name="typedist"
						bind:value={userDistribution}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						on:change={onTypeChange}
					>
						<option value="0">1 - 1 Distribution</option>
						<option value="1">Random Distribution (No Limit)</option>
					</select>
					<label
						for="typedist"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>Type of User distribution</label
					>
				</div>
			</div>

			{#if random == 1}
				<div class="grid md:grid-cols-2 md:gap-6">
					<div class="relative z-0 w-full mb-6 group">
						<input
							type="number"
							name="amountMin"
							id="amountMin"
							bind:value={amountMin}
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
						/>
						<label
							for="amountMin"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>Minimum amount (Per Address)</label
						>
					</div>

					<div class="relative z-0 w-full mb-6 group">
						<input
							type="number"
							name="amountMax"
							id="amountMax"
							bind:value={amountMax}
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
						/>
						<label
							for="amountMax"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>Maximum amount (Per Address)</label
						>
					</div>
				</div>
			{:else}
				<div class="grid md:grid-cols">
					<div class="relative z-0 w-full mb-6 group">
						<input
							type="number"
							name="amount"
							id="amount"
							bind:value={amount}
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
						/>
						<label
							for="amount"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>Specific amount (Per Address)</label
						>
					</div>
				</div>
			{/if}

			{#if userDistribution == 0}
				<div class="grid md:grid-cols">
					<div class="relative z-0 w-full mb-6 group">
						<input
							type="number"
							name="numberOfUsers"
							id="numberOfUsers"
							bind:value={numberOfUsers}
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
						/>
						<label
							for="numberOfUsers"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>Total number of Address to distribute.</label
						>
					</div>
				</div>
			{/if}

			<div class="grid md:grid-cols">
				<div class="relative z-0 w-full mb-6 group">
					<textarea
						name="script"
						id="script"
						rows="7"
						bind:value={userAddressessRAW}
						on:change={onListUsersChange}
						on:keypress={onListUsersChange}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
					/>
					<label
						for="script"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>User Addresses</label
					>
				</div>
			</div>

			<div class="grid md:grid-cols-2 md:gap-2">
				<div>
					<h6 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
						Number of Valid Addressess: {userAddressess.length}
					</h6>
				</div>

				<div>
					<h6 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
						Number of Invalid Addressess: {numberOfInvalidAddresses}
					</h6>
				</div>
			</div>

			<hr class="my-1" />

			<div>
				<h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Actions</h3>
				<button
					on:click={AirdropNFTTokens}
					class="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none
         focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>Airdrop Non-Fungible Tokens</button
				>
			</div>
		</form>
	</div>
</Card>
