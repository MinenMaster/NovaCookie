Game.registerMod("novaccookie", {
    init: function () {
        this.goldenCookieCount = 0;

        this.settings = {
            autoclickBc: false,
            autoclickBcToggleKey: 188,
            autoclickGc: true,
            notifyGoldenCookieCounter: true,
            autoStockTrading: true,
            showOptionsMenu: false,
            autoUpgrade: false,
            autoUpgradeBlueOnly: true,
            autoUpgradeGreenOrBetter: false,
            autoUpgradeWaitForBlue: true,
        };

        this.intervals = {
            autoclickGc: null,
            autoStockTrading: null,
            autoclickBc: null,
            autoUpgrade: null,
        };

        Game.Notify(`NovaCookie loaded!`, "", [16, 5]);

        var originalShimmerPop = Game.shimmer.prototype.pop;
        var mod = this;

        Game.shimmer.prototype.pop = function () {
            if (this.type === "golden") {
                mod.goldenCookieCount++;
                if (mod.settings.notifyGoldenCookieCounter) {
                    Game.Notify(
                        `Golden cookies clicked: ${mod.goldenCookieCount}`,
                        "",
                        [16, 5],
                        2000
                    );
                }
            }
            return originalShimmerPop.call(this);
        };

        this.startAutoFeatures();

        var originalUpdateMenu = Game.UpdateMenu;
        Game.UpdateMenu = function () {
            originalUpdateMenu();
            if (Game.onMenu == "prefs") {
                mod.addToOptionsMenu();
            }
        };

        document.addEventListener("keydown", function (event) {
            if (event.keyCode === mod.settings.autoclickBcToggleKey) {
                mod.settings.autoclickBc = !mod.settings.autoclickBc;
                mod.stopAutoFeatures();
                mod.startAutoFeatures();
                Game.Notify(
                    "Auto Big Cookie " +
                        (mod.settings.autoclickBc ? "ON" : "OFF"),
                    "",
                    [16, 5],
                    2000
                );
            }
        });
    },
    addToOptionsMenu: function () {
        var mod = this;
        var menuDiv = document.getElementById("menu");

        if (menuDiv && !document.getElementById("NovaCookieOptionsSection")) {
            var section = document.createElement("div");
            section.className = "subsection";
            section.id = "NovaCookieOptionsSection";
            section.style.border = "1px solid #666";
            section.style.margin = "4px";
            section.style.background = "#222";

            var header = document.createElement("div");
            header.className = "title";
            header.style.fontSize = "16px";
            header.style.padding = "8px";
            header.style.cursor = "pointer";
            header.style.background = "#333";
            header.innerHTML = "NovaCookie Settings ";

            var toggleButton = document.createElement("span");
            toggleButton.style.cursor = "pointer";
            toggleButton.style.display = "inline-block";
            toggleButton.style.height = "14px";
            toggleButton.style.width = "14px";
            toggleButton.style.borderRadius = "7px";
            toggleButton.style.textAlign = "center";
            toggleButton.style.backgroundColor = "#C0C0C0";
            toggleButton.style.color = "black";
            toggleButton.style.fontSize = "13px";
            toggleButton.style.verticalAlign = "middle";
            toggleButton.textContent = mod.settings.showOptionsMenu ? "-" : "+";
            toggleButton.onclick = function () {
                mod.toggleOptionsMenu();
            };

            header.appendChild(toggleButton);
            section.appendChild(header);

            if (mod.settings.showOptionsMenu) {
                section.appendChild(mod.createOptionsContent());
            }

            menuDiv.appendChild(section);
        }
    },
    createOptionsContent: function () {
        var mod = this;
        var content = document.createElement("div");
        content.style.padding = "8px";

        var autoBcListing = mod.createOptionListing(
            "Auto-Click Big Cookie",
            "autoclickBc",
            "Automatically click the big cookie continuously",
            "toggle"
        );
        content.appendChild(autoBcListing);

        var autoBcToggleKeyListing = mod.createOptionListing(
            "Auto-Click Big Cookie Toggle Key",
            "autoclickBcToggleKey",
            "Click to change the key used to toggle the Big Cookie auto-clicker",
            "keycode"
        );
        content.appendChild(autoBcToggleKeyListing);

        var autoGcListing = mod.createOptionListing(
            "Auto-Click Golden Cookie",
            "autoclickGc",
            "Automatically click golden cookies",
            "toggle"
        );
        content.appendChild(autoGcListing);

        var notifyGcCounterListing = mod.createOptionListing(
            "Notify Golden Cookie Counter",
            "notifyGoldenCookieCounter",
            "Display notifications when golden cookies are clicked",
            "toggle"
        );
        content.appendChild(notifyGcCounterListing);

        var gcCountDisplay = mod.createInfoListing(
            "Golden Cookies Clicked",
            mod.goldenCookieCount
        );
        content.appendChild(gcCountDisplay);

        var resetListing = document.createElement("div");
        resetListing.className = "listing";
        resetListing.style.padding = "4px";
        resetListing.innerHTML = "<b>Reset Golden Cookie Counter:</b> ";

        var resetButton = document.createElement("a");
        resetButton.className = "option";
        resetButton.style.color = "#ff4444";
        resetButton.textContent = "Reset";
        resetButton.onclick = function () {
            mod.goldenCookieCount = 0;
            Game.Notify("Golden cookie counter reset!", "", [16, 5], 1000);
            Game.UpdateMenu();
        };
        resetListing.appendChild(resetButton);
        content.appendChild(resetListing);

        var autoStockListing = mod.createOptionListing(
            "Auto Stock Trading",
            "autoStockTrading",
            "Automatically trade stocks for profit",
            "toggle"
        );
        content.appendChild(autoStockListing);

        var autoUpgradeListing = mod.createOptionListing(
            "Auto Upgrade",
            "autoUpgrade",
            "Automatically buy the most efficient buildings and upgrades",
            "toggle"
        );
        content.appendChild(autoUpgradeListing);

        var autoUpgradeBlueOnlyListing = mod.createOptionListing(
            "Auto Upgrade - Blue Only",
            "autoUpgradeBlueOnly",
            "Only auto-buy blue (most efficient) items, ignore green/yellow/etc",
            "toggle"
        );
        content.appendChild(autoUpgradeBlueOnlyListing);

        var autoUpgradeGreenOrBetterListing = mod.createOptionListing(
            "Auto Upgrade - Green or Better Only",
            "autoUpgradeGreenOrBetter",
            "Only auto-buy green or blue items, ignore yellow/orange/red/etc",
            "toggle"
        );
        content.appendChild(autoUpgradeGreenOrBetterListing);

        var autoUpgradeWaitListing = mod.createOptionListing(
            "Auto Upgrade - Wait for Blue",
            "autoUpgradeWaitForBlue",
            "Wait for blue items to become affordable instead of buying green ones",
            "toggle"
        );
        content.appendChild(autoUpgradeWaitListing);

        return content;
    },
    createOptionListing: function (label, settingKey, description, type) {
        var mod = this;
        var listing = document.createElement("div");
        listing.className = "listing";
        listing.style.padding = "4px";

        if (type === "toggle") {
            var toggleLink = document.createElement("a");
            toggleLink.className = "option";
            toggleLink.textContent = mod.settings[settingKey] ? "ON" : "OFF";
            toggleLink.style.color = mod.settings[settingKey]
                ? "#00ff00"
                : "#ff0000";
            toggleLink.onclick = function () {
                mod.toggleSetting(settingKey);
                Game.UpdateMenu();
            };

            listing.innerHTML = "<b>" + label + ":</b> ";
            listing.appendChild(toggleLink);
        } else if (type === "keycode") {
            var keyLink = document.createElement("a");
            keyLink.className = "option";
            keyLink.textContent = mod.getKeyName(mod.settings[settingKey]);
            keyLink.style.color = "#4da6ff";
            keyLink.onclick = function () {
                mod.promptForKey(settingKey);
            };

            listing.innerHTML = "<b>" + label + ":</b> ";
            listing.appendChild(keyLink);
        }

        var desc = document.createElement("div");
        desc.style.fontSize = "10px";
        desc.style.opacity = "0.7";
        desc.style.fontStyle = "italic";
        desc.textContent = description;
        listing.appendChild(desc);

        return listing;
    },
    createInfoListing: function (label, value, valueColor) {
        var listing = document.createElement("div");
        listing.className = "listing";
        listing.style.padding = "4px";
        listing.innerHTML =
            "<b>" +
            label +
            ':</b> <span style="color:' +
            (valueColor || "#ff0") +
            ';">' +
            value +
            "</span>";
        return listing;
    },
    promptForKey: function (settingKey) {
        var mod = this;
        Game.Notify(
            "Press any key to set as the new toggle key...",
            "",
            [16, 5],
            3000
        );

        var keyListener = function (event) {
            event.preventDefault();
            event.stopPropagation();

            mod.settings[settingKey] = event.keyCode;

            Game.Notify(
                "Toggle key set to: " + mod.getKeyName(event.keyCode),
                "",
                [16, 5],
                2000
            );

            document.removeEventListener("keydown", keyListener, true);

            Game.UpdateMenu();
        };

        document.addEventListener("keydown", keyListener, true);
    },
    getKeyName: function (keyCode) {
        var keyNames = {
            8: "Backspace",
            9: "Tab",
            13: "Enter",
            16: "Shift",
            17: "Ctrl",
            18: "Alt",
            19: "Pause",
            20: "Caps Lock",
            27: "Escape",
            32: "Space",
            33: "Page Up",
            34: "Page Down",
            35: "End",
            36: "Home",
            37: "Left",
            38: "Up",
            39: "Right",
            40: "Down",
            45: "Insert",
            46: "Delete",
            48: "0",
            49: "1",
            50: "2",
            51: "3",
            52: "4",
            53: "5",
            54: "6",
            55: "7",
            56: "8",
            57: "9",
            65: "A",
            66: "B",
            67: "C",
            68: "D",
            69: "E",
            70: "F",
            71: "G",
            72: "H",
            73: "I",
            74: "J",
            75: "K",
            76: "L",
            77: "M",
            78: "N",
            79: "O",
            80: "P",
            81: "Q",
            82: "R",
            83: "S",
            84: "T",
            85: "U",
            86: "V",
            87: "W",
            88: "X",
            89: "Y",
            90: "Z",
            96: "Numpad 0",
            97: "Numpad 1",
            98: "Numpad 2",
            99: "Numpad 3",
            100: "Numpad 4",
            101: "Numpad 5",
            102: "Numpad 6",
            103: "Numpad 7",
            104: "Numpad 8",
            105: "Numpad 9",
            106: "Numpad *",
            107: "Numpad +",
            109: "Numpad -",
            110: "Numpad .",
            111: "Numpad /",
            112: "F1",
            113: "F2",
            114: "F3",
            115: "F4",
            116: "F5",
            117: "F6",
            118: "F7",
            119: "F8",
            120: "F9",
            121: "F10",
            122: "F11",
            123: "F12",
            144: "Num Lock",
            145: "Scroll Lock",
            186: ";",
            187: "=",
            188: ",",
            189: "-",
            190: ".",
            191: "/",
            192: "`",
            219: "[",
            220: "\\",
            221: "]",
            222: "'",
        };
        return keyNames[keyCode] || "Key " + keyCode;
    },
    toggleOptionsMenu: function () {
        this.settings.showOptionsMenu = !this.settings.showOptionsMenu;
        Game.UpdateMenu();
    },
    toggleSetting: function (settingKey) {
        this.settings[settingKey] = !this.settings[settingKey];

        this.stopAutoFeatures();
        this.startAutoFeatures();
    },
    startAutoFeatures: function () {
        var mod = this;

        if (this.settings.autoclickGc) {
            this.intervals.autoclickGc = setInterval(function () {
                for (let i = 0; i < Game.shimmers.length; i++) {
                    if (Game.shimmers[i].type === "golden") {
                        Game.shimmers[i].pop();
                    }
                }
            }, 100);
        }

        if (this.settings.autoStockTrading) {
            this.intervals.autoStockTrading = setInterval(function () {
                mod.performStockTrading();
            }, 100);
        }

        if (this.settings.autoclickBc) {
            this.intervals.autoclickBc = setInterval(function () {
                Game.ClickCookie();
            }, 10);
        }

        if (this.settings.autoUpgrade) {
            this.intervals.autoUpgrade = setInterval(function () {
                mod.performAutoUpgrade();
            }, 10);
        }
    },
    stopAutoFeatures: function () {
        if (this.intervals.autoclickBc) {
            clearInterval(this.intervals.autoclickBc);
            this.intervals.autoclickBc = null;
        }
        if (this.intervals.autoclickGc) {
            clearInterval(this.intervals.autoclickGc);
            this.intervals.autoclickGc = null;
        }
        if (this.intervals.autoStockTrading) {
            clearInterval(this.intervals.autoStockTrading);
            this.intervals.autoStockTrading = null;
        }
        if (this.intervals.autoUpgrade) {
            clearInterval(this.intervals.autoUpgrade);
            this.intervals.autoUpgrade = null;
        }
    },
    save: function () {
        return JSON.stringify({
            goldenCookieCount: this.goldenCookieCount,
            settings: this.settings,
        });
    },
    load: function (str) {
        var defaultSettings = {
            autoclickBc: false,
            autoclickBcToggleKey: 188,
            autoclickGc: true,
            notifyGoldenCookieCounter: true,
            autoStockTrading: true,
            showOptionsMenu: false,
            autoUpgrade: false,
            autoUpgradeBlueOnly: true,
            autoUpgradeGreenOrBetter: false,
            autoUpgradeWaitForBlue: true,
        };

        this.goldenCookieCount = 0;
        this.settings = defaultSettings;

        if (str) {
            try {
                var data = JSON.parse(str);
                this.goldenCookieCount = data.goldenCookieCount || 0;

                if (data.settings) {
                    this.settings = Object.assign(
                        {},
                        defaultSettings,
                        data.settings
                    );
                }
            } catch (e) {
                console.log("Failed to parse mod save data:", e);
            }
        }
    },
    getAllBlueUpgrades: function () {
        // TODO: change prop names
        var allBlueUpgrades = [];

        console.log(
            "Checking upgrades, UpgradesInStore length:",
            Game.UpgradesInStore ? Game.UpgradesInStore.length : 0
        );
        console.log(
            "CookieMonsterData.Upgrades available:",
            !!(window.CookieMonsterData && window.CookieMonsterData.Upgrades)
        );

        if (
            Game.UpgradesInStore &&
            window.CookieMonsterData &&
            window.CookieMonsterData.Upgrades
        ) {
            for (var i = 0; i < Game.UpgradesInStore.length; i++) {
                var upgrade = Game.UpgradesInStore[i];
                var cmUpgrade = window.CookieMonsterData.Upgrades[upgrade.name];

                console.log(
                    "Checking upgrade:",
                    upgrade.name,
                    "cmUpgrade?:",
                    !!cmUpgrade,
                    "cmUpgrade:",
                    cmUpgrade ? cmUpgrade : "N/A",
                    "colour:",
                    cmUpgrade ? cmUpgrade.colour : "N/A"
                );

                if (cmUpgrade && cmUpgrade.colour === "Blue") {
                    var blueUpgrade = {
                        name: upgrade.name,
                        price: upgrade.getPrice(),
                        affordable: upgrade.getPrice() <= Game.cookies,
                    };
                    allBlueUpgrades.push(blueUpgrade);
                    console.log("Found blue upgrade:", blueUpgrade);
                }
            }
        }

        console.log(
            "getAllBlueUpgrades returning:",
            allBlueUpgrades.length,
            "items"
        );
        return allBlueUpgrades;
    },
    getAllGreenItems: function () {
        var allGreenItems = [];

        if (window.CookieMonsterData && window.CookieMonsterData.Objects1) {
            var items = window.CookieMonsterData.Objects1;
            Object.keys(items).forEach(function (itemName) {
                var item = Game.Objects[itemName];
                if (item && items[itemName].colour === "Green") {
                    allGreenItems.push({
                        name: itemName,
                        price: item.price,
                        affordable: item.price <= Game.cookies,
                    });
                }
            });
        }

        return allGreenItems;
    },
    performAutoUpgrade: function () {
        var mod = this;

        console.log("=== AUTO UPGRADE DEBUG START ===");
        console.log("Current cookies:", Game.cookies);
        console.log("Cookies per second:", Game.cookiesPs);
        console.log("Auto upgrade settings:", {
            autoUpgrade: mod.settings.autoUpgrade,
            autoUpgradeBlueOnly: mod.settings.autoUpgradeBlueOnly,
            autoUpgradeGreenOrBetter: mod.settings.autoUpgradeGreenOrBetter,
            autoUpgradeWaitForBlue: mod.settings.autoUpgradeWaitForBlue,
        });

        if (!window.CookieMonsterData) {
            console.log("ERROR: Cookie Monster data not available!");
            return;
        }

        console.log("Cookie Monster data available");
        console.log(
            "CookieMonsterData keys:",
            Object.keys(window.CookieMonsterData)
        );
        console.log("Objects1 available:", !!window.CookieMonsterData.Objects1);
        console.log(
            "UpgradesInStore available:",
            !!window.CookieMonsterData.UpgradesInStore
        );
        console.log(
            "UpgradesOwned available:",
            !!window.CookieMonsterData.UpgradesOwned
        );
        console.log(
            "CookieMonsterData.Upgrades available:",
            !!window.CookieMonsterData.Upgrades
        );
        console.log(
            "CookieMonsterData.Upgrades keys:",
            window.CookieMonsterData.Upgrades
                ? Object.keys(window.CookieMonsterData.Upgrades).slice(0, 10)
                : "undefined"
        );

        var buildings1 = window.CookieMonsterData.Objects1;
        var buildings10 = window.CookieMonsterData.Objects10;
        var buildings100 = window.CookieMonsterData.Objects100;
        var upgrades = window.CookieMonsterData.Upgrades;

        console.log("Buildings1 data:", buildings1);
        console.log("Buildings10 data:", buildings10);
        console.log("Buildings100 data:", buildings100);
        console.log(
            "Buildings1 keys:",
            buildings1 ? Object.keys(buildings1) : "undefined"
        );
        console.log(
            "Upgrades in store count:",
            Game.UpgradesInStore ? Game.UpgradesInStore.length : 0
        );
        console.log(
            "CookieMonsterData.Upgrades sample:",
            upgrades ? Object.keys(upgrades).slice(0, 5) : "undefined"
        );

        var availableBuildings = [];
        var availableUpgrades = [];

        if (buildings1) {
            Object.keys(buildings1).forEach(function (buildingName) {
                var building = Game.Objects[buildingName];
                if (
                    building &&
                    buildings1[buildingName].price <= Game.cookies
                ) {
                    availableBuildings.push({
                        type: "building",
                        name: buildingName + " (x1)",
                        quantity: 1,
                        price: buildings1[buildingName].price,
                        colour: buildings1[buildingName].colour,
                        pp: buildings1[buildingName].pp,
                        buy: function () {
                            building.buy(1);
                        },
                    });
                }
            });
        }

        if (buildings10) {
            Object.keys(buildings10).forEach(function (buildingName) {
                var building = Game.Objects[buildingName];
                if (
                    building &&
                    buildings10[buildingName].price <= Game.cookies
                ) {
                    availableBuildings.push({
                        type: "building",
                        name: buildingName + " (x10)",
                        quantity: 10,
                        price: buildings10[buildingName].price,
                        colour: buildings10[buildingName].colour,
                        pp: buildings10[buildingName].pp,
                        buy: function () {
                            building.buy(10);
                        },
                    });
                }
            });
        }

        if (buildings100) {
            Object.keys(buildings100).forEach(function (buildingName) {
                var building = Game.Objects[buildingName];
                if (
                    building &&
                    buildings100[buildingName].price <= Game.cookies
                ) {
                    availableBuildings.push({
                        type: "building",
                        name: buildingName + " (x100)",
                        quantity: 100,
                        price: buildings100[buildingName].price,
                        colour: buildings100[buildingName].colour,
                        pp: buildings100[buildingName].pp,
                        buy: function () {
                            building.buy(100);
                        },
                    });
                }
            });
        }

        if (Game.UpgradesInStore) {
            console.log("Processing upgrades...");
            console.log(
                "Sample upgrade names from Game.UpgradesInStore:",
                Game.UpgradesInStore.slice(0, 3).map((u) => u.name)
            );

            if (window.CookieMonsterData && window.CookieMonsterData.Upgrades) {
                console.log("Sample CookieMonster upgrade data:");
                var sampleUpgrades = Object.keys(
                    window.CookieMonsterData.Upgrades
                ).slice(0, 3);
                sampleUpgrades.forEach((upgradeName) => {
                    var cmData = window.CookieMonsterData.Upgrades[upgradeName];
                    console.log(upgradeName + ":", {
                        colour: cmData.colour,
                        pp: cmData.pp,
                        price: cmData.price,
                    });
                });
            }

            for (var i = 0; i < Game.UpgradesInStore.length; i++) {
                var upgrade = Game.UpgradesInStore[i];
                if (upgrade && upgrade.getPrice() <= Game.cookies) {
                    console.log(
                        "Processing affordable upgrade:",
                        upgrade.name,
                        "price:",
                        upgrade.getPrice()
                    );

                    var colour = "Gray";
                    var pp = Infinity;

                    if (
                        window.CookieMonsterData &&
                        window.CookieMonsterData.Upgrades
                    ) {
                        var cmUpgrade =
                            window.CookieMonsterData.Upgrades[upgrade.name];
                        console.log(
                            "CookieMonster data for",
                            upgrade.name + ":",
                            cmUpgrade
                        );
                        if (cmUpgrade) {
                            colour = cmUpgrade.colour || "Gray";
                            pp = cmUpgrade.pp || Infinity;
                            console.log("Assigned colour:", colour, "pp:", pp);
                        } else {
                            console.log(
                                "No CookieMonster data found for upgrade:",
                                upgrade.name
                            );
                        }
                    }

                    availableUpgrades.push({
                        type: "upgrade",
                        name: upgrade.name,
                        price: upgrade.getPrice(),
                        colour: colour,
                        pp: pp,
                        upgrade: upgrade,
                    });
                }
            }
        }

        var allPurchases = availableBuildings.concat(availableUpgrades);

        console.log(
            "Available buildings:",
            availableBuildings.map((b) => ({
                name: b.name,
                price: b.price,
                colour: b.colour,
                pp: b.pp,
            }))
        );
        console.log(
            "Available upgrades:",
            availableUpgrades.map((u) => ({
                name: u.name,
                price: u.price,
                colour: u.colour,
                pp: u.pp,
            }))
        );
        console.log("Total available purchases:", allPurchases.length);

        if (allPurchases.length === 0) {
            console.log("No affordable purchases available, returning");
            return;
        }

        var colorPriority = {
            Gray: 0,
            Blue: 1,
            Green: 2,
            Yellow: 3,
            Orange: 4,
            Red: 5,
            Purple: 6,
        };

        allPurchases.sort(function (a, b) {
            var colorDiff =
                (colorPriority[a.colour] || 99) -
                (colorPriority[b.colour] || 99);
            if (colorDiff !== 0) return colorDiff;
            // if same color, sort by payback period (lower is better)
            return a.pp - b.pp;
        });

        console.log(
            "Sorted purchases by efficiency:",
            allPurchases.map((p) => ({
                name: p.name,
                type: p.type,
                price: p.price,
                colour: p.colour,
                pp: p.pp,
            }))
        );

        var toBuy = null;

        if (mod.settings.autoUpgradeBlueOnly) {
            console.log("MODE: Blue only");
            var blueItems = allPurchases.filter(function (item) {
                return item.colour === "Blue";
            });

            console.log(
                "Blue items available:",
                blueItems.length > 0
                    ? blueItems.map((b) => ({ name: b.name, price: b.price }))
                    : "None"
            );

            if (blueItems.length > 0) {
                toBuy = blueItems[0];
                console.log("Selected blue item to buy:", toBuy.name);
            }
        } else if (mod.settings.autoUpgradeGreenOrBetter) {
            console.log("MODE: Green or better");

            // step 1: check if blue items are available first (highest priority)
            var blueItems = allPurchases.filter(function (item) {
                return item.colour === "Blue";
            });

            if (blueItems.length > 0) {
                toBuy = blueItems[0];
                console.log("Selected blue item to buy:", toBuy.name);
            } else {
                // step 2: no blue items available, check if we should wait for blue
                if (mod.settings.autoUpgradeWaitForBlue) {
                    // TODO: maybe add smth like "include gray items" setting
                    var shouldWaitForBlue = false;
                    console.log("Checking if we can wait for blue items...");
                    var allBlueUpgrades = mod.getAllBlueUpgrades();
                    var unaffordableBlue = allBlueUpgrades.filter(function (
                        item
                    ) {
                        return !item.affordable;
                    });

                    if (unaffordableBlue.length > 0) {
                        var cookiesNeededForBlue = Math.min.apply(
                            Math,
                            unaffordableBlue.map(function (item) {
                                return item.price - Game.cookies;
                            })
                        );

                        var secondsToBlue =
                            cookiesNeededForBlue / Math.max(Game.cookiesPs, 1);

                        console.log("Seconds to blue item:", secondsToBlue);

                        if (secondsToBlue <= 120) {
                            // TODO: make the seconds configurable
                            console.log(
                                "Waiting for blue item (within 120 seconds) instead of buying green"
                            );
                            shouldWaitForBlue = true;
                        }
                    }
                }

                if (!shouldWaitForBlue) {
                    // step 3: no blue items available, check for green items
                    console.log(
                        "No blue items available, checking green items..."
                    );
                    var greenItems = allPurchases.filter(function (item) {
                        return item.colour === "Green";
                    });

                    if (greenItems.length > 0) {
                        toBuy = greenItems[0];
                        console.log("Selected green item to buy:", toBuy.name);
                    }
                }
            }
        } else {
            console.log(
                "MODE: Best available (with wait for blue:",
                mod.settings.autoUpgradeWaitForBlue,
                ")"
            );
            if (mod.settings.autoUpgradeWaitForBlue) {
                console.log("Checking if we should wait for blue items...");
                var shouldWaitForBlue = false;
                var allBlueUpgrades = mod.getAllBlueUpgrades();

                var affordableBlue = allBlueUpgrades.filter(function (item) {
                    return item.affordable;
                });

                console.log("Affordable blue items:", affordableBlue.length);

                if (affordableBlue.length > 0) {
                    toBuy = allPurchases.find(function (item) {
                        return item.colour === "Blue";
                    });
                    console.log(
                        "Found affordable blue item:",
                        toBuy ? toBuy.name : "None"
                    );
                } else {
                    var unaffordableBlue = allBlueUpgrades.filter(function (
                        item
                    ) {
                        return !item.affordable;
                    });

                    console.log(
                        "Unaffordable blue items:",
                        unaffordableBlue.length
                    );

                    if (unaffordableBlue.length > 0) {
                        var cookiesNeededForBlue = Math.min.apply(
                            Math,
                            unaffordableBlue.map(function (item) {
                                return item.price - Game.cookies;
                            })
                        );

                        var secondsToBlue =
                            cookiesNeededForBlue / Math.max(Game.cookiesPs, 1);

                        console.log("Seconds to blue item:", secondsToBlue);

                        if (secondsToBlue <= 120) {
                            // TODO: make the seconds configurable
                            console.log(
                                "Waiting for blue item (within 120 seconds)"
                            );
                            shouldWaitForBlue = true;
                        } else {
                            console.log(
                                "Blue item too far away, buying best available"
                            );
                        }
                    }

                    if (!shouldWaitForBlue) {
                        toBuy = allPurchases[0];
                        console.log(
                            "Selected best available item:",
                            toBuy ? toBuy.name : "None"
                        );
                    }
                }
            } else {
                toBuy = allPurchases[0];
                console.log(
                    "Selected best available item (no wait):",
                    toBuy ? toBuy.name : "None"
                );
            }
        }

        console.log(
            "Final purchase decision:",
            toBuy
                ? {
                      name: toBuy.name,
                      type: toBuy.type,
                      price: toBuy.price,
                      colour: toBuy.colour,
                  }
                : "Nothing to buy"
        );

        if (toBuy) {
            console.log("Attempting to purchase:", toBuy.name);
            var success = false;

            try {
                if (toBuy.type === "building") {
                    console.log("Buying building:", toBuy.name);
                    toBuy.buy();
                    success = true;
                } else if (toBuy.type === "upgrade") {
                    console.log("Buying upgrade:", toBuy.name);
                    toBuy.upgrade.buy();
                    success = true;
                }
            } catch (error) {
                console.error("Error purchasing item:", error);
            }

            if (success) {
                console.log("Purchase successful!");
                Game.Notify(
                    `Auto-purchased: ${toBuy.name}`,
                    `Efficiency: ${toBuy.colour} | Cost: ${toBuy.price}`,
                    [16, 5],
                    2000
                );
            } else {
                console.log("Purchase failed or no valid purchase method");
            }
        } else {
            console.log("No item selected for purchase");
        }
    },
    performStockTrading: function () {
        var bankBuilding = Game.ObjectsById[5];
        if (!bankBuilding || !bankBuilding.minigame) {
            return;
        }

        var stockMarket = bankBuilding.minigame;

        // TODO: make this configurable
        var stockSettings = {
            0: { name: "Cereals", symbol: "CRL", buyBelow: 4.5, sellAbove: 75 },
            1: {
                name: "Chocolate",
                symbol: "CHC",
                buyBelow: 7.5,
                sellAbove: 120,
            },
            2: { name: "Butter", symbol: "BTR", buyBelow: 6.5, sellAbove: 85 },
            3: { name: "Sugar", symbol: "SUG", buyBelow: 7.5, sellAbove: 92 },
            4: { name: "Nuts", symbol: "NUT", buyBelow: 8, sellAbove: 98 },
            5: { name: "Salt", symbol: "SLT", buyBelow: 5, sellAbove: 100 },
            6: { name: "Vanilla", symbol: "VNL", buyBelow: 8.5, sellAbove: 93 },
            7: { name: "Eggs", symbol: "EGG", buyBelow: 6.5, sellAbove: 116 },
            8: {
                name: "Cinnamon",
                symbol: "CNM",
                buyBelow: 7.5,
                sellAbove: 120,
            },
            9: { name: "Cream", symbol: "CRM", buyBelow: 40, sellAbove: 128 },
            10: { name: "Jam", symbol: "JAM", buyBelow: 5, sellAbove: 135 },
            11: {
                name: "White chocolate",
                symbol: "WCH",
                buyBelow: 28,
                sellAbove: 143,
            },
            12: { name: "Honey", symbol: "HNY", buyBelow: 48, sellAbove: 138 },
            13: {
                name: "Cookies",
                symbol: "CKI",
                buyBelow: 33,
                sellAbove: 138,
            },
            14: {
                name: "Recipes",
                symbol: "RCP",
                buyBelow: 74,
                sellAbove: 144,
            },
            15: {
                name: "Subsidiaries",
                symbol: "SBD",
                buyBelow: 70,
                sellAbove: 142,
            },
            16: {
                name: "Publicists",
                symbol: "PBL",
                buyBelow: 55,
                sellAbove: 167,
            },
            17: {
                name: "Your Bakery",
                symbol: "YOU",
                buyBelow: 20,
                sellAbove: 180,
            },
        };

        var totalProfit = 0;
        var transactionsMade = 0;

        for (
            var stockId = 0;
            stockId < Math.min(18, stockMarket.goodsById.length);
            stockId++
        ) {
            var stock = stockMarket.goodsById[stockId];
            var settings = stockSettings[stockId];

            if (!stock || !settings) continue;

            var currentPrice = stock.val;
            var currentStock = stock.stock;
            var maxStock = stockMarket.getGoodMaxStock(stock);
            var availableSlots = maxStock - currentStock;

            if (currentPrice < settings.buyBelow && availableSlots > 0) {
                var buyAmount = Math.min(availableSlots, 10);
                var cost = buyAmount * currentPrice;

                // Check if we can afford it
                if (Game.cookies >= cost) {
                    try {
                        stockMarket.buyGood(stockId, buyAmount);
                        totalProfit -= cost;
                        transactionsMade++;
                        console.log(
                            `Stock Trading: Bought ${buyAmount} ${
                                settings.symbol
                            } (${settings.name}) at $${currentPrice.toFixed(
                                2
                            )} each`
                        );
                    } catch (error) {
                        console.error(
                            `Failed to buy ${settings.symbol}:`,
                            error
                        );
                    }
                }
            }
            // Sell logic: price is above sell threshold and we have stock to sell
            else if (currentPrice > settings.sellAbove && currentStock > 0) {
                var sellAmount = currentStock; // Sell all stock when profitable
                var revenue = sellAmount * currentPrice;

                try {
                    stockMarket.sellGood(stockId, sellAmount);
                    totalProfit += revenue;
                    transactionsMade++;
                    console.log(
                        `Stock Trading: Sold ${sellAmount} ${
                            settings.symbol
                        } (${settings.name}) at $${currentPrice.toFixed(
                            2
                        )} each`
                    );
                } catch (error) {
                    console.error(`Failed to sell ${settings.symbol}:`, error);
                }
            }
        }

        // Show summary notification if any transactions were made
        if (transactionsMade > 0) {
            var profitText =
                totalProfit >= 0
                    ? `+$${totalProfit.toFixed(0)}`
                    : `-$${Math.abs(totalProfit).toFixed(0)}`;
            Game.Notify(
                `Stock Trading: ${transactionsMade} transactions`,
                `Net change: ${profitText}`,
                [16, 5],
                3000
            );
        }
    },
});
