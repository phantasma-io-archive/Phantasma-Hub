<script lang="ts">
	import Card from '$lib/Components/Card/Card.svelte';
	import { LinkWallet } from '$lib/store';
	import moment from 'moment';
	import type { PhantasmaLink } from 'phantasma-ts';
	import { Address, Base16, Transaction } from 'phantasma-ts/src';
	import { createTransaction } from '$lib/Components/Wallet/MultiSignatureCommands';
	let subject;
	let listOfUsers = [];
	let numberOfUsers = 2;
	let transactionScript = '';
	let nexusName = 'mainnet';
	let chainName = 'main';
	let payload = '';
	let transaction: Transaction = new Transaction(
		nexusName,
		chainName,
		transactionScript,
		new Date(),
		''
	);
	let startTime: Date = new Date(Date.now() + 1000 * 60 * 60 * 24);
	let startTimeStr: string = moment(startTime.getTime()).format(
		moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
	);

	let connected = false;
	let Link: PhantasmaLink;
	LinkWallet.subscribe((link: any) => {
		Link = link;
		if (link.account) {
			connected = true;
			try {
				listOfUsers.push(link.account.address);
			} catch (e) {
				//console.log(e);
			}
		} else connected = false;
	});

	function addUser() {
		numberOfUsers++;
	}

	function handleUserChange(e) {
		if (Address.IsValidAddress(e.srcElement.value)) {
			e.target.classList.remove('focus:border-red-500');
			e.target.classList.remove('border-red-500');
			e.target.classList.remove('border-gray-300');
			e.target.classList.remove('dark:border-gray-600');

			e.target.classList.add('border-green-600');
			e.target.classList.add('focus:border-green-500');
		} else {
			e.target.classList.add('focus:border-red-500');
			e.target.classList.add('border-red-500');
			e.target.classList.remove('dark:border-gray-600');
			e.target.classList.remove('border-gray-300');
			if (e.target.value == '') {
				e.target.classList.remove('border-red-500');
				e.target.classList.remove('dark:border-red-500');
				e.target.classList.add('dark:border-gray-600');
				e.target.classList.add('border-gray-300');
			}
		}
		//listOfUsers[e.detail.index] = e.detail.value;
	}

	/*function handleTransactionOnChange(e) {
		transactionScript = e.detail.value;
		let decoded = Base16.decodeUint8Array(transactionScript);
		transaction = Transaction.Unserialize(decoded);
	}*/

	function createMultiSignature() {
		console.log('createMultiSignature');
		transaction.payload = Base16.encode(payload);
		transaction.nexusName = nexusName;
		transaction.chainName = chainName;
		transaction.script = transactionScript;
		transaction.expiration = new Date(startTimeStr);
		console.log({ transaction });
		createTransaction(subject, transaction, listOfUsers);
	}
</script>

<div class="flex flex-wrap -mx-3 my-3">
	<Card
		size="xl"
		title="Create Multi-Signature Transaction"
		description="Create a Multi-Signature Transaction to be able to do something together."
		class="mb-20"
	>
		<div class="my-1">
			<form on:submit|preventDefault={() => null}>
				<div class="grid md:grid-cols-2 md:gap-6">
					<div class="relative z-0 w-full mb-6 group">
						<input
							type="text"
							name="subject"
							id="subject"
							bind:value={subject}
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
						/>
						<label
							for="subject"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>Subject</label
						>
					</div>

					<div class="relative z-0 w-full mb-6 group">
						<input
							type="datetime-local"
							name="startTime"
							id="startTime"
							bind:value={startTimeStr}
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
						/>
						<label
							for="startTime"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>Transaction Expiration Time</label
						>
					</div>
				</div>

				<div class="grid md:grid-cols-2 md:gap-6">
					<div class="relative z-0 w-full mb-6 group">
						<input
							type="text"
							name="nexusName"
							id="nexusName"
							bind:value={nexusName}
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
						/>
						<label
							for="nexusName"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>Nexus (mainnet / testnet / simnet)</label
						>
					</div>

					<div class="relative z-0 w-full mb-6 group">
						<input
							type="text"
							name="chainName"
							id="chainName"
							bind:value={chainName}
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
						/>
						<label
							for="chainName"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>Chain</label
						>
					</div>
				</div>

				<div class="grid md:grid-cols md:gap-6">
					<div class="relative z-0 w-full mb-6 group">
						<input
							type="text"
							name="payload"
							id="payload"
							bind:value={payload}
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
						/>
						<label
							for="payload"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>Payload</label
						>
					</div>
				</div>

				<div class="grid md:grid-cols">
					<div class="relative z-0 w-full mb-6 group">
						<textarea
							name="script"
							id="script"
							rows="7"
							bind:value={transactionScript}
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
						/>
						<label
							for="script"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>Transaction Script</label
						>
					</div>
				</div>

				<hr class="my-6" />

				<div>
					<h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
						Users to Multi-Signature
					</h3>
					<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
						Add user addresses to sign the transaction.
					</p>
					<button
						on:click={addUser}
						class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
                    focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>
						Add more Users
					</button>
				</div>

				<div class="grid md:grid-cols md:gap-6 my-4">
					{#each Array(numberOfUsers) as _, index (index)}
						<div class="relative z-0 w-full mb-6 group">
							<input
								type="text"
								id="option-{index}"
								bind:value={listOfUsers[index]}
								on:change={handleUserChange}
								class="block py-2.5 px-0 w-full text-sm
                     border-b-2 border-solid
                     text-gray-900 bg-transparent border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
								placeholder=" "
								required
							/>
							<label
								for="option-{index}"
								class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100
                    peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
								>User Address- {index}</label
							>
						</div>
					{/each}
				</div>

				<hr class="my-6" />

				{#if connected}
					<button
						on:click={createMultiSignature}
						class="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none
             focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
						>Create</button
					>
				{:else}
					<h6 class="text-center">Connect to Wallet.</h6>
				{/if}
			</form>
		</div>
	</Card>
</div>
