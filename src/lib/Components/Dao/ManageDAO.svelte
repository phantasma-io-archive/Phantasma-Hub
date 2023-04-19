<script lang="ts">
	import Modal from '$lib/Components/Modals/Modal.svelte';
	import Icon from '@iconify/svelte';
	import Card from '$lib/Components/Card/Card.svelte';
	import { singleVote } from '$lib/Components/Wallet/VoteCommands';
	import moment from 'moment';
	import bigInt from 'big-integer';
	import { beforeUpdate, onMount, tick } from 'svelte';
	import Grid from 'gridjs-svelte';
	import { h, PluginPosition } from 'gridjs';

	import { apiStatus, GasLimit, GasPrice, LinkWallet, PhantasmaAPIClient } from '$lib/store';
	import type { PhantasmaLink } from 'phantasma-ts';
	import AddMemberModal from './AddMemberModal.svelte';
	import LeaveDAOModal from './LeaveDAOModal.svelte';
	import {
		Address,
		ScriptBuilder,
		type Balance,
		type Organization,
		type PhantasmaAPI
	} from 'phantasma-ts/core';
	import { leaveDAO } from '../Wallet/DAOCommands';
	import RemoveMemberModal from './RemoveMemberModal.svelte';
	import AddMemberScriptModal from './AddMemberScriptModal.svelte';

	export let organization_id: string;

	export let organization: Organization | null;
	const columnsDefault = [
		{
			name: 'ID',
			class: 'text-center',
			width: '80px'
		},
		{
			name: 'Address',
			formatter: (cell, row) => {
				return h(
					'a',
					{
						class: 'text-blue-500 hover:text-blue-700',
						href: `https://explorer.phantasma.io/address/${cell.data}`,
						target: '_blank'
					},
					cell.data
				);
			}
		},
		{
			name: 'Actions',
			formatter: (cell, row) => {
				return h(
					'button',
					{
						class: 'text-red-500 hover:text-red-700',
						onClick: () => {
							showRemoveMemberModal(cell.data);
						}
					},
					'Remove'
				);
			}
		}
	];

	let localOrg: Organization;
	let organization_address: Address;
	let isSpecificDAO: boolean = false;
	if (organization != null) localOrg = organization;
	let members: Array<String> = [];
	let addMemberModal = false;
	let balances: Array<Balance> = [];
	let updating = false;
	let addressInDAO = false;
	let removeMemberModal = false;
	let removeScript: string = '';
	let selectedMember: string = '';
	let columns = columnsInDao();
	let data: Array<any> = [];
	let connected = false;
	let pagination = {
		limit: 10,
		enabled: true
	};
	let addAddress: string;
	let showAddMemberModal: boolean = false;
	let addMemberScript: string;
	let UserLeaveDAO: boolean = false;

	let Link: PhantasmaLink;
	LinkWallet.subscribe((value) => {
		Link = value;
		if (value.account) connected = true;
		else connected = false;
	});

	let api: PhantasmaAPI;
	PhantasmaAPIClient.subscribe((value) => {
		api = value;
	});

	let gasPrice = 0;
	GasPrice.subscribe((value) => {
		gasPrice = value;
	});

	let gasLimit = 0;
	GasLimit.subscribe((value) => {
		gasLimit = value;
	});

	onMount(() => {
		getOrganization(organization_id);
		getAccount();
	});

	beforeUpdate(async () => {
		if (organization !== null) {
			if (localOrg.id == organization.id) return;
			await getOrganization(organization.id);
			await getAccount();
			//getOrganization(organization.id);
			//members = organization.members;
		}
	});

	function columnsInDao() {
		if (addressInDAO && isSpecificDAO) return columnsDefault;
		else return columnsDefault.slice(0, 2);
	}

	async function getOrganization(org) {
		members = [];
		organization = await api.getOrganization(org);
		organization_address = Address.FromText(await api.lookUpName(org));
		if (org == 'masters' || org == 'stakers') isSpecificDAO = false;
		else isSpecificDAO = true;
		localOrg = organization;
		members = organization.members;
		if (Link.account) addressInDAO = members.includes(Link.account.address);
		let localData: Array<any> = [];
		let index = 0;
		members.forEach((member) => {
			let entry = [
				index.toString(),
				{
					data: member
				},
				{
					data: member
				}
			];
			localData.push(entry);
			index++;
		});

		data = localData;
		columns = columnsInDao();
	}

	async function getAccount() {
		balances = [];
		let address = await api.lookUpName(localOrg.id);
		let account = await api.getAccount(address);
		account.balances;
		balances = account.balances;
		let stakedBalance: Balance = {
			symbol: 'SOUL Staked',
			amount: account.stake,
			decimals: 8,
			chain: 'main'
		};

		balances.unshift(stakedBalance);
	}

	function addMember() {
		console.log('addMember');
		addMemberModal = true;
		removeMemberModal = false;
	}

	function showAddMemberScript() {
		// addAddress
		const sb = new ScriptBuilder();
		addMemberScript = sb
			.AllowGas(Link.account.address, Address.Null, gasPrice, gasLimit)
			.CallInterop('Organization.AddMember', [Link.account.address, localOrg.id, addAddress])
			.SpendGas(Link.account.address)
			.EndScript();
		showAddMemberModal = true;
	}

	function showRemoveMemberModal(member) {
		selectedMember = member;
		removeMemberModal = true;
		const sb = new ScriptBuilder();

		removeScript = sb
			.AllowGas(Link.account.address, Address.Null, gasPrice, gasLimit)
			.CallInterop('Organization.RemoveMember', [Link.account.address, localOrg.id, member])
			.SpendGas(Link.account.address)
			.EndScript();
	}

	function removeMember(member) {
		console.log('RemoveMember');
		console.log(member);

		// Show Modal with the script code
		removeMemberModal = true;
		addMemberModal = false;
	}

	function ShowLeaveDAO() {
		UserLeaveDAO = true;
	}

	function LeaveDAO() {
		leaveDAO(localOrg.id);
	}
