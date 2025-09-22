import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { 
  ColDef, 
  GridReadyEvent,
  ICellRendererParams,
  ModuleRegistry, 
  AllCommunityModule,
  ValueGetterParams,
  ValueSetterParams
} from 'ag-grid-community';


ModuleRegistry.registerModules([AllCommunityModule]);

// Shadow DOM Cell Renderer Component
class ShadowCellRenderer {
  private eGui!: HTMLDivElement;
  private shadow!: ShadowRoot;
  private params!: ICellRendererParams & { cellType: string };

  init(params: ICellRendererParams & { cellType: string }) {
    this.params = params;
    this.eGui = document.createElement('div');

    
    this.shadow = this.eGui.attachShadow({ mode: 'open' });
    this.shadow.innerHTML = `
      <style>
        :host { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; padding: 4px; }
        input, select, button { padding: 4px 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px; transition: all 0.2s; }
        input:focus, select:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1); }
        input[type="range"] { width: 100%; accent-color: #3b82f6; }
        input[type="checkbox"] { width: 16px; height: 16px; accent-color: #10b981; }
        input[type="radio"] { width: 14px; height: 14px; accent-color: #8b5cf6; }
        button { cursor: pointer; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; border: none; border-radius: 6px; font-weight: 500; min-width: 32px; height: 32px; }
        button:hover { background: linear-gradient(135deg, #2563eb, #1e40af); transform: translateY(-1px); }
        .range-container { display: flex; gap: 6px; align-items: center; width: 100%; }
        .radio-group { display: flex; gap: 12px; font-size: 12px; font-weight: 500; }
        .radio-group label { display: flex; align-items: center; gap: 4px; cursor: pointer; }
        .stars { font-size: 16px; color: #fbbf24; }
        .text-display { font-weight: 500; color: #374151; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #3b82f6; cursor: pointer; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
        input[type="range"]::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #3b82f6; cursor: pointer; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
      </style>
      <div id="content"></div>
    `;
    
    this.updateContent();
    this.addEventListeners();
  }

  getGui() {
    return this.eGui;
  }

  refresh(params: ICellRendererParams & { cellType: string }) {
    this.params = params;
    this.updateContent();
    return true;
  }

  private updateContent() {
    const content = this.shadow.getElementById('content')!;
    const { cellType, value, data, rowIndex } = this.params;
    
    switch (cellType) {
      case 'input':
        content.innerHTML = `<input type="text" value="${value || ''}" />`;
        break;
      case 'slider':
        content.innerHTML = `<input type="range" min="0" max="100" value="${value || 50}" />`;
        break;
      case 'doubleSlider':
        content.innerHTML = `
          <div class="range-container">
            <input type="range" min="0" max="100" value="${value?.min || 0}" />
            <input type="range" min="0" max="100" value="${value?.max || 100}" />
          </div>`;
        break;

      case 'checkbox':
        content.innerHTML = `<input type="checkbox" ${value ? 'checked' : ''} />`;
        break;
      case 'radio':
        content.innerHTML = `
          <div class="radio-group">
            <label><input type="radio" name="category-${data.id}" value="A" ${value === 'A' ? 'checked' : ''} />A</label>
            <label><input type="radio" name="category-${data.id}" value="B" ${value === 'B' ? 'checked' : ''} />B</label>
          </div>`;
        break;
      case 'svg':
        const stars = '★'.repeat(value || 0) + '☆'.repeat(5 - (value || 0));
        content.innerHTML = `<span class="stars">${stars}</span>`;
        break;
      case 'download':
        content.innerHTML = `<button data-action="download" title="Download row data">📥</button>`;
        break;
      case 'newTab':
        content.innerHTML = `<button data-action="newTab" title="Open in new tab">🔗</button>`;
        break;
      default:
        content.innerHTML = `<span class="text-display">${value || ''}</span>`;
    }
  }

  private addEventListeners() {
    this.shadow.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      let newValue: any = target.value;
      
      if (target.type === 'checkbox') {
        newValue = target.checked;
      } else if (target.type === 'range' && this.params.cellType === 'doubleSlider') {
        const isMin = target === content.querySelector('input[type="range"]');
        const currentValue = this.params.value || { min: 0, max: 100 };
        newValue = isMin ? { ...currentValue, min: parseInt(target.value) } : { ...currentValue, max: parseInt(target.value) };
      }
      
      this.params.setValue(newValue);
    });

    this.shadow.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const action = target.dataset.action;
      if (action === 'download') {
        const blob = new Blob([JSON.stringify(this.params.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `row-${this.params.data.id}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (action === 'newTab') {
        window.open(`https://example.com?id=${this.params.data.id}`, '_blank');
      }
    });
  }
}

const generateData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,

    score: Math.floor(Math.random() * 100),
    active: Math.random() > 0.5,
    category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
    rating: Math.floor(Math.random() * 5) + 1,
    range: { min: Math.floor(Math.random() * 50), max: Math.floor(Math.random() * 50) + 50 },

    status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)],
  }));
};

