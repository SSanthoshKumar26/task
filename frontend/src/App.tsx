import React, { useState, useEffect } from 'react';
import { useTransactions, usePresets, useCreatePreset, useDeletePreset, useSeedData } from './hooks/useData';
import { DataTable } from './components/DataTable';
import { Pagination } from './components/Pagination';
import { FilterPanel } from './components/FilterPanel';
import { FilterConfig, Preset } from './types';
import { Filter, Save, Trash2, RotateCcw, Database } from 'lucide-react';
import '@fontsource/outfit/300.css';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import '@fontsource/outfit/800.css';
import './App.css';

function App() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('date');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const [filters, setFilters] = useState<FilterConfig>({
    logic: 'AND',
    rules: []
  });

  const { data: transactionData, isLoading, isError } = useTransactions(page, limit, sortBy, order, filters);
  const { data: presets } = usePresets();
  const createPresetMutation = useCreatePreset();
  const deletePresetMutation = useDeletePreset();
  const seedDataMutation = useSeedData();

  // Load default preset on mount
  useEffect(() => {
    if (presets && !filters.rules.length) {
      const defaultPreset = presets.find(p => p.is_default);
      if (defaultPreset) {
        // Check if we haven't already loaded filters (simple check)
        // Ideally we tracked 'hasLoadedDefault' state
        setFilters(defaultPreset.config as FilterConfig);
      }
    }
  }, [presets]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('desc');
    }
  };



  const clearFilters = () => {
    setFilters({ logic: 'AND', rules: [] });
    setPage(1);
    setIsFilterOpen(false);
  };

  const savePreset = () => {
    const name = prompt("Enter preset name:");
    if (!name) return;
    createPresetMutation.mutate({
      name,
      config: filters,
      is_default: false
    });
    setShowPresets(false);
  };

  const loadPreset = (preset: Preset) => {
    setFilters(preset.config as FilterConfig);
    setShowPresets(false);
    setIsFilterOpen(true);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="title-section">
          <h1>Transactions</h1>
          <p>Manage and monitor your financial data.</p>
        </div>
        <div className="controls-section">
          <button className="btn btn-secondary" onClick={() => seedDataMutation.mutate()} disabled={seedDataMutation.status === 'pending'}>
            {seedDataMutation.status === 'pending' ? 'Seeding...' : <><Database size={16} /> Seed Data</>}
          </button>
        </div>
      </header>

      <div className="toolbar">
        <div className="search-controls">
          <button
            className={`btn ${isFilterOpen ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={16} /> Filters
            {filters.rules.length > 0 &&
              <span className="badge" style={{
                background: isFilterOpen ? 'rgba(255,255,255,0.2)' : 'var(--color-primary-light)',
                color: isFilterOpen ? 'white' : 'var(--color-primary)',
                marginLeft: 8
              }}>
                {filters.rules.length}
              </span>
            }
          </button>

          <div style={{ position: 'relative' }}>
            <button className="btn btn-secondary" onClick={() => setShowPresets(!showPresets)}>
              <Save size={16} /> Presets
            </button>
            {showPresets && (
              <div className="presets-panel">
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border)', fontWeight: 600, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  SAVED VIEWS
                </div>
                {presets?.length === 0 && <div style={{ padding: 12, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No presets saved.</div>}
                {presets?.map(preset => (
                  <div key={preset.id} className="preset-item" onClick={() => loadPreset(preset)}>
                    <span style={{ fontSize: '0.9rem' }}>{preset.name}</span>
                    {preset.is_default && <span className="badge status-success" style={{ fontSize: 10, marginLeft: 8 }}>Default</span>}
                    <Trash2
                      size={14}
                      className="text-muted"
                      style={{ marginLeft: 'auto' }}
                      onClick={(e) => { e.stopPropagation(); deletePresetMutation.mutate(preset.id!) }}
                    />
                  </div>
                ))}
                <div style={{ padding: 8, borderTop: '1px solid var(--color-border)', marginTop: 4 }}>
                  <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.8rem' }} onClick={savePreset}>
                    Save Current View
                  </button>
                </div>
              </div>
            )}
          </div>

          {filters.rules.length > 0 && (
            <button className="btn btn-ghost" onClick={clearFilters}>
              <RotateCcw size={16} /> Reset
            </button>
          )}
        </div>
      </div>

      {isFilterOpen && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <FilterPanel filters={filters} onChange={setFilters} />
        </div>
      )}

      {transactionData && (
        <>
          <DataTable
            data={transactionData.data}
            isLoading={isLoading}
            sortBy={sortBy}
            order={order}
            onSort={handleSort}
          />
          <Pagination
            page={transactionData.meta.page}
            limit={transactionData.meta.limit}
            totalItems={transactionData.meta.total}
            totalPages={transactionData.meta.pages}
            onPageChange={setPage}
          />
        </>
      )}
      {isLoading && !transactionData && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Loading transactions...
        </div>
      )}
      {isError && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-danger)' }}>
          Error loading data. Is the backend running?
        </div>
      )}
    </div>
  );
}

export default App;
