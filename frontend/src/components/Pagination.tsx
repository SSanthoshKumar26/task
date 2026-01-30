import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

interface PaginationProps {
    page: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, totalItems, limit, onPageChange }) => {
    return (
        <div className="pagination-container">
            <div className="pagination-info">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
            </div>
            <div className="pagination-controls">
                <button
                    className="btn btn-secondary"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                >
                    <ChevronLeft size={16} />
                    Previous
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                >
                    Next
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