const AGGridPage: React.FC = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData] = useState(() => generateData(1000));

  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: 'ID',
      field: 'id',
      width: 80,
      minWidth: 80,
      filter: 'agNumberColumnFilter',
      cellRenderer: ShadowCellRenderer,
      cellRendererParams: { cellType: 'text' }
    },
    {
      headerName: 'Name',
      field: 'name',
      width: 150,
      minWidth: 120,
      filter: 'agTextColumnFilter',
      editable: true,
      cellRenderer: ShadowCellRenderer,
      cellRendererParams: { cellType: 'input' }
    },
    {
      headerName: 'Email',
      field: 'email',
      width: 200,
      minWidth: 150,
      filter: 'agTextColumnFilter',
      cellRenderer: ShadowCellRenderer,
      cellRendererParams: { cellType: 'text' }
    },

    {
      headerName: 'Score',
      field: 'score',
      width: 100,
      minWidth: 80,
      filter: 'agNumberColumnFilter',
      cellRenderer: ShadowCellRenderer,
      cellRendererParams: { cellType: 'text' }
    },
    {
      headerName: 'Range',
      field: 'range',
      width: 180,
      minWidth: 150,
      filter: 'agTextColumnFilter',
      filterValueGetter: (params) => `${params.data.range?.min || 0}-${params.data.range?.max || 100}`,
      valueFormatter: (params) => `${params.value?.min || 0}-${params.value?.max || 100}`,
      editable: true,
      cellRenderer: ShadowCellRenderer,
      cellRendererParams: { cellType: 'doubleSlider' },
      valueGetter: (params: ValueGetterParams) => params.data?.range,
      valueSetter: (params: ValueSetterParams) => {
        params.data.range = params.newValue;
        return true;
      }
    },
    {
      headerName: 'Active',
      field: 'active',
      width: 100,
      minWidth: 80,
      filter: 'agTextColumnFilter',
      valueFormatter: (params) => params.value ? 'Yes' : 'No',
      filterValueGetter: (params) => params.data.active ? 'Yes' : 'No',
      editable: true,
      cellRenderer: ShadowCellRenderer,
      cellRendererParams: { cellType: 'checkbox' }
    },
    {
      headerName: 'Category',
      field: 'category',
      width: 120,
      minWidth: 100,
      filter: 'agTextColumnFilter',
      editable: true,
      cellRenderer: ShadowCellRenderer,
      cellRendererParams: { cellType: 'radio' }
    },
    {
      headerName: 'Rating',
      field: 'rating',
      width: 100,
      minWidth: 80,
      filter: 'agNumberColumnFilter',
      cellRenderer: ShadowCellRenderer,
      cellRendererParams: { cellType: 'svg' }
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 120,
      minWidth: 100,
      filter: 'agTextColumnFilter',
      cellRenderer: ShadowCellRenderer,
      cellRendererParams: { cellType: 'text' }
    },
    {
      headerName: 'Download',
      field: 'id',
      width: 100,
      minWidth: 80,
      filter: 'agNumberColumnFilter',
      valueFormatter: () => 'Download',
      sortable: false,
      cellRenderer: ShadowCellRenderer,
      cellRendererParams: { cellType: 'download' }
    },
    {
      headerName: 'Link',
      field: 'id', 
      width: 80,
      minWidth: 60,
      filter: 'agNumberColumnFilter',
      valueFormatter: () => 'Link',
      sortable: false,
      cellRenderer: ShadowCellRenderer,
      cellRendererParams: { cellType: 'newTab' }
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
    suppressSizeToFit: false
  }), []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    // Grid is ready - columns will use their defined widths
  }, []);

  const exportCsv = useCallback(() => {
    gridRef.current?.api.exportDataAsCsv();
  }, []);

  const clearFilters = useCallback(() => {
    gridRef.current?.api.setFilterModel(null);
    gridRef.current?.api.setSortModel([]);
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          AG Grid with Shadow DOM
        </h1>
        <p className="text-gray-600 text-lg">Advanced data grid with protected shadow DOM cells and comprehensive filtering</p>
      </div>
      
      <div className="mb-6 flex gap-4">
        <button
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          onClick={exportCsv}

        >
          📊 Export CSV
        </button>
        <button
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          onClick={clearFilters}

        >
          🔄 Clear Filters
        </button>
      </div>

      <div style={{ height: '600px', width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={50}
          suppressMenuHide={true}
        />
      </div>

      <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">✨ Features Implemented</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
          <div>🛡️ Shadow DOM Protection</div>
          <div>📝 Editable Inputs</div>
          <div>🎚️ Range Sliders</div>
          <div>☑️ Interactive Controls</div>
          <div>⭐ Star Ratings</div>
          <div>📥 File Downloads</div>
          <div>🔗 External Links</div>
          <div>🔍 Advanced Filtering</div>
          <div>📊 1000 Test Records</div>
        </div>
      </div>
    </div>
  );
};

export default AGGridPage;