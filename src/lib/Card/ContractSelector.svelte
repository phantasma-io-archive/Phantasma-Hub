<script>
    import Icon from '@iconify/svelte';

    import Card from '$lib/Card/Card.svelte'
</script>

<Card size="sm">
    <div class="flex-none w-2/3 max-w-full px-3">
        <div>
            <p class="mb-0 font-sans font-semibold leading-normal text-base">Contract Select</p>
            <h5 class="mb-0 font-normal text-sm">
                Select the contract to interact.
            </h5>
        </div>
        <div>
            <select name="contract" id="contract" class="w-full">
                <option value="volvo">My</option>
                <option value="saab">default</option>
                <option value="mercedes">pharming</option>
            </select>
        </div>
    </div>
    <div class="px-3 text-right basis-1/3">
        <div class="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500">
            <Icon height="18" width="18" class="text-lg relative top-2.5 text-white" icon="fa6-solid:file-contract" />
        </div>
    </div>
</Card>