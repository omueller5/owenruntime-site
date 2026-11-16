function handleAdminLogin(inputPassword) {
    const savedConfig = localStorage.getItem('owenlab_admin_config');
    console.log("Raw localStorage config:", savedConfig);

    if (!savedConfig) {
        alert("No configuration found in localStorage!");
        return false;
    }

    const config = JSON.parse(savedConfig);
    console.log("Parsed config object:", config);

    // Direct plaintext comparison
    if (inputPassword === config.password) {
        console.log("Login successful! Rendering links...");
        renderAdminLinks(config.links);
    } else {
        alert("Incorrect password.");
        console.log("Password mismatch. Input was:", inputPassword, "Expected was:", config.password);
    }
}

function renderAdminLinks(links) {
    const container = document.getElementById('links-container');
    if (!container) {
        console.error("Error: #links-container element not found in HTML!");
        return;
    }

    container.innerHTML = '';
    links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.innerText = `${link.name} - ${link.sub}`;
        a.style.display = "block";
        container.appendChild(a);
    });
}