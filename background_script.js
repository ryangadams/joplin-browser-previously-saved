const JOPLIN_DEFAULT_PORT = 41184
const JOPLIN_BASE_URL = `http://localhost:${JOPLIN_DEFAULT_PORT}`;


async function getToken() {
    const res = await browser.storage.local.get('joplin_auth_token');
    return res.joplin_auth_token ?? undefined;
}

async function checkForPreviousSave() {
    const authToken = await getToken();
    if (!authToken) return;
    const gettingActiveTab = await browser.tabs.query({active: true, currentWindow: true});
    const activeTab = gettingActiveTab[0];
    const joplinSearchURL = `${JOPLIN_BASE_URL}/search?fields=id,title,created_time&query=sourceurl:${activeTab.url}&token=${authToken}`;
    const response = await fetch(joplinSearchURL);
    const result = await response.json();
    if (result.items.length > 0) {
        await browser.storage.session.set({currentPageData: result.items});
        browser.pageAction.show(gettingActiveTab[0].id);
    }
}

browser.tabs.onActivated.addListener(() => checkForPreviousSave());

browser.tabs.onUpdated.addListener(() => checkForPreviousSave(), {properties: ["url"]});

