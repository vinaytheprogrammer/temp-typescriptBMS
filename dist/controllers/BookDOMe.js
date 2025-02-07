import { BookAgeCalculator } from '../BookAgeCalculator.js';
import { BookUtilities } from './BookUtilities.js';
export class BookDOMe {
    constructor(books) {
        var _a, _b;
        this.books = [];
        this.originalBooks = [];
        this.booksPerPage = 5;
        this.sortAscButton = document.getElementById('sortAsc');
        this.sortDescButton = document.getElementById('sortDesc');
        this.books = books;
        this.originalBooks = [...books];
        this.bookListDiv = document.getElementById('bookList');
        this.bookCountDiv = document.getElementById('bookCount');
        (_a = this.sortAscButton) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => this.sortBooks('asc'));
        (_b = this.sortDescButton) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => this.sortBooks('desc'));
    }
    updateBookDisplay(books = this.books, currentPage = 1) {
        const totalBooks = books.length;
        const startIndex = (currentPage - 1) * this.booksPerPage;
        const endIndex = Math.min(startIndex + this.booksPerPage, totalBooks);
        if (this.bookCountDiv) {
            this.bookCountDiv.textContent = `Number of books: ${totalBooks}`;
        }
        if (this.bookListDiv) {
            this.bookListDiv.innerHTML = totalBooks === 0 ? 'No Results' : '';
            if (totalBooks > 0) {
                const wrapper = document.createElement('div');
                wrapper.className = 'overflow-x-auto w-full';
                const table = document.createElement('table');
                table.className = 'min-w-full table-auto bg-white shadow-lg rounded-lg text-sm sm:text-base';
                table.innerHTML = `
          <thead class="bg-gray-200 text-left">
            <tr class="bg-gray-300 text-xs sm:text-sm uppercase tracking-wide text-gray-700">
              <th class="px-1 py-1 sm:px-3 sm:py-2 text-left">Title</th>
              <th class="px-1 py-1 sm:px-3 sm:py-2 text-left">Author</th>
              <th class="px-1 py-1 sm:px-3 sm:py-2 text-left">ISBN</th>
              <th class="px-1 py-1 sm:px-3 sm:py-2 text-left">Publication Date</th>
              <th class="px-1 py-1 sm:px-3 sm:py-2 text-left">Genre</th>
              <th class="px-1 py-1 sm:px-3 sm:py-2 text-left">Age</th>
              <th class="px-1 py-1 sm:px-3 sm:py-2 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            ${books.slice(startIndex, endIndex).map(book => `
              <tr class="border-t border-gray-200 hover:bg-gray-100 text-xs sm:text-sm">
                <td class="px-1 py-1 sm:px-3 sm:py-2 font-medium text-gray-700">${book.title}</td>
                <td class="px-1 py-1 sm:px-3 sm:py-2 text-gray-600">${book.author}</td>
                <td class="px-1 py-1 sm:px-3 sm:py-2 text-gray-600">${book.isbn}</td>
                <td class="px-1 py-1 sm:px-3 sm:py-2 text-gray-600">${book.pubDate}</td>
                <td class="px-1 py-1 sm:px-3 sm:py-2 text-gray-600">${book.genre}</td>
                <td class="px-1 py-1 sm:px-3 sm:py-2 text-gray-600">${BookAgeCalculator.calculateAge(book.pubDate)}</td>
                <td class="px-1 py-1 sm:px-3 sm:py-2 text-green-600 font-semibold">${book.price}</td>
              </tr>
            `).join('')}
          </tbody>
        `;
                wrapper.appendChild(table);
                this.bookListDiv.appendChild(wrapper);
                if (totalBooks > this.booksPerPage) {
                    this.addPaginationButtons(currentPage, Math.ceil(totalBooks / this.booksPerPage));
                }
            }
        }
    }
    addPaginationButtons(currentPage, totalPages) {
        const paginationDiv = document.createElement('div');
        paginationDiv.className = 'flex justify-center mt-4 space-x-2';
        const createButton = (label, page, disabled) => {
            const button = document.createElement('button');
            button.textContent = label;
            button.className = 'px-8 py-1 sm:px-4 sm:py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-xs sm:text-sm';
            button.disabled = disabled;
            button.addEventListener('click', () => this.updateBookDisplay(this.books, page));
            return button;
        };
        paginationDiv.appendChild(createButton('Previous', currentPage - 1, currentPage === 1));
        paginationDiv.appendChild(createButton('Next', currentPage + 1, currentPage === totalPages));
        if (this.bookListDiv) {
            const existingPagination = this.bookListDiv.querySelector('.flex.justify-center');
            if (existingPagination) {
                existingPagination.remove();
            }
            this.bookListDiv.appendChild(paginationDiv);
        }
    }
    static closeForm() {
        var _a;
        (_a = document.getElementById('formContainer')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden'); // hide the Container
        document.querySelectorAll('#formContainer > div').forEach(div => div.classList.add('hidden')); // hide all the forms within the container
    }
    sortBooks(order) {
        this.books.sort((a, b) => order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
        this.updateBookDisplay(this.books);
    }
    handleCategorize(categorizedBookListDiv) {
        this.categorizedBookListDiv = categorizedBookListDiv;
        if (!this.books || this.books.length === 0) {
            toastr.error('No books available');
            return;
        }
        const genres = this.books.reduce((acc, book) => {
            if (!acc[book.genre]) {
                acc[book.genre] = [];
            }
            acc[book.genre].push(book);
            return acc;
        }, {});
        const categorizedHTML = Object.keys(genres)
            .map((genre) => {
            const booksInGenre = genres[genre].slice(0, 5); // Limit to 5 books per genre
            return `
        <div class="border rounded-lg shadow-md bg-white p-4 m-4">
          <h3 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
            ${genre.charAt(0).toUpperCase() + genre.slice(1)}
          </h3>
          <ul class="list-disc pl-5 space-y-2">
            ${booksInGenre
                .map((book) => {
                var _a;
                return `
                  <li>
                    <strong>${book.title}</strong> by <em>${book.author}</em>
                    <br />
                    <span class="text-sm text-gray-600">ISBN: ${book.isbn}, Published: ${book.pubDate}, Price: ${((_a = book.price) !== null && _a !== void 0 ? _a : 0).toFixed(2)}</span>
                  </li>
                `;
            })
                .join('')}
          </ul>
          ${genres[genre].length > 5
                ? `<p class="text-sm text-blue-600 italic mt-3">And ${genres[genre].length - 5} more...</p>`
                : ''}
        </div>
      `;
        })
            .join('');
        if (this.categorizedBookListDiv) {
            this.categorizedBookListDiv.innerHTML = `
      <h2 class="text-xl font-bold text-gray-900 mb-4">Categorized Books</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${categorizedHTML}
      </div>
    `;
        }
        BookDOMe.closeForm(); // Ensure this method exists and works properly
        this.scrollToBottom();
        toastr.success('Books categorized successfully.');
    }
    // Remove categorized books
    removeCategorizedBooks(categorizedBookListDiv) {
        this.categorizedBookListDiv = categorizedBookListDiv;
        if (this.categorizedBookListDiv) {
            this.categorizedBookListDiv.innerHTML = '';
        }
        BookDOMe.closeForm(); // Ensure this method exists and works properly
        this.scrollToBottom();
        toastr.success('Categorized books removed successfully.');
    }
    // Scroll to bottom of the categorized book list
    scrollToBottom() {
        if (this.categorizedBookListDiv) {
            this.categorizedBookListDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }
    filterBooks() {
        var _a, _b, _c;
        const searchTerm = (_a = document.getElementById('searchTerm')) === null || _a === void 0 ? void 0 : _a.value.trim().toLowerCase();
        const filterGenre = (_b = document.getElementById('filterGenre')) === null || _b === void 0 ? void 0 : _b.value;
        const filterYear = (_c = document.getElementById('filterYear')) === null || _c === void 0 ? void 0 : _c.value;
        if (BookUtilities.validateTitle(searchTerm) === 'Special Characters not allowed')
            return;
        if (filterYear) {
            const currentYear = new Date().getFullYear();
            if (parseInt(filterYear, 10) > currentYear) {
                toastr.error('Filter year cannot be greater than the current year.');
                return;
            }
        }
        this.books = [...this.originalBooks]; // Reset the books array to the original books fetched from the API
        this.books = this.books.filter(book => {
            const matchesSearch = searchTerm
                ? book.title.toLowerCase().includes(searchTerm) ||
                    book.author.toLowerCase().includes(searchTerm)
                : true;
            const matchesGenre = filterGenre ? book.genre === filterGenre : true;
            const matchesYear = filterYear
                ? new Date(book.pubDate).getFullYear() === parseInt(filterYear, 10)
                : true;
            return matchesSearch && matchesGenre && matchesYear;
        });
        toastr.success("Filter applied successfully");
        this.updateBookDisplay(this.books);
    }
    resetFilters() {
        document.getElementById('searchTerm').value = '';
        document.getElementById('filterGenre').value = '';
        document.getElementById('filterYear').value = '';
        this.books = [...this.originalBooks]; // Reset the books array to the original state
        this.updateBookDisplay(this.books);
        toastr.success('Filters reset successfully.');
    }
}
