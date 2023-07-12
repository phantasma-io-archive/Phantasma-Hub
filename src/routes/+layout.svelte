<script lang="ts">
	import '../app.css';
	import '../soft-ui-dashboard-tailwind.min.css';
	import Header from '$lib/Components/Header/Header.svelte';
	import Sidebar from '$lib/Components/Sidebar/Sidebar.svelte';
	import Options from '$lib/Options.svelte';
	import Footer from '$lib/Components/Footer/Footer.svelte';
	import Modal from '$lib/Components/Modals/Modal.svelte';
	import ConnectWalletModal from '$lib/Components/Wallet/ConnectWalletModal.svelte';
	import { ConnectWallet, OpenedModal, PhantasmaAPIClient, SoftwareName } from '$lib/store';
	import { PhantasmaAPI } from 'phantasma-ts/src/core';
	import { NotificationsOptions } from '$lib/Components/Notification/NotificationsBuilder';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { ModalInternalTypes } from '$lib/Components/Modals/ModalInternalTypes';
	import TokensInteractionModal from '$lib/Components/Modals/TokensInteractionModal.svelte';
	import ChangeOwnerModal from '$lib/Components/Modals/ChangeOwnerModal.svelte';
	import DecodeInfoModal from '$lib/Components/Modals/DecodeInfoModal.svelte';
	import TransactionByHashModal from '$lib/Components/Modals/TransactionByHashModal.svelte';

	let showConnectWalletModal: boolean;
	let hash = '';
	ConnectWallet.subscribe((value) => {
		showConnectWalletModal = value;
	});

	function closeConnectWallet() {
		ConnectWallet.set(!showConnectWalletModal);
	}

	function closeModal() {
		OpenedModal.set(ModalInternalTypes.None);
	}

	let openedModal: ModalInternalTypes = ModalInternalTypes.None;
	OpenedModal.subscribe((value) => {
		openedModal = value;
	});

	/*
	// This was a painful solution to find.
	import { Buffer } from 'buffer';
	if (typeof window !== 'undefined') window.Buffer = Buffer;
*/
</script>

<svelte:head>
	<title>{SoftwareName}</title>
</svelte:head>
<Sidebar />

<main
	class="ease-soft-in-out xl:ml-68.5 relative h-full max-h-screen rounded-xl transition-all duration-200"
>
	<Header />

	<div class="mb-4 px-6 mx-auto">
		<div class="flex flex-wrap mt-6 -mx-3">
			{#if showConnectWalletModal}
				<ConnectWalletModal on:close={() => closeConnectWallet()} />
			{/if}

			{#if openedModal == ModalInternalTypes.SendTokens}
				<TokensInteractionModal on:close={() => closeModal()} />
			{:else if openedModal == ModalInternalTypes.ChangeOwner}
				<ChangeOwnerModal on:close={() => closeModal()} />
			{:else if openedModal == ModalInternalTypes.DecodeInformation}
				<DecodeInfoModal on:close={() => closeModal()} />
			{:else if openedModal == ModalInternalTypes.TransactionByHash}
				<TransactionByHashModal bind:hash on:close={() => closeModal()} />
			{/if}
		</div>
	</div>
	<slot />
</main>

<Options />

<Footer />

<SvelteToast options={NotificationsOptions} />

<style>
	:root {
		--toastContainerBottom: 4rem;
		--toastContainerTop: auto;
	}
</style>
