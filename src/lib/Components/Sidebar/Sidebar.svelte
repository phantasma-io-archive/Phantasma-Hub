<script lang="ts">
	import Icon from '@iconify/svelte';
	import Item from '$lib/Components/Sidebar/Sidebar-Item.svelte';
	import { CheckURLStatus } from '$lib/Commands/Commands';
	import {
		APIStatus,
		LinkWallet,
		LeftSidebarMenu,
		PhantasmaAPIClient,
		TestnetURL,
		MainnetURL,
		SimnetURL,
		ConnectedToWallet,
		ActivePage,
		API_URL,
		OpenedModal,
		SoftwareName,
		DefaultNetwork,
		DefaultAPIURL
	} from '$lib/store';
	import {
		PhantasmaLink,
		PhantasmaAPI,
		ScriptBuilder,
		PBinaryReader,
		Base16,
		VMObject
	} from 'phantasma-ts';
	import { ModalInternalTypes } from '../Modals/ModalInternalTypes';
	import { NotificationError, NotificationSuccess } from '../Notification/NotificationsBuilder';
	import { onMount } from 'svelte';

	let _apiStatus: boolean;
	let nexusName: string = DefaultNetwork;

	let _walletStatus: boolean;

	let activePageItem: string = '';

	let leftSideNavBarActive: boolean;

	let lastInflationDate: string = new Date(0).toString();
	let lastMasterClaimDate: string = new Date(0).toString();

	let Link: PhantasmaLink;

	let api: PhantasmaAPI;

	onMount(async () => {
		await connectToAPI();
	});

	PhantasmaAPIClient.subscribe(async (value) => {
		api = value;
		await getLastInflationDate();
		await getLastSMDate();
	});

	LeftSidebarMenu.subscribe((value) => {
		leftSideNavBarActive = value;
	});

	function leftSideNavTrigger() {
		LeftSidebarMenu.set(!leftSideNavBarActive);
	}

	APIStatus.subscribe((value) => {
		_apiStatus = value;
	});

	LinkWallet.subscribe((value) => {
		Link = value;
		if (value.account) {
			ConnectedToWallet.set(true);
			_walletStatus = true;
		} else {
			ConnectedToWallet.set(false);
			_walletStatus = false;
		}
	});

	ActivePage.subscribe((value) => {
		activePageItem = value;
	});

	let selectedAPI = DefaultAPIURL;

	API_URL.subscribe((value) => {
		selectedAPI = value;
	});

	async function connectToAPI() {
		if (await CheckURLStatus(selectedAPI)) {
			APIStatus.set(true);
			NotificationSuccess('API Changed', `API has been changed to <b>${nexusName}</b> network.`);
		} else {
			APIStatus.set(false);
			NotificationError('API Changed', `Error changing API to <b>${nexusName}</b> network.`);
		}
	}

	function onChangeApi(e) {
		APIStatus.set(false);
		if (e.target.selectedOptions[0].dataset == undefined) return;
		nexusName = e.target.selectedOptions[0].dataset.net;
		PhantasmaAPIClient.set(new PhantasmaAPI(selectedAPI, null, nexusName));
		API_URL.set(selectedAPI);
		connectToAPI();
	}

	async function getLastInflationDate() {
		let sb = new ScriptBuilder();
		let script = sb.CallContract('gas', 'GetNextInflationDate', []).EndScript();
		console.log('Get Last Inflation Date, Script:', { sb });
		const result = await api.invokeRawScript('main', script);

		let bytes = Base16.decodeUint8Array(result.result);
		let reader = new PBinaryReader(bytes);
		let vm = new VMObject();
		vm.UnserializeData(reader);
		lastInflationDate = new Date(vm.AsTimestamp().value * 1000).toDateString();
		//lastInflationDate = Base16.decode(data.result);
	}

	async function getLastSMDate() {
		let sb = new ScriptBuilder();
		let script = sb.CallContract('stake', 'GetMasterClaimDate', [1]).EndScript();
		console.log('Get Master Claim Date, Script:', { sb });
		const data = await api.invokeRawScript('main', script);
		let bytes = Base16.decodeUint8Array(data.result);
		let reader = new PBinaryReader(bytes);
		let vm = new VMObject();
		vm.UnserializeData(reader);
		lastMasterClaimDate = new Date(vm.AsTimestamp().value * 1000).toDateString();
	}

	function openSendTokensModal() {
		console.log('Open Send Tokens Modal');
		OpenedModal.set(ModalInternalTypes.SendTokens);
	}

	function openChangeOwnerModal() {
		console.log('Open Change Owner Modal');
		OpenedModal.set(ModalInternalTypes.ChangeOwner);
	}

	function openDecodeInformationModal() {
		console.log('Open Decode Information Modal');
		OpenedModal.set(ModalInternalTypes.DecodeInformation);
	}

	function openGetTransactionByHashModal() {
		console.log('Open Get Transaction By Hash Modal');
		OpenedModal.set(ModalInternalTypes.TransactionByHash);
	}

	// Select Page
	if (activePageItem == undefined || activePageItem == '') {
		/*switch (window.location.pathname) {
			case '/':
				activePage.set('Contract Interaction');
				break;
			case '/advanced':
				activePage.set('Advanced Interactions');
				break;
			case '/airdrop':
				activePage.set('Airdrop');
				break;
			case '/contract':
				activePage.set('Contract Managment');
				break;
			default:
				activePage.set('Contract Interaction');
				break;
		}*/
	}

	//getLastInflationDate();
	//doNothing();
