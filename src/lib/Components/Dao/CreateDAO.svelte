<script type="ts">
	import Card from '$lib/Components/Card/Card.svelte';
	import { LinkWallet } from '$lib/store';
	import moment from 'moment';
	import type { PhantasmaLink } from 'phantasma-ts';
	import { Address, Base16, Transaction } from 'phantasma-ts/core';
	import { createDAO } from '$lib/Components/Wallet/DAOCommands';
	let org_id;
	let org_name;
	let org_script;

	let connected = false;

	let Link: PhantasmaLink;
	LinkWallet.subscribe((link: any) => {
		Link = link;
		if (link.account) connected = true;
		else connected = false;
	});

	/*function handleTransactionOnChange(e) {
		transactionScript = e.detail.value;
		let decoded = Base16.decodeUint8Array(transactionScript);
		transaction = Transaction.Unserialize(decoded);
	}*/

	function createDAOCall() {
		console.log('createDAO');
		createDAO(org_id, org_name, org_script);
	}
</script>

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
						name="id"
						id="id"
						bind:value={org_id}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
					/>
					<label
						for="subject"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>Organization ID</label
					>
				</div>

				<div class="relative z-0 w-full mb-6 group">
					<input
						type="text"
						name="name"
						id="name"
						bind:value={org_name}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
					/>
					<label
						for="subject"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>Organization Name</label
					>
				</div>
			</div>

			<div class="grid md:grid-cols">
				<div class="relative z-0 w-full mb-6 group">
					<textarea
						name="script"
						id="script"
						rows="7"
						bind:value={org_script}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
					/>
					<label
						for="script"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>Organization Script</label
					>
				</div>
			</div>

			<hr class="my-6" />

			{#if connected}
				<button
					on:click={createDAOCall}
					class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none
             focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
					>Create DAO</button
				>
			{:else}
				<h6 class="text-center">Connect to Wallet.</h6>
			{/if}
		</form>
	</div>
</Card>
