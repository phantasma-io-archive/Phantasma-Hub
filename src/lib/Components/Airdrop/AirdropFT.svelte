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
		PhantasmaAPI,
		type Token
	} from 'phantasma-ts/core';
	import { onMount } from 'svelte';
	import { AirdropFT } from './AirdropCommands';
	import { NotificationError } from '../Notification/NotificationsBuilder';
	let api: PhantasmaAPI;

	let _contractName: string;

	let userList: Array<{ user; amount }> = [];
	let selectedToken: string;
	let selectedTokenDetails: Token;
	let amount: number;
	let amountMin: number;
	let amountMax: number;
	let amountType: number;
	let userDistribution: number;
	let numberOfUsers = 0;
	let userAddressessRAW = '';
	let userAddressess: Array<any> = [];
	let numberOfInvalidAddresses = 0;
	let numberOfRepeatedAddresses = 0;
	let totalAmount = 0;

	let _tokens: Array<string> = [];
	let tokensDetails: Array<Token> = [];

	onMount(async () => {
		await loadContracts();
	});

	async function loadContracts() {
		console.log('Loading contracts...');
		let tokens = await api.getTokens();
		tokensDetails = tokens;
		let localContracts: Array<string> = [];
		tokens.forEach((token: Token) => {
			if (token.flags.includes('Fungible')) localContracts.push(token.symbol);
		});
		//localContracts = contracts;
		_tokens = localContracts;
	}

	PhantasmaAPIClient.subscribe((value) => {
		api = value;
	});

	function SetupUsersRandom() {
		for (let user of userAddressess) {
			let user = userAddressess;
			let amountToUser = 0;
			switch (amountType) {
				case 0:
					amountToUser = amount;
					break;
				case 1:
					amountToUser = Math.floor(Math.random() * (amountMax - amountMin + 1)) + amountMin;
					break;
			}
			userList.push({ user: user, amount: amountToUser * 10 ** selectedTokenDetails.decimals });
		}

		totalAmount = 0;
		for (let user of userList) {
			totalAmount += user.amount;
		}
	}

	function setupUsersList1To1() {
		for (let i = 0; i < numberOfUsers; i++) {
			if (i >= userAddressess.length) break;
			let user = userAddressess[i];
			let amountToUser = 0;
			if (amountType == 0) {
				amountToUser = amount;
			} else if (amountType == 1) {
				amountToUser = Math.floor(Math.random() * (amountMax - amountMin + 1)) + amountMin;
			}
			userList.push({ user: user, amount: amountToUser * 10 ** selectedTokenDetails.decimals });
		}

		totalAmount = 0;
		for (let user of userList) {
			console.log(user);
			totalAmount += user.amount;
		}
	}

	function AirdropFTUsers() {
		if (!selectedToken) {
			NotificationError('Airdrop Error!', 'Please select a token to airdrop.');
			return;
		}
		userList = [];

		if (userDistribution == 0) {
			console.log('User Distribution: Equal');
			setupUsersList1To1();
		} else if (userDistribution == 1) {
			console.log('User Distribution: Random');
			SetupUsersRandom();
		}

		AirdropFT(selectedToken, userList, totalAmount);
	}

	function AirdropFTAll() {
		AirdropFTUsers();
	}

	function AirdropFTSingle() {
		let newUserAddressess: Array<string> = [];
		for (let user of userAddressess) {
			if (!newUserAddressess.includes(user)) newUserAddressess.push(user);
		}
		userAddressess = newUserAddressess;
		AirdropFTUsers();
	}

	function onListUsersChange(e) {
		numberOfRepeatedAddresses = 0;
		let listBefore = e.target.value.split(',');
		numberOfInvalidAddresses = 0;
		userAddressess = [];
		for (let addr of listBefore) {
			addr = addr.trim();
			if (!Address.IsValidAddress(addr)) {
				numberOfInvalidAddresses++;
				continue;
			}

			if (userAddressess.includes(addr)) {
				numberOfRepeatedAddresses++;
			}

			userAddressess.push(addr);
		}
	}

	function onTypeChange() {
		console.log(amountType);
	}

	function onSelectedTokenChange() {
		for (let token of tokensDetails) {
			if (token.symbol == selectedToken) {
				selectedTokenDetails = token;
				break;
			}
		}
		console.log(selectedToken);
	}

	function onChangeNumberOfUsers() {
		console.log(numberOfUsers);
	}
</script>

<Card
	size="xl"
	title="Airdrop Fungible Tokens"
	description="Airdrop fungible tokens to a list of users."
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
						bind:value={amountType}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						on:change={onTypeChange}
					>
						<option value="0">Specific amount (Per Address)</option>
						<option value="1">Random amounts (Between a threshold)</option>
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

			{#if amountType == 1}
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
							type="text"
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
							on:change={onChangeNumberOfUsers}
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

			<div class="flex justify-center content-between gap-16">
				<div class="bg-sky-100 rounded p-2 text-center">
					<h6 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
						Number of Valid Addressess
					</h6>
					<p>{userAddressess.length}</p>
				</div>

				<div class="bg-sky-100 rounded p-2 text-center">
					<h6 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
						Number of Receiving Addressess
					</h6>
					<p>{userAddressess.length}</p>
				</div>

				<div class="bg-sky-100 rounded p-2 text-center">
					<h6 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
						Number of Repeated Addressess
					</h6>
					<p>{numberOfRepeatedAddresses}</p>
				</div>

				<div class="bg-sky-100 rounded p-2 text-center">
					<h6 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
						Number of Invalid Addressess
					</h6>
					<p>{numberOfInvalidAddresses}</p>
				</div>
			</div>

			<hr class="my-6 border-t border-gray-400 border-solid" />

			<div>
				<h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Actions</h3>
				<button
					on:click={AirdropFTAll}
					class="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none
         focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>Airdrop Fungible Tokens With Repeated Addressess</button
				>

				<button
					on:click={AirdropFTSingle}
					class="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none
         focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>Airdrop Fungible Tokens Without Repeated Addressess</button
				>
			</div>
		</form>
	</div>
</Card>
