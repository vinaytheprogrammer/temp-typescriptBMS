import { BookManage } from './BookManage.js';
document.addEventListener('DOMContentLoaded', () => {
    new BookManage(); // has-a relationship with BookManager
    //it will help us to show the form when we click on the add, edit, delete and categorize button
    window.showForm = (formId) => {
        var _a;
        const formContainer = document.getElementById('formContainer');
        if (formContainer) {
            formContainer.classList.remove('hidden');
            document.querySelectorAll('#formContainer > div').forEach(div => div.classList.add('hidden'));
            (_a = document.getElementById(formId)) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
        }
    };
});
