<script type="ts">
	import Options from '$lib/Options.svelte';
	import '../app.css';
	import '../soft-ui-dashboard-tailwind.min.css';
	import Header from '$lib/Components/Header/Header.svelte';
	import Footer from '$lib/Components/Footer/Footer.svelte';
	import Sidebar from '$lib/Components/Sidebar/Sidebar.svelte';

	import Modal from '$lib/Components/Modals/Modal.svelte';
	import ConnectWalletModal from '$lib/Components/Wallet/ConnectWalletModal.svelte';
	// This was a painful solution to find.
	import { Buffer } from 'buffer';
	if (typeof window !== 'undefined') window.Buffer = Buffer;
	import { connectWallet, PhantasmaAPIClient } from '$lib/store';
	import { PhantasmaAPI } from 'phantasma-ts/src/core';

	let showConnectWalletModal: boolean;
	connectWallet.subscribe((value) => {
		showConnectWalletModal = value;
	});

	function closeConnectWallet() {
		connectWallet.set(!showConnectWalletModal);
	}
</script>

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
		</div>
	</div>
	<slot />
</main>

<Footer />

<!--<Options />-->
