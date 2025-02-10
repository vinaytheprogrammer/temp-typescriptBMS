export class BookUtilities {
    static validateTitle(title) {
        if (title && !this.validStringPattern.test(title)) {
            // Check if the title is valid  and not empty
            toastr.error(`title must only contain letters, numbers, and spaces.`);
            return "Special Characters not allowed";
        }
        return title;
    }
    static validateAuthor(author) {
        if (author && !this.validStringPattern.test(author)) {
            // Check if the title is valid  and not empty
            toastr.error(`author must only contain letters, numbers, and spaces.`);
            return "Special Characters not allowed";
        }
        return author;
    }
    static validateIsbn(isbn) {
        if (isNaN(isbn)) {
            toastr.error("isbn must be in Numbers");
            return -1;
        }
        return isbn > 0
            ? isbn
            : Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000;
    }
    static validatePrice(price) {
        if (isNaN(price)) {
            toastr.error("price must be in Numbers");
            return -1;
        }
        return price > 0 ? price : null;
    }
    static validatePublicationDate(pubDate) {
        if (!pubDate) {
            return "";
        }
        const pubDateObj = new Date(pubDate);
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        const currentDate = new Date().toISOString().split("T")[0];
        if (!pubDateObj ||
            isNaN(pubDateObj.getTime()) ||
            pubDateObj > new Date() ||
            !regex.test(pubDate)) {
            toastr.error("Invalid publication date.");
            return "Invalid publication date";
        }
        return pubDateObj &&
            !isNaN(pubDateObj.getTime()) &&
            pubDateObj <= new Date() &&
            regex.test(pubDate)
            ? pubDate
            : currentDate;
    }
    static showLoader(message = "Loading...") {
        const loader = document.createElement("div");
        loader.id = "globalLoader";
        loader.classList.add("fixed", "top-0", "left-0", "w-full", "h-screen", "bg-black", "bg-opacity-50", "flex", "justify-center", "items-center", "z-50");
        loader.innerHTML = `
            <div class="flex items-center space-x-4">
              <svg class="w-12 h-12 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <h1 class="text-white font-bold text-lg">${message}</h1>
            </div>
          `;
        document.body.appendChild(loader);
    }
    static hideLoader() {
        var _a;
        (_a = document.getElementById("globalLoader")) === null || _a === void 0 ? void 0 : _a.remove();
    }
    // Helper method to get input values
    static getInputValue(id) {
        var _a;
        return (((_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.value.trim()) || "");
    }
    // Centralized validation logic
    static isValidInput(title, author, isbn, price, pubDate) {
        if (BookUtilities.validateTitle(title) === "Special Characters not allowed")
            return false;
        if (BookUtilities.validateAuthor(author) === "Special Characters not allowed")
            return false;
        if (BookUtilities.validateIsbn(isbn) === -1)
            return false;
        if (BookUtilities.validatePrice(price) === -1)
            return false;
        if (BookUtilities.validatePublicationDate(pubDate) ===
            "Invalid publication date")
            return false;
        return true;
    }
    // Reset form fields
    static resetForm(elementIds) {
        elementIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = "";
            }
        });
    }
}
BookUtilities.validStringPattern = /^[a-zA-Z0-9\s]+$/;
