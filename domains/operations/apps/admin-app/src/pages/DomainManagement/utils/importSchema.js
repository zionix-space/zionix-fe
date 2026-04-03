import { formDB } from '@zionix-space/lowcode';
import domainsViewSchema from '../DomainsView.schema.json';

/**
 * Import DomainsView schema into FormBuilder
 * Run this once to create the form in IndexedDB
 */
export const importDomainsViewSchema = async () => {
    try {
        // Check if form already exists
        const existingForms = await formDB.getAllForms();
        const exists = existingForms.find(f => f.name === 'DomainsView' || f.id === 'DomainsView');

        if (exists) {
            console.log('DomainsView form already exists, updating...');
            await formDB.saveFormSchema('DomainsView', domainsViewSchema);
            console.log('DomainsView form updated successfully');
        } else {
            console.log('Creating DomainsView form...');
            await formDB.createForm('DomainsView', 'Domain management screen with table');
            await formDB.saveFormSchema('DomainsView', domainsViewSchema);
            console.log('DomainsView form created successfully');
        }

        return true;
    } catch (error) {
        console.error('Failed to import DomainsView schema:', error);
        return false;
    }
};

/**
 * Auto-import on module load (optional)
 * Uncomment to auto-import when screen loads
 */
// importDomainsViewSchema();
