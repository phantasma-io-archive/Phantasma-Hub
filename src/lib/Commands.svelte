
<script>
    import { LinkWallet } from "./store"
    import { ScriptBuilder, Decoder } from "phantasma-ts/src/core/vm"

    /**
	 * @type {import("./phantasmaLink").PhantasmaLink}
	 */
    let Link;
    LinkWallet.subscribe(value => {
		Link = value;
	});

    let contractName = "pharming"
    
    function UpdateOwner(){
        console.log(Link)
        if (!Link.account)
            console.log("Phantasma Link", `Not connected to a wallet.`, "error");

        let address = String(Link.account.address);
        let gasPrice = 100000;
        let gasLimit = 9999999;
        let to = "P2K4WKrP4yrBwDKZoQjUJCfHKf3N4Uqd5qXPygYGTSR5B7n";
        var sb = new ScriptBuilder();
        var myScript = sb.
            allowGas(address, sb.nullAddress, gasPrice, gasLimit ).
            callContract(contractName, "updateOwner", [String(to)]).
            spendGas(address).
            endScript();

        Link.signTx(myScript, contractName, function(script)
        {
            console.log("Update Owner", `Owner updated with success to <b>${to}</b>`);
        }, function(error) {
            console.log(error);
        });
    }

    function SendTX(){
        console.log(Link)
        if (!Link.account)
            console.log("Phantasma Link", `Not connected to a wallet.`, "error");

        let address = String(Link.account.address);
        let to = String("P2K4WKrP4yrBwDKZoQjUJCfHKf3N4Uqd5qXPygYGTSR5B7n");
        let amount =  String(0.5 * 10**10)
        let gasPrice = 10000;
        let gasLimit = 999999;
        var sb = new ScriptBuilder();
        var myScript = sb.
            allowGas(address, sb.nullAddress, gasPrice, gasLimit).
            callInterop("Runtime.TransferTokens", [address, to, "KCAL", amount]).          
            spendGas(address).
            endScript();

            Link.signTx(myScript, "tx", function(script)
        {
            console.log("Transaction Owner", `Owner updated with success to <b>${to}</b>`);
        }, function(error) {
            console.log(error);
        });
    }

    function GetInfo(){
        console.log(Link)
        if (!Link.account)
            console.log("Phantasma Link", `Not connected to a wallet.`, "error");

        let address = String(Link.account.address);
        let to = String("P2K4WKrP4yrBwDKZoQjUJCfHKf3N4Uqd5qXPygYGTSR5B7n");

        var sb = new ScriptBuilder();
        var myScript = sb.
            callContract(contractName, "getUnclaimed", [to, "KCAL", "BNB"]).
            endScript();

        Link.invokeScript(myScript, contractName, function(script)
        {
            let result = new Decoder(script.result).readBigInt();
            console.log("GetInfo", `Get Info ${result}`);
        });
    }

    function GetInfoFarm(){
        console.log(Link)
        if (!Link.account)
            console.log("Phantasma Link", `Not connected to a wallet.`, "error");

            let gasPrice = 10000;
        let gasLimit = 999999;
        let address = String(Link.account.address);
        var sb = new ScriptBuilder();
        var myScript = sb.
            allowGas(address, sb.nullAddress,gasPrice ,gasLimit).
            callContract(contractName, "getFarmInfo", ["KCAL", "BNB"]).
            spendGas(address).
            endScript();

        Link.signTx(myScript, "tx", function(script)
        {
            console.log("Transaction Owner", `Owner updated with success to <b>${to}</b>`);
        }, function(error) {
            console.log(error);
        });
    }

    function SendSimpleTx(){

    }
</script>

<button on:click={() => UpdateOwner()} >
    Update
</button>

<button on:click={() => GetInfo()} >
    GetInfo
</button>

<button on:click={() => GetInfoFarm()} >
    GetInfoFarm
</button>

<button on:click={() => SendTX()} >
    Send Transaction
</button>

<button on:click={() => SendSimpleTx()} >
    Send Transaction
</button>