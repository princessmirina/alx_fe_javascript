// Initial quotes array
let quotes = [
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    category: "Motivation",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "Life",
  },
  {
    text: "Do what you can, with what you have, where you are.",
    category: "Motivation",
  },
];

// Load quotes and filter from local storage
window.onload = () => {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) quotes = JSON.parse(storedQuotes);
  populateCategories();
  restoreLastFilter();
  showRandomQuote();
};

// Show random quote
function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();
  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").textContent =
      "No quotes available for this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  document.getElementById("quoteDisplay").textContent =
    filteredQuotes[randomIndex].text;
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return alert("Please enter both text and category.");

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  showRandomQuote();
}

function createAddQuoteForm() {
  const container = document.getElementById("quoteFormContainer");
  container.textContent = ""; // Clear previous form if any

  // Create input for quote text
  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  // Create input for category
  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  // Create add button
  const addButton = document.createElement("button");
  addButton.id = "addQuoteButton";
  addButton.innerText = "Add Quote";
  addButton.addEventListener("click", addQuote); // Attach function

  // Append elements to container
  container.appendChild(textInput);
  container.appendChild(categoryInput);
  container.appendChild(addButton);
}

let selectedCategory = "all"; // Global variable

// On page load
window.onload = () => {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) quotes = JSON.parse(storedQuotes);
  populateCategories();
  restoreLastFilter();
  showRandomQuote();
  createAddQuoteForm();
};

// Update selectedCategory when dropdown changes
function filterQuotes() {
  selectedCategory = document.getElementById("categoryFilter").value;
  saveLastFilter(selectedCategory);
  showRandomQuote();
}

// Get quotes based on selectedCategory
function getFilteredQuotes() {
  return selectedCategory === "all"
    ? quotes
    : quotes.filter((q) => q.category === selectedCategory);
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
// Populate categories dynamically
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const currentValue = select.value;
  const categories = [...new Set(quotes.map((q) => q.category))];
  select.innerHTML = <option value="all">All Categories</option>;
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.text = cat;
    select.appendChild(option);
  });
  select.value = currentValue || "all";
  saveLastFilter(select.value);
}

// Filter quotes
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  saveLastFilter(selected);
  showRandomQuote();
}
// Get quotes based on filter
function getFilteredQuotes() {
  const filter = document.getElementById("categoryFilter").value;
  return filter === "all"
    ? quotes
    : quotes.filter((q) => q.category === filter);
}

// Save last selected filter
function saveLastFilter(filter) {
  localStorage.setItem("lastFilter", filter);
}

// Restore last filter
function restoreLastFilter() {
  const lastFilter = localStorage.getItem("lastFilter") || "all";
  document.getElementById("categoryFilter").value = lastFilter;
}

// Export quotes to JSON
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch (e) {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

//task 3

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API

// Periodic sync every 30 seconds
setInterval(syncWithServer, 30000);

async function syncWithServer() {
  try {
    // Fetch mock server data
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // For demo, only take first 5 quotes from server
    const serverQuotes = serverData.slice(0, 5).map((item) => ({
      text: item.title,
      category: "Server",
    }));

    // Merge with local, server takes precedence
    serverQuotes.forEach((sq) => {
      if (!quotes.some((q) => q.text === sq.text)) quotes.push(sq);
    });

    saveQuotes();
    populateCategories();

    console.log("Synced with server successfully");
  } catch (err) {
    console.error("Error syncing with server:", err);
  }
}

//Optional Conflict Notification

function notifyUser(message) {
  const div = document.createElement("div");
  div.textContent = message;
  div.style.background = "#fffae6";
  div.style.border = "1px solid #ffd700";
  div.style.padding = "10px";
  div.style.margin = "10px 0";
  document.body.prepend(div);
  setTimeout(() => div.remove(), 5000);
}
