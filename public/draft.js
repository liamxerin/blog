    // Function to save all form inputs as a draft in localStorage
    function saveDraft() {
        const draftData = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            categories: document.getElementById('categories').value,
            description: document.getElementById('description').value,
            content: document.getElementById('content').value,
            tags: document.getElementById('tags').value,
            postType: document.getElementById('postType').value
        };
        localStorage.setItem('draftData', JSON.stringify(draftData));
        console.log("Draft saved automatically!");
    }

    // Function to load draft data from localStorage
    function loadDraft() {
        const draftData = JSON.parse(localStorage.getItem('draftData'));
        if (draftData) {
            document.getElementById('title').value = draftData.title || '';
            document.getElementById('author').value = draftData.author || '';
            document.getElementById('categories').value = draftData.categories || '';
            document.getElementById('description').value = draftData.description || '';
            document.getElementById('content').value = draftData.content || '';
            document.getElementById('tags').value = draftData.tags || '';
            document.getElementById('postType').value = draftData.postType || '';
            console.log("Draft loaded successfully!");
        }
    }

    // Function to clear the draft from localStorage
    function clearDraft() {
        localStorage.removeItem('draftData');
        console.log("Draft cleared successfully!");
    }

    // Save draft before the page unloads
    window.addEventListener('beforeunload', saveDraft);

    // Load draft when the page loads
    window.onload = loadDraft;

    // Clear draft when the form is submitted
    function handleFormSubmit() {
        clearDraft();
        return true; // Allow form submission to continue
    }