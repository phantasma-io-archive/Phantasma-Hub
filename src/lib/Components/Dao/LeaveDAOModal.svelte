<script lang="ts">
	import Modal from '$lib/Components/Modals/Modal.svelte';
	import { ModalType } from '$lib/Components/Modals/ModalType';
	import Icon from '@iconify/svelte';

	import { LinkWallet, LinkDapp } from '$lib/store';
	import { PhantasmaLink } from 'phantasma-ts';
	import { createEventDispatcher, onDestroy } from 'svelte';

	import { ConnectWallet } from '$lib/store';
	import type { Organization } from 'phantasma-ts/core';
	import { leaveDAO } from '../Wallet/DAOCommands';

	let _modalType = ModalType.Popup;
	export let dao: Organization;
	function LeaveDAO() {
		leaveDAO(dao.id);
	}
	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');
</script>

<Modal title="Leave DAO" modalType={_modalType} on:close={close}>
	<!-- Modal header -->
	<div class="p-6 w-auto">
		<h6>Are you sure you want to leave this DAO ({dao.id} / {dao.name})?</h6>
	</div>

	<!-- Modal footer -->
	<div class="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
		<button
			on:click={LeaveDAO}
			class="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none
             focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 m-4"
			>Leave DAO</button
		>
		<button
			on:click={close}
			class="text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none
             focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
			>Close</button
		>
	</div>
</Modal>
