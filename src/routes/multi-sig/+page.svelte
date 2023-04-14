<script type="ts">
	import { LinkWallet, PhantasmaAPIClient } from '$lib/store';
	import {
		createTransaction,
		getTransactionMultiSig
	} from '$lib/Components/Wallet/MultiSignatureCommands';

	import Modal from '$lib/Components/Modals/Modal.svelte';
	import Icon from '@iconify/svelte';
	import Card from '$lib/Components/Card/Card.svelte';
	import CreateMultiSignature from '$lib/Components/MultiSignature/CreateMultiSignature.svelte';
	import MultiSignatureView from '$lib/Components/MultiSignature/MultiSignatureView.svelte';
	import { Base16, VMObject, type PhantasmaAPI } from 'phantasma-ts/core';
	import { PBinaryReader, Transaction } from 'phantasma-ts/core';
	import type { PhantasmaLink } from 'phantasma-ts';

	let transactionSelected: boolean = false;
	let createTransactionOpen: boolean = false;
	let subject = '';

	let api: PhantasmaAPI;
	PhantasmaAPIClient.subscribe((value) => {
		api = value;
	});

	let Link: PhantasmaLink;
	LinkWallet.subscribe((value) => {
		Link = value;
	});

	let transaction: Transaction | null;

	function handleResultTransaction(result: string) {
		let uintArray = Base16.decodeUint8Array(result);
		let reader = new PBinaryReader(Base16.decodeUint8Array(result));
		let vm = VMObject.FromBytes(reader);
		let localTransaction = new Transaction('', '', '', new Date(), '');
		//localTransaction.UnserializeData(reader);
		let bytes = Base16.decodeUint8Array(vm.AsByteArray() as unknown as string);
		let readerBytes = new PBinaryReader(bytes);
		localTransaction.UnserializeData(readerBytes);
		transactionSelected = true;
		transaction = localTransaction;
	}

	async function findMultiSig() {
		/*let hash = '75F6DD6651823DB1B3DBEEAE04F9C8B0675A37BB7B1F5428FB2B843907B6F699';
		let result = await (await api.getTransaction(hash)).result;
		let uintArray = Base16.decodeUint8Array(result);
		let reader = new PBinaryReader(Base16.decodeUint8Array(result));
		let vm = VMObject.FromBytes(reader);
		let localTransaction = new Transaction('', '', '', new Date(), '');
		//localTransaction.UnserializeData(reader);
		let bytes = Base16.decodeUint8Array(vm.AsByteArray() as unknown as string);
		let readerBytes = new PBinaryReader(bytes);
		localTransaction.UnserializeData(readerBytes);
		transactionSelected = true;
		transaction = localTransaction;

		return;*/
		let localtransaction = getTransactionMultiSig(subject, (result) => {
			//transaction = result.result;
			handleResultTransaction(result.result);
			console.log('transaction:', { transaction });
			if (transaction != null) {
				transactionSelected = true;
			}
		});
	}
</script>

<div class="mb-4 px-6 mx-auto">
	<h5>Multi Signature</h5>

	<div class="flex flex-wrap -mx-3">
		<Card size="md">
			<div class="flex-none w-2/3 max-w-full px-3">
				<div>
					<p class="mb-0 font-sans font-semibold leading-normal text-base">
						Search Multi-Signature Transaction
					</p>
					<h5 class="mb-0 font-normal text-sm">Search for a Multi-Signature transaction.</h5>
				</div>
				<div>
					<form>
						<div class="mb-6">
							<input
								type="text"
								bind:value={subject}
								id="Subject"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="Subject"
								required
							/>
						</div>
						<div>
							<button
								class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
								on:click={findMultiSig}>Search</button
							>
						</div>
					</form>
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
						icon="fa-solid:file-signature"
					/>
				</div>
			</div>
		</Card>
		<Card size="md">
			<div class="flex-none w-2/3 max-w-full px-3">
				<div>
					<p class="mb-0 font-sans font-semibold leading-normal text-base">
						Create Multi-Signature Transaction
					</p>
					<h5 class="mb-0 font-normal text-sm">Create a Multi-Signature transaction.</h5>
				</div>
				<div>
					<button
						class:create-transaction={!createTransactionOpen}
						class:close-transaction={createTransactionOpen}
						class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400"
						on:click={() => (createTransactionOpen = !createTransactionOpen)}
					>
						{#if createTransactionOpen}
							Close
						{:else}
							Create
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
						icon="ion:create-outline"
					/>
				</div>
			</div>
		</Card>
	</div>

	{#if createTransactionOpen}
		<CreateMultiSignature />
	{/if}

	{#if transactionSelected}
		<MultiSignatureView {transaction} {subject} />
	{/if}
</div>

<style>
	.create-transaction {
		@apply bg-green-500;
	}

	.close-transaction {
		@apply bg-red-500;
	}
</style>
