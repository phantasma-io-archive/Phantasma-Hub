<script lang="ts">
	import Card from '$lib/Components/Card/Card.svelte';
	import { LinkWallet } from '$lib/store';
	import moment from 'moment';
	import type { PhantasmaLink } from 'phantasma-ts';
	import { Address, Base16, Transaction } from 'phantasma-ts/src';
	import { createDAO } from '$lib/Components/Wallet/DAOCommands';
	import { NotificationError, NotificationWarning } from '../Notification/NotificationsBuilder';
	let org_id;
	let org_name;
	let org_script;
	let org_id_error: boolean = true;
	let org_name_error: boolean = true;
	let org_script_error: boolean = false;

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

	function IsValidOrganizationID(): boolean {
		if (!org_id) {
			return false;
		}

		if (org_id_error) {
			return false;
		}

		return true;
	}

	function IsValidOrganizationName() {
		if (!org_name) {
			return false;
		}

		if (isEmpty(org_name)) {
			return false;
		}

		if (org_name_error) {
			return false;
		}

		return true;
	}

	function onChangeDAOName(e) {
		org_name_error = false;
		if (isEmpty(org_name)) {
			org_name_error = true;
			return;
		}
	}

	function createDAOCall() {
		if (!IsValidOrganizationID()) {
			NotificationWarning('DAO Warning!', 'The <b>Organization ID</b> is not valid.');
			return;
		}

		if (!IsValidOrganizationName()) {
			NotificationWarning('DAO Warning!', 'The <b>Organization Name</b> is not valid.');
			return;
		}

		createDAO(org_id, org_name, org_script);
	}

	function isEmpty(str: string): boolean {
		return !str || 0 === str.length;
	}

	function isAllLowerCase(str: string): boolean {
		return /^[a-z\s_]*$/.test(str);
	}

	function hasWhitespace(s: string): boolean {
		return /\s/.test(s);
	}

	function isValidString(s: string): boolean {
		return /^[a-z0-9_-]*$/i.test(s);
	}

	function onChangeDAOID(e) {
		org_id_error = false;

		if (e.target.value) {
			if (isEmpty(e.target.value)) {
				org_id_error = true;
				return;
			}

			// Check if the ID is valid
			if (!isAllLowerCase(e.target.value)) {
				org_id_error = true;
				return;
			}

			if (hasWhitespace(e.target.value)) {
				org_id_error = true;
				return;
			}

			if (!isValidString(e.target.value)) {
				org_id_error = true;
				return;
			}
		}
	}
</script>

<Card
	size="xl"
	title="Create Multi-Signature Transaction"
	description="Create a Multi-Signature Transaction to be able to do something together."
	class="mb-20"
>
	<div class="my-1">
		<small class="text-gray-500 dark:text-gray-400">
			Organization ID should be lowercase and without spaces or special characters.
		</small>
		<form on:submit|preventDefault={() => null}>
			<div class="grid md:grid-cols-2 md:gap-6">
				<div class="relative z-0 w-full mb-6 group">
					<input
						type="text"
						name="id"
						id="id"
						bind:value={org_id}
						on:change={onChangeDAOID}
						on:keydown={onChangeDAOID}
						class:error_org_id={org_id_error}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
						on:change={onChangeDAOName}
						on:keydown={onChangeDAOName}
						class:error_org_id={org_name_error}
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
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
				<!--class:disable_button={org_script_error || org_id_error || org_name_error} -->
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

<style>
	.error_org_id {
		color: red;
	}

	.disable_button {
		pointer-events: none;
		opacity: 0.4;
	}
</style>
