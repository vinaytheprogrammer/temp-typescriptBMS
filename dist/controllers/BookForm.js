import { BookUtilities } from './BookUtilities';
export class BookFormHandler {
    static getFormValues(fieldIds) {
        const formData = {};
        fieldIds.forEach((id) => {
            const value = BookUtilities.getInputValue(id);
            formData[id] = isNaN(Number(value)) || value === '' ? value : Number(value);
        });
        return formData;
    }
}
