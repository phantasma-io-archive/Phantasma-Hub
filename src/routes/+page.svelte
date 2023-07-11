<script type="ts">
	import MenuCard from '$lib/Components/Card/MenuCard.svelte';
	import Card from '$lib/Components/Card/Card.svelte';
	import Icon from '@iconify/svelte';
	import { SoftwareName } from '$lib/store';
	let pages = [
		{
			title: 'Vote',
			description: 'Enter the voting.',
			icon: 'fluent:vote-20-regular',
			href: '/votes'
		},
		{
			title: 'Multi-Signature',
			description: 'Enter Multi-Signature',
			icon: 'fa6-solid:file-signature',
			href: '/multi-sig'
		},
		{
			title: 'DAO Manager',
			description: 'Enter DAO Manager',
			icon: 'ph:users-four',
			href: '/dao'
		},
		{
			title: 'Contract Interactor',
			description: 'Interact with contracts',
			icon: 'carbon:touch-interaction',
			href: '/contract'
		},
		{
			title: 'Advanced Interactions',
			description: 'Advanced interactions with contracts',
			icon: 'material-symbols:code-blocks-outline-rounded',
			href: '/advanced'
		},
		{
			title: 'Contract Manager',
			description: 'Deploy and manage contracts',
			icon: 'mdi:contract-outline',
			href: '/contract-manager'
		},
		{
			title: 'Airdrop',
			description: 'Airdrop tokens and NFTs',
			icon: 'ion:gift',
			href: '/airdrop'
		},
		{
			title: 'Mass Minting',
			description: 'Mass Minting of NFTs',
			icon: 'carbon:intent-request-create',
			href: '/mint'
		},
		{
			title: 'Cross Chain Swap',
			description: 'Swap tokens from Phantasma to ETH and BSC',
			icon: 'iconoir:coins-swap',
			href: '/crossswap'
		}
	];
</script>

<div class="mb-4 px-6 mx-auto">
	<h5>{SoftwareName}</h5>

	<div class="flex flex-wrap -mx-3 pb-32">
		{#each pages as page}
			<MenuCard
				title={page.title}
				description={page.description}
				icon={page.icon}
				href={page.href}
			/>
		{/each}
	</div>
</div>
