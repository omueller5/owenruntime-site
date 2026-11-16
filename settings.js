// Function to verify login using browser storage
function handleAdminLogin(inputPassword) {
    const savedConfig = localStorage.getItem('owenlab_admin_config');

    if (!savedConfig) {
        alert("No configuration found in this browser. Please run the setup command first.");
        return false;
    }

    const config = JSON.parse(savedConfig);

    // Hash the user's typed password using SHA-256 to compare with stored hash
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(inputPassword)).then(buffer => {
        const hashArray = Array.from(new Uint8Array(buffer));
        const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        if (hashedPassword === config.passwordHash) {
            console.log("Login successful!");
            // Redirect or load your admin links (config.jellyfinUrl, config.serverHtml, etc.)
            window.location.href = config.serverHtml;
        } else {
            alert("Incorrect password.");
        }
    });
}