import { Transaction, Category } from '../db/db';

export function exportToCSV(transactions: Transaction[], categories: Category[]): void {
    let csvContent = 'Data;Tipo;Descrição;Categoria;Valor\n';
    transactions.forEach(transaction => {
        const category = categories.find(cat => cat.id === transaction.categoryId);
        const line = `${transaction.date};${transaction.type};${transaction.description};${category?.name || 'N/A'};${transaction.amount}\n`;
        csvContent += line;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financas.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function exportToJSON(transactions: Transaction[]): void {
    const jsonContent = JSON.stringify(transactions, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup_financas.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}