        const channelID = "2784093";
        const url = `https://api.thingspeak.com/channels/${channelID}/feeds.json?results=1`;
        const apiKey = "Z27NJ7KJZWOQIM0M";
        const apiUrl = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=1`;

        let lastEntryId = null;
        
        async function teplota() {
            const fieldNumber = 1;
            try {
                const response = await fetch(url);
                const data = await response.json();
                const lastEntry = data.feeds[data.feeds.length - 1]; // Poslední záznam
                const lastTeplota = lastEntry[`field${fieldNumber}`];

                document.getElementById("lastTeplota").innerText = `${Math.round(lastTeplota)}°C` || "Nejsou data";
            } catch (error) {
                document.getElementById("lastTeplota").innerText = "Chyba při načítání";
                console.error("Chyba při načítání dat:", error);
            }
        }

        async function tlak() {
            const fieldNumber = 2;
            try {
                const response = await fetch(url);
                const data = await response.json();
                const lastEntry = data.feeds[data.feeds.length - 1]; // Poslední záznam
                const lastTlak = lastEntry[`field${fieldNumber}`];

                document.getElementById("lastTlak").innerText = `${Math.round(lastTlak)} hPa` || "Nejsou data";
            } catch (error) {
                document.getElementById("lastTlak").innerText = "Chyba při načítání";
                console.error("Chyba při načítání dat:", error);
            }
        }

        async function vlhkost() {
            const fieldNumber = 3;
            try {
                const response = await fetch(url);
                const data = await response.json();
                const lastEntry = data.feeds[data.feeds.length - 1]; // Poslední záznam
                const lastVlhkost = lastEntry[`field${fieldNumber}`];

                document.getElementById("lastVlhkost").innerText = `${Math.round(lastVlhkost)} %` || "Nejsou data";
            } catch (error) {
                document.getElementById("lastVlhkost").innerText = "Chyba při načítání";
                console.error("Chyba při načítání dat:", error);
            }
        }
        teplota()
        vlhkost()
        tlak()
        function checkForNewData() {
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    const latestEntry = data.feeds[0]; // Poslední záznam
                    if (latestEntry && latestEntry.entry_id !== lastEntryId) {
                        // Pokud je nový záznam
                        lastEntryId = latestEntry.entry_id; // Aktualizuj ID posledního záznamu
                        console.log("Nová data:", latestEntry);
                        spustFunkci(latestEntry); // Spusť funkci s novými daty
                    }
                })
                .catch(error => {
                    console.error("Chyba při načítání dat:", error);
                });
        }
        
        function spustFunkci(data) {
            teplota()
            vlhkost()
            tlak()
        }
        
        // Kontroluj nová data každých 5 sekund
        setInterval(checkForNewData, 5000);