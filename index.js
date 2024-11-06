const axios = require('axios')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// Function to log hijacking actions
const logHijacking = (message) => {
    const logFilePath = path.join(__dirname, 'code.txt')
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] ${message}\n`

    // Append the log message to code.txt
    fs.appendFileSync(logFilePath, logMessage, 'utf8')
}

const displayCountryCodes = async (headers) => {
    console.clear()
    try {
        const url = "http://www.insecam.org/en/jsoncountries/"
        const resp = await axios.get(url, { headers })
        const countries = Object.entries(resp.data.countries)

        console.log("Available Country Codes:")
        console.log("──────────────────────────────────────────────────────────")

        for (let i = 0 i < countries.length i += 2) {
            const [code1, info1] = countries[i]
            const country1 = `(${code1}) - ${info1.country} (Cameras: ${info1.count})`

            let country2 = ""
            if (i + 1 < countries.length) {
                const [code2, info2] = countries[i + 1]
                country2 = `(${code2}) - ${info2.country} (Cameras: ${info2.count})`
            }

            console.log(`${country1.padEnd(45)} | ${country2}`)
        }

        console.log("──────────────────────────────────────────────────────────")
    } catch (error) {
        console.error('Error fetching country codes:', error.message)
    }
}

const hijackCameras = async (headers, countryCode) => {
    console.clear()
    console.log(`Attempting to hijack cameras in country code: ${countryCode}...`)

    try {
        let res = await axios.get(`http://www.insecam.org/en/bycountry/${countryCode}`, { headers })
        const lastPageMatch = res.data.match(/pagenavigator\("\?page=", (\d+)/)
        if (!lastPageMatch) {
            console.log('Could not determine the number of pages.')
            logHijacking(`Failed to hijack cameras for ${countryCode}: Could not determine pages.`)
            return
        }

        const lastPage = parseInt(lastPageMatch[1])
        const findIpRegex = /http:\/\/\d+\.\d+\.\d+\.\d+:\d+/g
        const ips = []

        for (let page = 1 page <= lastPage page++) {
            res = await axios.get(`http://www.insecam.org/en/bycountry/${countryCode}/?page=${page}`, { headers })
            const pageIps = res.data.match(findIpRegex)
            if (pageIps) {
                ips.push(...pageIps)
            }
        }

        if (ips.length === 0) {
            console.log('No IPs found.')
            logHijacking(`No IPs found for ${countryCode}.`)
            return
        }

        const filePath = path.join(__dirname, `${countryCode}.txt`)
        fs.writeFileSync(filePath, ips.join('\n'), 'utf8')
        console.log(`Found ${ips.length} IPs. Saved to ${filePath}`)

        // Log the hijacking result to code.txt
        logHijacking(`Successfully hijacked cameras for ${countryCode}: Found ${ips.length} IPs, saved to ${filePath}.`)

        // Read and display the content of the countryCode.txt file
        const fileContent = fs.readFileSync(filePath, 'utf8')
        console.log("\nIPs Found and Saved to File:")
        console.log(fileContent)
    } catch (error) {
        console.error('Error:', error.message)
        logHijacking(`Error hijacking cameras for ${countryCode}: ${error.message}`)
    }
}

const mainMenu = async () => {
    const headers = {
        "Accept": "text/html,application/xhtml+xml,application/xmlq=0.9,image/avif,image/webp,image/apng,*/*q=0.8,application/signed-exchangev=b3q=0.7",
        "Cache-Control": "max-age=0",
        "Connection": "keep-alive",
        "Host": "www.insecam.org",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
    }

    const showMainMenu = () => {
        console.clear()
        rl.question("\nChoose an option:\n1. Display country codes and camera counts\n2. Hijack cameras by country code\n3. Exit\nEnter your choice (1, 2, or 3): ", async (choice) => {
            if (choice === '1') {
                await displayCountryCodes(headers)

                rl.question("\nPress 'b' to go back to the main menu or 'q' to quit: ", (subChoice) => {
                    console.clear()
                    if (subChoice.toLowerCase() === 'b') {
                        showMainMenu()
                    } else {
                        console.log("Exiting...")
                        rl.close()
                    }
                })
            } else if (choice === '2') {
                rl.question("Enter the country code to hijack: ", async (countryCode) => {
                    await hijackCameras(headers, countryCode)

                    rl.question("\nPress 'b' to go back to the main menu or 'q' to quit: ", (subChoice) => {
                        console.clear()
                        if (subChoice.toLowerCase() === 'b') {
                            showMainMenu()
                        } else {
                            console.log("Exiting...")
                            rl.close()
                        }
                    })
                })
            } else if (choice === '3') {
                console.clear()
                console.log("Exiting...")
                rl.close()
            } else {
                console.clear()
                console.log("Invalid choice. Please enter 1, 2, or 3.")
                showMainMenu()  // Prompt again on invalid input
            }
        })
    }

    showMainMenu()
}

// Run the program
mainMenu()
