Necce
<div>
# NIK Parser

This script is designed to gather publicly accessible IP camera feeds from the website [Insecam](http://www.insecam.org/). The script allows you to view and hijack IP cameras based on the country code. It provides an interactive terminal-based interface to display country codes, retrieve camera feeds, and save them to a file.

## Features

- **Country Code Display**: Lists available countries along with their camera counts.
- **Camera Hijacking**: Allows hijacking of cameras by entering a country code.
- **IP Saving**: Saves the found IP addresses to a `.txt` file and shows the results in the terminal.
- **Log Output**: Logs hijacking activities to `countryCode.txt` file for auditing purposes.

## Installation

To set up the project locally, follow these steps:

1. ***Install needed packages termux***

    ```bash
    pkg update
    pkg upgrade
    pkg install npm
    pkg install nodejs
    pkg install git
    pkg install yarn
    termux-setup-storage
    ```
    
2. ***Clone the repository:***

    ```bash
    git clone https://github.com/DFansyah/CCTV-HiJack.git
    cd CCTV-HiJack
   ```
   
3. ***For run this script***

    ```bash
    npm install or yarn install
    npm start or node index.js
    ```
</div>
</body>