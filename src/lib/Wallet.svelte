<script>
    import {LinkWallet} from "$lib/store";
	import { PhantasmaLink } from "./phantasmaLink";
    
    /**
	 * @type {import("./phantasmaLink").PhantasmaLink}
	 */
    let Link;

    LinkWallet.subscribe(value => {
		Link = value;
	});

    
    
    const login = (/** @type {string | undefined} */ providerHint) => {
        Link = new PhantasmaLink("pharming", true);
        Link.login(function(sucess) {
            console.log("something")
            LinkWallet.set(Link);
        }, function (error){
            console.error("error")
        },2, "phantasma", providerHint);
    }
</script>

<button on:click={() => login("poltergeist")}>
    Poltegeist
</button>

<button on:click={() => login("ecto")}>
    Ecto
</button>