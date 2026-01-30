import React from 'react';
import { Transaction } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import './DataTable.css';

interface DataTableProps {
    data: Transaction[];
    isLoading: boolean;
    sortBy: string;
    order: 'asc' | 'desc';
    onSort: (field: string) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
    data, isLoading, sortBy, order, onSort
}) => {
    const columns = [
        { key: 'transaction_id', label: 'ID' },
        { key: 'customer_name', label: 'Customer' },
        { key: 'amount', label: 'Amount' },
        { key: 'status', label: 'Status' },
        { key: 'category', label: 'Category' },
        { key: 'date', label: 'Date' },
    ];

    const handleSort = (key: string) => {
        onSort(key);
    };

    return (
        <div className="table-container card">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} onClick={() => handleSort(col.key)} className="sortable-header">
                                <div className="th-content">
                                    {col.label}
                                    {sortBy === col.key && (
                                        order === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                    )}
                                    {sortBy !== col.key && (
                                        <div style={{ width: 14, height: 14 }}></div> // Spacer for layout stability
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id || row.transaction_id}>
                            <td><span className="mono-text">{row.transaction_id}</span></td>
                            <td>
                                <div className="user-cell">
                                    <div className="avatar">{row.customer_name ? row.customer_name[0] : '?'}</div>
                                    <div>
                                        <div className="font-medium">{row.customer_name}</div>
                                        <div className="text-muted text-sm">{row.customer_email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="font-mono">${typeof row.amount === 'number' ? row.amount.toFixed(2) : row.amount}</td>
                            <td>
                                <span className={`badge status-${(row.status || '').toLowerCase()}`}>
                                    {row.status}
                                </span>
                            </td>
                            <td>{row.category}</td>
                            <td>
                                {row.date ? format(new Date(row.date), 'MMM d, yyyy') : '-'}
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && !isLoading && (
                        <tr>
                            <td colSpan={columns.length} className="empty-state">
                                No transactions found.
                            </td>
                        </tr>
                    )}
                    {isLoading && data.length === 0 && (
                        <tr>
                            <td colSpan={columns.length} className="table-skeleton">
                                Loading data...
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
