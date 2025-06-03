import React, {useState, useRef, useEffect} from 'react';

const options = [
    {value: 'site-1', label: 'Site 1'},
    {value: 'site-2', label: 'Site 2'},
    {value: 'site-3', label: 'Site 3'},
    {value: 'region-4', label: 'Region 4'},
    {value: 'region-5', label: 'Region 5'},
    {value: 'region-6', label: 'Region 6'},
];

export const ComboBoxExamplePage: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<{ value: string; label: string } | null>(null);
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Focus input when dropdown opens
    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8">
            <h2 className="text-lg font-bold mb-4">Combobox Example</h2>
            <div
                ref={ref}
                className="combo-box__field repel w-full border rounded px-3 py-2 relative cursor-pointer"
                tabIndex={0}
                id="combobox-input-to74w"
                data-testid="subject-details-modal-site-input"
                aria-label="Open combobox"
                aria-haspopup="dialog"
                aria-owns="combobox-69syk"
                onClick={() => setOpen((v) => !v)}
            >
        <span className="combo-box__placeholder text-gray-500">
          {selected ? selected.label : 'Select Site ID'}
        </span>
                <span
                    className="combo-box__controls flex gap-sm items-center absolute right-2 top-1/2 -translate-y-1/2">
          <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
            <path d="M5 8l5 5 5-5" stroke="#888" strokeWidth="2" fill="none"/>
          </svg>
        </span>
                {open && (
                    <div
                        className="absolute left-0 top-full mt-1 w-full bg-white border rounded shadow z-10"
                        id="combobox-69syk"
                        role="listbox"
                    >
                        <input
                            ref={inputRef}
                            type="search"
                            role="combobox"
                            aria-autocomplete="list"
                            aria-expanded="true"
                            aria-controls="combobox-69syk"
                            className="w-full px-2 py-1 border-b outline-none"
                            placeholder="Search..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onClick={e => e.stopPropagation()}
                        />
                        {filteredOptions.length === 0 ? (
                            <div className="option px-3 py-2 text-gray-400" aria-selected="false">No results</div>
                        ) : (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    className={`option px-3 py-2 hover:bg-gray-100 cursor-pointer${selected?.value === opt.value ? ' bg-gray-200' : ''}`}
                                    aria-selected={selected?.value === opt.value ? 'true' : 'false'}
                                    onClick={e => {
                                        e.stopPropagation();
                                        setSelected(opt);
                                        setOpen(false);
                                        setSearch('');
                                    }}
                                >
                                    {opt.label}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};