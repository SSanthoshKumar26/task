import React from 'react';
import { FilterConfig, FilterRule } from '../types';
import { Plus, X } from 'lucide-react';

interface FilterPanelProps {
    filters: FilterConfig;
    onChange: (filters: FilterConfig) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange }) => {

    const addFilterRule = () => {
        onChange({
            ...filters,
            rules: [...filters.rules, { id: Math.random().toString(36).substr(2, 9), field: 'status', operator: 'eq', value: '' }]
        });
    };

    const updateFilterRule = (id: string, field: keyof FilterRule, value: any) => {
        onChange({
            ...filters,
            rules: filters.rules.map(r => r.id === id ? { ...r, [field]: value } : r)
        });
    };

    const removeFilterRule = (id: string) => {
        onChange({
            ...filters,
            rules: filters.rules.filter(r => r.id !== id)
        });
    };

    return (
        <div className="filter-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Advanced Filters</h3>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Logic:</span>
                    <select
                        className="input"
                        style={{ width: 'auto', padding: '4px 8px' }}
                        value={filters.logic}
                        onChange={(e) => onChange({ ...filters, logic: e.target.value as 'AND' | 'OR' })}
                    >
                        <option value="AND">Match ALL</option>
                        <option value="OR">Match ANY</option>
                    </select>
                </div>
            </div>

            {filters.rules.map((rule) => (
                <div key={rule.id} className="filter-row">
                    <select className="input" value={rule.field} onChange={(e) => updateFilterRule(rule.id, 'field', e.target.value)}>
                        <option value="status">Status</option>
                        <option value="category">Category</option>
                        <option value="amount">Amount</option>
                        <option value="customer_name">Customer Name</option>
                    </select>

                    <select className="input" value={rule.operator} onChange={(e) => updateFilterRule(rule.id, 'operator', e.target.value)}>
                        <option value="eq">Equals</option>
                        <option value="neq">Not Equals</option>
                        <option value="contains">Contains</option>
                        <option value="gt">Greater Than</option>
                        <option value="lt">Less Than</option>
                    </select>

                    <input
                        className="input"
                        placeholder="Value..."
                        value={rule.value}
                        onChange={(e) => updateFilterRule(rule.id, 'value', e.target.value)}
                    />

                    <button className="btn btn-ghost" onClick={() => removeFilterRule(rule.id)} title="Remove Rule">
                        <X size={16} />
                    </button>
                </div>
            ))}

            <button className="btn btn-secondary" onClick={addFilterRule} style={{ marginTop: 8 }}>
                <Plus size={16} /> Add Rule
            </button>
        </div>
    );
};
