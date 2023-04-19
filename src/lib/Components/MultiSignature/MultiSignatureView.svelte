<script lang="ts">
	import Card from '$lib/Components/Card/Card.svelte';
	import { LinkWallet } from '$lib/store';
	import moment from 'moment';
	import type { PhantasmaLink } from 'phantasma-ts';
	import {
		Address,
		Base16,
		Ed25519Signature,
		PBinaryReader,
		Signature,
		Transaction
	} from 'phantasma-ts/core';
	import { time_ranges_to_array } from 'svelte/internal';
	import {
		addSignatureTransaction,
		createTransaction,
		signTransaction
	} from '../Wallet/MultiSignatureCommands';
	export let transaction: Transaction | null;
	export let subject: string;
	let listOfSignatures: Array<string> = [];
	let numberOfSignatures = 1;
	let numberOfNeededSignatures = 0;
	let transactionScript = '';
	let nexusName = 'mainnet';
	let chainName = 'main';
	let payload = '';
	let localTransaction: Transaction = new Transaction(
		nexusName,
		chainName,
		transactionScript,
		new Date(),
		''
	);

	if (transaction != null) {
		localTransaction = transaction;
	}
	let startTime: Date = new Date(Date.now() + 1000 * 60 * 60 * 24);
	let startTimeStr: string = moment(startTime.getTime()).format(
		moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
	);

	let Link: PhantasmaLink;
	LinkWallet.subscribe((link: any) => {
		Link = link;
	});

	/*function handleTransactionOnChange(e) {
		transactionScript = e.detail.value;
		let decoded = Base16.decodeUint8Array(transactionScript);
		transaction = Transaction.Unserialize(decoded);
	}*/

	function loadValues() {
		transactionScript = localTransaction?.script;
		nexusName = localTransaction?.nexusName;
		chainName = localTransaction?.chainName;
		payload = Base16.decode(localTransaction?.payload);
		startTimeStr = moment(localTransaction?.expiration.getTime()).format(
			moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
		);

		listOfSignatures = localTransaction.signatures.map((signature) => {
			return Base16.encodeUint8Array(signature.Bytes);
		});
		numberOfSignatures = localTransaction.signatures.length;
	}

	function sign() {
		console.log('Signing transaction');
		localTransaction.payload = Base16.encode(payload);
		localTransaction.nexusName = nexusName;
		localTransaction.chainName = chainName;
		localTransaction.script = transactionScript;
		localTransaction.expiration = new Date(startTimeStr);

		signTransaction(localTransaction, function (signature) {
			let signatureSigned: Ed25519Signature = new Ed25519Signature();
			let reader = new PBinaryReader(Base16.decodeUint8Array(signature.signature));
			signatureSigned.UnserializeData(reader);
			console.log('Bytes:', signatureSigned.Bytes.length);
			localTransaction.signatures.push(signatureSigned);
			addSignatureTransaction(subject, signatureSigned);
		});
		//createTransaction(subject, localTransaction, listOfUsers);
	}

	function ExecuteTransaction() {
		console.log('Executing transaction');
	}

	loadValues();
	console.log(transaction);
</script>

<div class="flex flex-wrap -mx-3 my-3">
	<Card
		size="xl"
		title="View Multi-Signature Transaction"
		description="Signe a Multi-Signature Transaction to be able to do something together."
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
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
							disabled
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
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
							disabled
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
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
							disabled
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
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
							disabled
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
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
							disabled
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
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
							disabled
						/>
						<label
							for="script"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>Transaction Script</label
						>
					</div>
				</div>

				<hr class="my-6" />

				{#if numberOfSignatures > 0}
					<div>
						<h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
							Transaction Signatures
						</h3>
					</div>

					<div class="grid md:grid-cols md:gap-6 my-4">
						{#each Array(numberOfSignatures) as _, index (index)}
							<div class="relative z-0 w-full mb-6 group">
								<input
									type="text"
									id="option-{index}"
									bind:value={listOfSignatures[index]}
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
									>Signature - {index}</label
								>
							</div>
						{/each}
					</div>
				{/if}

				{#if numberOfSignatures >= numberOfNeededSignatures}
					<button
						on:click={ExecuteTransaction}
						class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
		focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>Execute Transaction</button
					>
				{:else}
					<button
						on:click={sign}
						class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
				focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>Sign</button
					>
				{/if}
			</form>
		</div>
	</Card>
</div>
