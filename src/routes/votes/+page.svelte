<script lang="ts">
	import Icon from '@iconify/svelte';
	import Card from '$lib/Components/Card/Card.svelte';
	import CreatePoll from '$lib/Components/Votes/CreatePoll.svelte';
	import PollDetails from '$lib/Components/Votes/PollDetails.svelte';
	import { getConsensusPoll, getConsensusPolls } from '$lib/Components/Wallet/VoteCommands';
	import { IsPollCreated, PhantasmaAPIClient } from '$lib/store';
	import { type ConsensusPoll, type Organization, PhantasmaAPI } from 'phantasma-ts/src';
	import { PollState, Timestamp } from 'phantasma-ts';

	let api: PhantasmaAPI;
	PhantasmaAPIClient.subscribe(async (value) => {
		api = value;
		await getOrganizations();
		await getPolls();
	});

	IsPollCreated.subscribe(async (isPollCreated) => {
		if (isPollCreated) {
			await getOrganizations();
			await getPolls();
		}
	});

	let polls: ConsensusPoll[] = [];
	let poll;

	let createPoll = false;

	let pollSelected: ConsensusPoll | null = null;
	//let nullPoll: ConsensusPoll | null | undefined = null;

	function fixPollsData() {
		const timeNow = Timestamp.now;

		for (let i = 0; i < polls.length; i++) {
			if (polls[i].state == PollState.Consensus || polls[i].state == PollState.Failure) {
				continue;
			}

			if (polls[i].startTime.value <= timeNow && polls[i].endTime.value >= timeNow) {
				polls[i].state = PollState.Active;
			} else if (timeNow >= polls[i].endTime.value) {
				if (polls[i].state == PollState.Consensus) {
					polls[i].state = PollState.Consensus;
				} else {
					polls[i].state = PollState.Failure;
				}
			}
		}
	}

	async function getPolls() {
		polls = await getConsensusPolls();

		// Fix polls
		if (polls.length > 0) fixPollsData();

		const timeNow = Timestamp.now;

		// sort polls
		polls = polls.sort((a, b) => {
			// Rule 1: Active polls should be at the top
			if (a.state === PollState.Active && b.state !== PollState.Active) {
				return -1;
			}
			if (b.state === PollState.Active && a.state !== PollState.Active) {
				return 1;
			}

			// Rule 5: Inactive polls within startTime and endTime should be above Consensus but below Active
			const now = new Date();
			const aInactiveValid =
				a.state === PollState.Inactive &&
				timeNow >= a.startTime.value &&
				timeNow <= a.endTime.value;
			const bInactiveValid =
				b.state === PollState.Inactive &&
				timeNow >= b.startTime.value &&
				timeNow <= b.endTime.value;

			if (aInactiveValid && !bInactiveValid) {
				return -1;
			}
			if (bInactiveValid && !aInactiveValid) {
				return 1;
			}

			// Rule 2: Consensus polls should be below Active but above others
			if (a.state === PollState.Consensus && b.state !== PollState.Consensus) {
				return -1;
			}
			if (b.state === PollState.Consensus && a.state !== PollState.Consensus) {
				return 1;
			}

			// Rule 3 and 4: Failure polls and inactive polls with a past endTime should go down
			if (
				a.state === PollState.Failure ||
				(a.state === PollState.Inactive && timeNow > a.endTime.value)
			) {
				return 1;
			}
			if (
				b.state === PollState.Failure ||
				(b.state === PollState.Inactive && timeNow > b.endTime.value)
			) {
				return -1;
			}

			return 0; // No change for equal states or other conditions
		});
	}

	async function getPoll(subject: string) {
		poll = await getConsensusPoll(subject);
	}

	let organizations: Organization[] = [];

	async function getOrganizations() {
		api.getOrganizations().then((orgs) => {
			organizations = orgs;
		});
	}

	function onPollChange(e) {
		console.log('poll change', e.target.value);
		createPoll = false;
	}

	function onCreatePollBtn() {
		createPoll = !createPoll;
		pollSelected = null;
	}

	//getPoll('system.nexus.protocol.version');
	getOrganizations();
	getPolls();
</script>

<div class="mb-4 px-6 mx-auto">
	<h5>Votes</h5>

	<div class="flex flex-wrap -mx-3 justify-center">
		<Card size="md">
			<div class="flex-none w-2/3 max-w-full px-3">
				<div>
					<p class="mb-0 font-sans font-semibold leading-normal text-base">Consensus Polls</p>
					<h5 class="mb-0 font-normal text-sm">Select the consensus poll to interact.</h5>
				</div>
				<div>
					<select name="consensusPoll" bind:value={pollSelected} on:change={onPollChange}>
						<option value={null}>No poll selected.</option>
						{#each polls as poll}
							<option value={poll}>
								{poll.subject}
							</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="px-3 text-right basis-1/3">
				<div
					class="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500"
				>
					<Icon
						height="18"
						width="18"
						class="text-lg relative top-2.5 text-white"
						icon="material-symbols:how-to-vote-outline"
					/>
				</div>
			</div>
		</Card>

		<Card size="md">
			<div class="flex-none w-2/3 max-w-full px-3">
				<div>
					<p class="mb-0 font-sans font-semibold leading-normal text-base">
						Create Consensus Polls
					</p>
					<h5 class="mb-0 font-normal text-sm">Create a new Consensus Poll</h5>
				</div>
				<div>
					<button
						class:create-poll={!createPoll}
						class:close-poll={createPoll}
						class="rounded-md text-white p-2"
						on:click={onCreatePollBtn}
					>
						{#if !createPoll}
							Create a new Poll
						{:else}
							Close
						{/if}
					</button>
				</div>
			</div>
			<div class="px-3 text-right basis-1/3">
				<div
					class="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500"
				>
					<Icon
						height="18"
						width="18"
						class="text-lg relative top-2.5 text-white"
						icon="fluent:form-new-28-regular"
					/>
				</div>
			</div>
		</Card>
	</div>

	<div class="flex flex-wrap -mx-3 my-3 pb-24">
		{#if pollSelected && !createPoll}
			<PollDetails bind:poll={pollSelected} bind:id={pollSelected.subject} {organizations} />
		{/if}

		{#if createPoll && !pollSelected}
			<CreatePoll {organizations} />
		{/if}
	</div>
</div>

<style>
	.create-poll {
		@apply bg-green-500;
	}

	.close-poll {
		@apply bg-red-500;
	}
</style>