</script>

<!-- sidenav  -->
<aside
	class:translate-x-0={leftSideNavBarActive}
	class:shadow-soft-xl={leftSideNavBarActive}
	class="sm:overflow-y-auto mb-32 md:overflow-hidden md:overflow-y-hidden max-w-62.5
	ease-nav-brand z-990 fixed inset-y-0 mt-4 md:mb-16 ml-4 block w-full -translate-x-full
	flex-wrap items-center justify-between rounded-2xl border-0 bg-white p-0 antialiased
	shadow-none transition-transform duration-200 xl:left-0 xl:translate-x-0 xl:bg-transparent max-h-screen overflow-y-auto"
>
	<div class="h-19.5">
		{#if leftSideNavBarActive}
			<a
				href="#"
				class="absolute top-0 right-0 p-4 opacity-50 cursor-pointer text-slate-400"
				on:click={leftSideNavTrigger}
			>
				<Icon height="16" width="16" icon="fa-close" />
			</a>
		{/if}
		<a class="block px-8 py-6 m-0 text-sm whitespace-nowrap text-slate-700" href="/">
			<img
				src="SOUL.png"
				class="inline h-full max-w-full transition-all duration-200 ease-nav-brand max-h-8"
				alt="main_logo"
			/>
			<span class="ml-1 font-semibold transition-all duration-200 ease-nav-brand"
				>{SoftwareName}</span
			>
		</a>
	</div>

	<hr
		class="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent"
	/>

	<h6 class="font-bold leading-tight uppercase text-xs opacity-70 text-center">
		API Selection
		{#if _apiStatus}
			<Icon height="10" width="10" icon="fa-circle" class="text-green-500 ml-1" />
		{:else}
			<Icon height="10" width="10" icon="fa-circle" class="text-red-500 ml-1" />
		{/if}
	</h6>

	<div class="flex items-center justify-center">
		<select
			name="api"
			bind:value={selectedAPI}
			class="my-4 p-2 rounded-md border-sky-300 w-full mx-4 bg-sky-100 text-black text-center"
			on:change={onChangeApi}
		>
			<option value={SimnetURL} data-net="simnet">Local</option>
			<option value={TestnetURL} data-net="testnet" selected>Testnet</option>
			<option value={MainnetURL} data-net="mainnet">Mainnet</option>
		</select>
	</div>

	<hr
		class="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent"
	/>

	<h6 class="font-bold leading-tight uppercase text-xs opacity-70 text-center">Inflation</h6>

	<div class="flex items-center justify-center">
		<div class="my-4 p-2 rounded-md border-sky-300 w-full mx-4 bg-sky-100 text-black text-center">
			{#if api}
				{lastInflationDate}
			{/if}
		</div>
	</div>

	<hr
		class="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent"
	/>

	<h6 class="font-bold leading-tight uppercase text-xs opacity-70 text-center">
		SOUL Master Rewards (Date)
	</h6>

	<div class="flex items-center justify-center">
		<div class="my-4 p-2 rounded-md border-sky-300 w-full mx-4 bg-sky-100 text-black text-center">
			{#if api}
				{lastMasterClaimDate}
			{/if}
		</div>
	</div>

	<hr
		class="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent"
	/>

	<h6 class="font-bold leading-tight uppercase text-xs opacity-70 text-center">Wallet Status</h6>

	<div
		class="h-12 mb-4 shadow-md text-sm ease-nav-brand my-0 mx-4 flex rounded-lg font-semibold text-slate-700 transition-colors bg-opacity-90 text-center items-center
    {_walletStatus ? 'bg-green-200' : 'bg-red-200'}"
	>
		<div class="my-4 p-2 rounded-md w-full mx-4 text-black text-center">
			{#if _walletStatus}
				Connected
			{:else}
				Not Connected
			{/if}
		</div>
	</div>

	<hr
		class="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent"
	/>

	<div class="items-center block overflow-auto w-auto max-h-56 md:max-h-80 grow basis-full">
		<ul class="flex flex-col pl-0 mb-0 pb-8">
			<Item title="Hub" link="/" icon="fluent:vote-20-regular" page="hub" />
			<Item title="Votes" link="/votes" icon="fluent:vote-20-regular" page="votes" />
			<Item
				title="Multi Signature Transaction"
				link="/multi-sig"
				icon="fa6-solid:file-signature"
				page="multisig"
			/>
			<Item title="DAO Managment" link="/dao" icon="ph:users-four" page="dao" />
			<Item
				title="Contract Interaction"
				link="/contract"
				icon="carbon:touch-interaction"
				page="Contract Interaction"
			/>
			<Item
				title="Advanced Interactions"
				link="/advanced"
				icon="material-symbols:code-blocks-outline-rounded"
				page="Advanced Interactions"
			/>
			<Item
				title="Contract Managment"
				link="/contract-manager"
				icon="mdi:contract-outline"
				page="Contract Managment"
			/>
			<Item title="Airdrop" link="/airdrop" icon="ion:gift" page="Airdrop" />
			<Item title="Cross Chain Swap" link="/crossswap" icon="iconoir:coins-swap" page="crossswap" />
			<Item title="Mass Minting" link="/mint" icon="mdi:contract-outline" page="Mass Minting" />
			<Item
				title="Send / Stake Tokens"
				link="/contract"
				icon="mdi:invoice-send"
				page="Send / Stake Tokens"
				on:click={openSendTokensModal}
			/>
			<Item
				title="Change Owner"
				link="/contract"
				icon="ph:user-switch"
				page="Change Owner"
				on:click={openChangeOwnerModal}
			/>
			<Item
				title="Decode Information"
				link="/contract"
				icon="material-symbols:info"
				page="Decode Information"
				on:click={openDecodeInformationModal}
			/>
			<Item
				title="Get Transaction By Hash"
				link="/contract"
				icon="icon-park-outline:transaction-order"
				page="Get Transaction By Hash"
				on:click={openGetTransactionByHashModal}
			/>

			<!-- <li class="w-full mt-4">
          <h6 class="pl-6 ml-2 font-bold leading-tight uppercase text-xs opacity-60">Account pages</h6>
        </li>-->
		</ul>
	</div>

	<!--<div class="mx-4">
      <div class="after:opacity-65 after:bg-gradient-to-tl after:from-slate-600 after:to-slate-300 relative flex min-w-0 flex-col items-center break-words rounded-2xl border-0 border-solid border-blue-900 bg-white bg-clip-border shadow-none after:absolute after:top-0 after:bottom-0 after:left-0 after:z-10 after:block after:h-full after:w-full after:rounded-2xl after:content-['']" sidenav-card>
        <div class="mb-7.5 absolute h-full w-full rounded-2xl bg-cover bg-center" style="background-image: url('../assets/img/curved-images/white-curved.jpeg')"></div>
        <div class="relative z-20 flex-auto w-full p-4 text-left text-white">
          <div class="transition-all duration-200 ease-nav-brand">
            <h6 class="mb-0 text-white">Wallet Information</h6>
            <p class="mt-0 mb-4 font-semibold leading-tight text-xs">Please check our docs</p>
            <a href="https://www.creative-tim.com/learning-lab/tailwind/html/quick-start/soft-ui-dashboard/" target="_blank" class="inline-block w-full px-8 py-2 mb-0 font-bold text-center text-black uppercase transition-all ease-in bg-white border-0 border-white rounded-lg shadow-soft-md bg-150 leading-pro text-xs hover:shadow-soft-2xl hover:scale-102">Documentation</a>
          </div>
        </div>
      </div>
    </div>-->
</aside>

<!-- end sidenav -->
