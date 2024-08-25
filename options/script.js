async function saveOptions(e) {
    e.preventDefault();
    await browser.storage.local.set({
        'joplin_auth_token': document.querySelector("#joplin_auth_token").value
    });
    console.log("Saved");
}

async function restoreOptions() {
    res = await browser.storage.local.get('joplin_auth_token');
    document.querySelector("#joplin_auth_token").value = res['joplin_auth_token'] || '';
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("form").addEventListener("change", saveOptions, false);
