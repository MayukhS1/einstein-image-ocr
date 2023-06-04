export default function generateData({ amountOfRecords }) {
    return [...Array(amountOfRecords)].map((_, index) => {
        return {
            Name: `Name (${index})`,
            Company: 'salesforce.com',
            Title: 'SDE',
            Email: `'xyz@gmail.com'`,
        };
    });
}