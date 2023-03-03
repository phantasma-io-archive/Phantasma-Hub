<script type="ts">
	import Commands from '$lib/Commands.svelte';
	import Card from '$lib/Components/Card/Card.svelte';
	import APISelector from '$lib/Components/Card/APISelector.svelte';
	import ContractSelector from '$lib/Components/Contract/ContractSelector.svelte';
	import TipMe from '$lib/Components/Card/TipMe.svelte';
	import Modal from '$lib/Components/Modals/Modal.svelte';
	import ConnectWalletModal from '$lib/Components/Wallet/ConnectWalletModal.svelte';
	import MethodSelector from '$lib/Components/Card/MethodSelector.svelte';
	import ContractArguments from '$lib/Components/Contract/ContractArguments.svelte';
	import ContractDeployCard from '$lib/Components/Contract/ContractDeployCard.svelte';
	import ContractUpgradeCard from '$lib/Components/Contract/ContractManagerCard.svelte';
	import ContractDeployer from '$lib/Components/Contract/ContractDeployer.svelte';
	import ContractManager from '$lib/Components/Contract/ContractManager.svelte';

	let deployContract = false;
	let manageContract = false;
</script>

<div class="mb-4 px-6 mx-auto">
	<div class="flex flex-wrap -mx-3">
		<APISelector />
		<ContractDeployCard bind:deployContract />
		<ContractUpgradeCard bind:manageContract />
	</div>

	<div class="flex flex-wrap mt-6 -mx-3">
		{#if deployContract}
			<ContractDeployer />
		{:else if manageContract}
			<ContractManager />
		{:else}{/if}
	</div>
</div>
