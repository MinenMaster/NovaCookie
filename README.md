# NovaCookie - a Cookie Clicker Mod

A comprehensive Cookie Clicker mod that enhances gameplay with automated features, (some) statistics tracking, and intelligent upgrade purchasing.

## Table of Contents

-   [Features](#features)
-   [Requirements](#requirements)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Settings Reference](#settings-reference)
-   [Recommended "Auto Upgrade" Settings](#recommended-auto-upgrade-settings)
-   [How Cookie Monster Integration Works](#how-cookie-monster-integration-works)
-   [Performance Notes](#performance-notes)
-   [Troubleshooting](#troubleshooting)
-   [Found a bug or have a suggestion?](#found-a-bug-or-have-a-suggestion)
-   [Version Information](#version-information)
-   [File Structure](#file-structure)
-   [License](#license)

## Features

### 🍪 Auto-Click Big Cookie Clicker

-   Automatically clicks the big cookie for maximum cookie production
-   Configurable toggle key (default: comma key)
-   Real-time on/off switching with notifications

### ✨ Auto-Click Golden Cookie Clicker

-   Automatically detects and clicks golden cookies as they appear
-   Never miss a golden cookie again
-   Tracks total golden cookies clicked with counter

### 📈 Auto Stock Trading

-   Intelligent automated stock market trading
-   Pre-configured buy/sell points for optimal profit
-   Trades automatically every minute when stock market is unlocked
-   Maximizes profit from the stock market minigame

### 🎯 Smart Auto-Upgrade System

**The crown jewel of this mod** - An advanced purchasing system that integrates with Cookie Monster for optimal efficiency.

#### How It Works

-   Uses Cookie Monster's efficiency calculations to determine the best purchases
-   Prioritizes items by efficiency color coding (Blue > Green > Yellow > Orange > Red)
-   Considers both buildings and upgrades equally
-   Makes intelligent decisions about when to buy vs. wait

#### Upgrade Modes

-   **Default**: Automatically purchases the best available upgrades/buildings
-   **Blue Only**: Purchase only the most efficient (blue) items
-   **Green or Better**: Purchase blue or green items, ignore less efficient ones
-   **Wait for Blue**: Hold off on purchases if a blue item will be affordable soon (within 2 minutes)

#### Smart Purchase Logic

The mod analyzes all available purchases and:

1. Sorts by efficiency color (blue is best)
2. Within each color, sorts by payback period (lower is better)
3. Provides notifications of purchases made

### ⚙️ In-Game Settings Menu

-   Full settings interface accessible from Cookie Clicker's Options menu
-   Expandable/collapsible section to save screen space
-   Toggle all features on/off
-   Customize keybinds
-   Real-time settings changes without restart

## Requirements

-   Cookie Clicker v2.053 or compatible
-   Cookie Monster (required for auto-upgrade functionality)

## Installation

1. Place all mod files in your Cookie Clicker mods directory:

    ```
    Cookie Clicker/resources/app/mods/local/NovaCookie/
    ```

> Note: You can access the mod directory by going to Cookie Clicker → Options → Manage Mods → Open /mods folder

2. Enable the mod in Cookie Clicker's mod menu

3. **For Auto-Upgrade features**: Install and enable [Cookie Monster](https://cookiemonsterteam.github.io/CookieMonster/) mod

## Usage

1. **Access Settings**: Go to Options → NovaCookie Settings (at the very bottom at the moment)
2. **Configure Features**: Enable and configure desired utility features
3. **Set Keybinds**: Customize toggle keys for manual control
4. **Monitor Progress**: Watch notifications for automated actions

## Settings Reference

| Setting                          | Description                                         | Default   |
| -------------------------------- | --------------------------------------------------- | --------- |
| Auto-Click Big Cookie            | Continuously clicks the main cookie                 | OFF       |
| Auto-Click Big Cookie Toggle Key | Key to toggle big cookie clicking                   | Comma (,) |
| Auto-Click Golden Cookie         | Automatically clicks golden cookies                 | OFF       |
| Notify Golden Cookie Counter     | Shows notifications when golden cookies are clicked | ON        |
| Auto Stock Trading               | Automated stock market trading                      | OFF       |
| Auto Upgrade                     | Smart building/upgrade purchasing                   | OFF       |
| Auto Upgrade - Blue Only         | Only buy most efficient (blue) items                | OFF       |
| Auto Upgrade - Green or Better   | Only buy green or blue items                        | ON        |
| Auto Upgrade - Wait for Blue     | Wait for blue items before buying others            | OFF       |

## Recommended "Auto Upgrade" Settings

-   ✅ Auto Upgrade: ON
-   ❌ Auto Upgrade - Blue Only: OFF
-   ✅ Auto Upgrade - Wait for Blue: ON
-   ✅ Auto Upgrade - Green or Better: ON

## How Cookie Monster Integration Works

The auto-upgrade system relies on Cookie Monster's efficiency calculations:

-   **Blue**: Best efficiency (shortest payback period)
-   **Green**: Very good efficiency
-   **Yellow**: Good efficiency
-   **Orange**: Decent efficiency
-   **Red**: Poor efficiency
-   **Purple**: Very poor efficiency
-   **Gray**: Negative or infinite payback period

The mod automatically detects Cookie Monster's data and makes purchasing decisions based on these efficiency ratings.

## Performance Notes

-   Auto-clickers run at intervals (10ms for cookies, 100ms for golden cookies)
-   Stock trading checks every 60 seconds
-   Auto-upgrade evaluates purchases every 10ms
-   All settings are saved automatically and persist across game sessions

> Note: This mod is not at all optimized for performance at the moment. This will be improved in future updates.

## Troubleshooting

**Auto-upgrade not working?**

-   Ensure Cookie Monster mod is installed and enabled
-   Check that auto-upgrade is enabled in settings
-   Verify you have enough cookies for available purchases

**Settings not saving?**

-   Settings save automatically when changed
-   Data persists in Cookie Clicker's save system

**Performance issues?**

-   Disable unused features to reduce CPU usage
-   Auto-clickers can be toggled off when not needed

## Found a bug or have a suggestion?

-   Please report issues on the [GitHub repository](https://github.com/MinenMaster/NovaCookie/issues)
-   Feel free to contribute improvements or new features via pull requests!

## Version Information

-   **Mod Version**: 1.0
-   **Author**: MinenMaster
-   **Compatible Game Version**: Cookie Clicker 2.053
-   **Last Updated**: July 5, 2025

## File Structure

```
NovaCookie/
├── main.js       # Main mod logic and functionality
├── info.txt      # Mod metadata
└── README.md     # This file
```

## License

This mod is provided as-is for educational and entertainment purposes. Use at your own risk.

---

_Happy clicking!_ 🍪
