<script lang="ts">
	import Modal from '$lib/Components/Modals/Modal.svelte';
	import { ModalType } from '$lib/Components/Modals/ModalType';
	import Icon from '@iconify/svelte';

	import { LinkWallet, LinkDapp } from '$lib/store';
	import { PhantasmaLink } from 'phantasma-ts';
	import { createEventDispatcher, onDestroy } from 'svelte';

	import { connectWallet } from '$lib/store';
	import { Address, type Organization } from 'phantasma-ts/core';
	import { removeMember } from '../Wallet/DAOCommands';

	let _modalType = ModalType.Popup;

	export let scriptRemove = '';
	export let addressRemove: string = '';
	export let dao: Organization;
	export let daoAddress: Address;
	function removeMemberDao() {
		removeMember(dao.id, daoAddress, Address.FromText(addressRemove));
		return scriptRemove;
	}
	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');
</script>

<Modal title="Remove Member" modalType={_modalType} on:close={close}>
	<!-- Modal header -->
	<div class="p-6 w-auto">
		<h6>Are you sure you want to remove this member?</h6>
		<p>{addressRemove}</p>
		<form on:submit|preventDefault={() => null}>
			<div class="grid md:grid-cols md:gap-6">
				<div class="grid md:grid-cols">
					<div class="relative z-0 w-full mb-6 group">
						<textarea
							name="script"
							id="script"
							rows="7"
							bind:value={scriptRemove}
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-solid  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
						/>
						<label
							for="script"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>Remove Address Script</label
						>
					</div>
				</div>
			</div>
		</form>
	</div>

	<!-- Modal footer -->
	<div class="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
		{#if dao.members.length <= 1}
			<button
				on:click={removeMemberDao}
				class="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none
             focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 m-4"
				>Execute Call</button
			>
		{/if}
		<button
			on:click={close}
			class="text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none
             focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
			>Close</button
		>
	</div>
</Modal>