</script>

<Card
	size="xl"
	title="Manage Organization {localOrg.name}"
	description="Details for Organization {localOrg.name}"
	class="mb-20"
>
	<div class="my-1 mb-20">
		<form on:submit|preventDefault={() => null}>
			<div class="grid md:grid-cols-2 md:gap-6">
				<div class="relative z-0 w-full mb-6 group">
					<input
						type="text"
						name="id"
						id="id"
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						bind:value={localOrg.id}
						required
						disabled
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
						name="org_name"
						id="org_name"
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						bind:value={localOrg.name}
						required
						disabled
					/>
					<label
						for="subject"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>Organization Name</label
					>
				</div>
			</div>

			<h5 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Organization Balances</h5>

			<div class="grid md:grid-cols-2 md:gap-6 max-h-50 overflow-y-scroll my-2 pt-2">
				{#each balances as balance}
					<div class="relative z-0 w-full mb-6 group">
						<input
							type="number"
							name="id"
							id="id"
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							value={(parseInt(balance.amount) / 10 ** balance.decimals).toFixed(2)}
							required
							disabled
						/>
						<label
							for="subject"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>{balance.symbol}</label
						>
					</div>
				{/each}
			</div>

			<h5 class="text-lg font-semibold text-gray-700 dark:text-gray-200">
				Organization Members ({members.length})
			</h5>

			<Grid {columns} {data} search="true" pagination />

			<!-- <div class="grid md:grid-cols-2 md:gap-6 max-h-80 overflow-y-scroll my-2 pt-2">
				{#each members as member}
					<div class="relative z-0 w-full mb-6 group">
						<div class="py-2.5 flex content-center">
							{#if connected && addressInDAO}
								<button
									class="px-4  text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
									placeholder=" "
									data-addr={member}
									><Icon
										height="12"
										width="12"
										class="text-lg text-red-500"
										icon="fa6-solid:trash"
									/></button
								>
							{/if}

							{#if Link.account}
								{#if member == Link.account.address}
									<input
										type="text"
										name="member"
										id="member"
										class="px-0 w-[75%] text-sm text-gray-900 bg-blue-800 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
										placeholder=" "
										bind:value={member}
										required
										disabled
									/>
								{:else}
									<input
										type="text"
										name="member"
										id="member"
										class="px-0 w-[75%] text-sm text-gray-900  bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
										placeholder=" "
										bind:value={member}
										required
										disabled
									/>
								{/if}
							{:else}
								<input
									type="text"
									name="member"
									id="member"
									class="px-0 w-[75%] text-sm text-gray-900  bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
									placeholder=" "
									bind:value={member}
									required
									disabled
								/>
							{/if}
						</div>

						<label
							for="member"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
							>Member
							<span />
						</label>
					</div>
				{/each}
			</div>-->

			{#if connected && addressInDAO && isSpecificDAO}
				<h5 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Commands</h5>

				<div class="grid md:grid-cols-2 md:gap-6 my-2 pt-2">
					<button
						on:click={addMember}
						class="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none
             focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
						>Add Member</button
					>

					<button
						on:click={ShowLeaveDAO}
						class="text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none
             focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
						>Leave DAO</button
					>
				</div>
			{/if}
		</form>
	</div>
</Card>

{#if addMemberModal}
	<AddMemberModal
		on:close={() => (addMemberModal = false)}
		bind:addAddress
		bind:dao={localOrg}
		bind:daoAddress={organization_address}
		on:addMemberSubmit={(addr) => {
			showAddMemberScript();
		}}
	/>
{/if}

{#if showAddMemberModal}
	<AddMemberScriptModal
		on:close={() => (showAddMemberModal = false)}
		bind:dao={localOrg}
		bind:addAddress
		bind:scriptAdd={addMemberScript}
	/>
{/if}

{#if UserLeaveDAO}
	<LeaveDAOModal on:close={() => (UserLeaveDAO = false)} bind:dao={localOrg} />
{/if}

{#if removeMemberModal}
	<RemoveMemberModal
		on:close={() => (removeMemberModal = false)}
		bind:addressRemove={selectedMember}
		bind:dao={localOrg}
		bind:daoAddress={organization_address}
		bind:scriptRemove={removeScript}
	/>
{/if}

<style global>
	@import 'https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css';
</style>
