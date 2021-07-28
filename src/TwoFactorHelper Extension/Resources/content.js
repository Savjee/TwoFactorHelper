// Check if we have a ruleset
let rules = browser.storage.local
                .get("rules")
                .then((data, error) => {
                    // If no rules are loaded, fetch it from GitHub!
                    if(Object.keys(data).length === 0){
                        console.log("No rules found. Fetching now...");
                        fetchRules();
                    }else{
                        run(data);
                    }
                    
                    console.log("data", data);
                    console.log("error", error);
                });

async function fetchRules(){
    const res = await fetch("https://raw.githubusercontent.com/Savjee/TwoFactorHelper/master/rules.json");
    const doc = await res.json();
    
    // Cache the rules
    console.log("Ruleset fetched:", doc);
    const setCache = await browser.storage.local.set({ rules: doc, last_fetched: Date.now()});
    console.log("Rulset cached for 48 hours.");
    
    run(doc);
}

async function run(data){
    const url = location.href;
    console.log(url);
    
    for(const r of data.rules){
        
        for(const matchUrl of r.match){
            const re = new RegExp(matchUrl);
            if(url.match(re) !== null){
                const el = document.querySelector(r.selector);
                console.log("el", el);
                
                if(el){
                    el.setAttribute("autocomplete", "one-time-code");
                }
            }
        }
        
    }
}
