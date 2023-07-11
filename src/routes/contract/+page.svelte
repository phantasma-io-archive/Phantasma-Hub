<script>
	import Commands from '$lib/Commands.svelte';
	import Card from '$lib/Components/Card/Card.svelte';
	import APISelector from '$lib/Components/Card/APISelector.svelte';
	import ContractSelector from '$lib/Components/Contract/ContractSelector.svelte';
	import TipMe from '$lib/Components/Card/TipMe.svelte';
	import Modal from '$lib/Components/Modals/Modal.svelte';
	import ConnectWalletModal from '$lib/Components/Wallet/ConnectWalletModal.svelte';
	import MethodSelector from '$lib/Components/Card/MethodSelector.svelte';
	import ContractArguments from '$lib/Components/Contract/ContractArguments.svelte';
	import { ConsoleOutput } from '$lib/store';
	import ContractConsole from '$lib/Components/Contract/ContractConsole.svelte';

	let showModal = false;
	let showModal2 = false;
	let _consoleOutput = '';
	ConsoleOutput.subscribe((value) => {
		_consoleOutput = value;
	});
</script>

<div class="mb-4 px-6 mx-auto">
	<div class="flex flex-wrap -mx-3">
		<APISelector />
		<ContractSelector />
		<MethodSelector />
	</div>

	<div class="flex flex-wrap mt-6 -mx-3">
		<ContractArguments />
	</div>

	<div class="flex flex-wrap mt-6 -mx-3">
		<ContractConsole />
	</div>
</div>

{#if showModal2}
	<ConnectWalletModal on:close={() => (showModal2 = false)} />
{/if}
