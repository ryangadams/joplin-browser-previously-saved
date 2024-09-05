function buildTemplate(noteData) {
    const template = document.getElementById("info-template");

    const creationTime = new Date(noteData.date);
    const formattedDate = creationTime.toLocaleDateString('en-GB', {year: 'numeric', month: 'long', day: 'numeric'})

    const noteContent = template.content.cloneNode(true);
    if (noteData.count > 0) {
        noteContent.querySelector(".note-count").textContent = `${noteData.count} ${noteData.count === 1 ? "once": "times"}, mostly recently`;
    }

    noteContent.querySelector(".note-date").textContent = formattedDate;
    noteContent.querySelector(".note-title").textContent = noteData.title;
    noteContent.querySelector(".note-title").addEventListener("click", (e) => {
        e.preventDefault();
        browser.runtime.sendMessage("close the new tab");
        const windowProxy = window.open(`joplin://x-callback-url/openNote?id=${noteData.id}`, "joplinView");
        // windowProxy.close();
    });
    return noteContent;
}

async function showNoteInfo() {
    const joplinData = await browser.storage.session.get("currentPageData");

    const pageData = joplinData.currentPageData;
    const noteData = {
        count: pageData.length,
        date: new Date(pageData[0].created_time),
        title: pageData[0].title,
        id: pageData[0].id,
    };

    const targetElement = document.getElementById("info-box");
    targetElement.appendChild(buildTemplate(noteData));
}
window.addEventListener("DOMContentLoaded", showNoteInfo);
