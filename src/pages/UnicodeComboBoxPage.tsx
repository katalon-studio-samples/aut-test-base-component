import React, { useState, useRef, useEffect } from "react";

const unicodeOptions = [
  // Temperature
  { value: "celsius", label: "Temperature °C", category: "Temperature" },
  { value: "fahrenheit", label: "Temperature °F", category: "Temperature" },
  { value: "kelvin", label: "Temperature K", category: "Temperature" },
  
  // Currency
  { value: "usd", label: "US Dollar $", category: "Currency" },
  { value: "eur", label: "Euro €", category: "Currency" },
  { value: "gbp", label: "British Pound £", category: "Currency" },
  { value: "jpy", label: "Japanese Yen ¥", category: "Currency" },
  { value: "cny", label: "Chinese Yuan ¥", category: "Currency" },
  { value: "inr", label: "Indian Rupee ₹", category: "Currency" },
  { value: "krw", label: "Korean Won ₩", category: "Currency" },
  { value: "btc", label: "Bitcoin ₿", category: "Currency" },
  
  // Mathematical symbols
  { value: "infinity", label: "Infinity ∞", category: "Math" },
  { value: "pi", label: "Pi π", category: "Math" },
  { value: "sigma", label: "Sigma Σ", category: "Math" },
  { value: "delta", label: "Delta Δ", category: "Math" },
  { value: "alpha", label: "Alpha α", category: "Math" },
  { value: "beta", label: "Beta β", category: "Math" },
  { value: "gamma", label: "Gamma γ", category: "Math" },
  { value: "omega", label: "Omega Ω", category: "Math" },
  { value: "theta", label: "Theta θ", category: "Math" },
  { value: "lambda", label: "Lambda λ", category: "Math" },
  { value: "mu", label: "Mu μ", category: "Math" },
  { value: "phi", label: "Phi φ", category: "Math" },
  
  // Arrows and symbols
  { value: "arrow-up", label: "Arrow Up ↑", category: "Arrows" },
  { value: "arrow-down", label: "Arrow Down ↓", category: "Arrows" },
  { value: "arrow-left", label: "Arrow Left ←", category: "Arrows" },
  { value: "arrow-right", label: "Arrow Right →", category: "Arrows" },
  { value: "arrow-up-down", label: "Up-Down ↕", category: "Arrows" },
  { value: "arrow-left-right", label: "Left-Right ↔", category: "Arrows" },
  
  // Miscellaneous symbols
  { value: "copyright", label: "Copyright ©", category: "Symbols" },
  { value: "registered", label: "Registered ®", category: "Symbols" },
  { value: "trademark", label: "Trademark ™", category: "Symbols" },
  { value: "degree", label: "Degree °", category: "Symbols" },
  { value: "paragraph", label: "Paragraph ¶", category: "Symbols" },
  { value: "section", label: "Section §", category: "Symbols" },
  { value: "bullet", label: "Bullet •", category: "Symbols" },
  { value: "ellipsis", label: "Ellipsis …", category: "Symbols" },
  { value: "dagger", label: "Dagger †", category: "Symbols" },
  { value: "double-dagger", label: "Double Dagger ‡", category: "Symbols" },
  
  // Fractions
  { value: "half", label: "One Half ½", category: "Fractions" },
  { value: "third", label: "One Third ⅓", category: "Fractions" },
  { value: "quarter", label: "One Quarter ¼", category: "Fractions" },
  { value: "three-quarters", label: "Three Quarters ¾", category: "Fractions" },
  { value: "two-thirds", label: "Two Thirds ⅔", category: "Fractions" },
  
  // Superscript and subscript
  { value: "squared", label: "Squared ²", category: "Superscript" },
  { value: "cubed", label: "Cubed ³", category: "Superscript" },
  { value: "power-4", label: "Power 4 ⁴", category: "Superscript" },
  { value: "power-5", label: "Power 5 ⁵", category: "Superscript" },
  
  // Playing card suits
  { value: "spades", label: "Spades ♠", category: "Cards" },
  { value: "hearts", label: "Hearts ♥", category: "Cards" },
  { value: "diamonds", label: "Diamonds ♦", category: "Cards" },
  { value: "clubs", label: "Clubs ♣", category: "Cards" },
  
  // Zodiac signs
  { value: "aries", label: "Aries ♈", category: "Zodiac" },
  { value: "taurus", label: "Taurus ♉", category: "Zodiac" },
  { value: "gemini", label: "Gemini ♊", category: "Zodiac" },
  { value: "cancer", label: "Cancer ♋", category: "Zodiac" },
  { value: "leo", label: "Leo ♌", category: "Zodiac" },
  { value: "virgo", label: "Virgo ♍", category: "Zodiac" },
  
  // Music symbols
  { value: "treble-clef", label: "Treble Clef 𝄞", category: "Music" },
  { value: "sharp", label: "Sharp ♯", category: "Music" },
  { value: "flat", label: "Flat ♭", category: "Music" },
  { value: "natural", label: "Natural ♮", category: "Music" },
  
  // Emoji-style symbols
  { value: "star", label: "Star ★", category: "Shapes" },
  { value: "heart", label: "Heart ♡", category: "Shapes" },
  { value: "diamond", label: "Diamond ◆", category: "Shapes" },
  { value: "circle", label: "Circle ●", category: "Shapes" },
  { value: "square", label: "Square ■", category: "Shapes" },
  { value: "triangle", label: "Triangle ▲", category: "Shapes" },
];

export const UnicodeComboBoxPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{
    value: string;
    label: string;
    category: string;
  } | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(unicodeOptions.map(opt => opt.category)))];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Filter options based on search and category
  const filteredOptions = unicodeOptions.filter((opt) => {
    const matchesSearch = opt.label.toLowerCase().includes(search.toLowerCase()) ||
                         opt.value.toLowerCase().includes(search.toLowerCase()) ||
                         opt.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || opt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group options by category for display
  const groupedOptions = filteredOptions.reduce((groups, option) => {
    const category = option.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(option);
    return groups;
  }, {} as Record<string, typeof filteredOptions>);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Unicode Combobox Example
      </h1>
      
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
          This combobox demonstrates various Unicode characters including:
        </p>
        <ul className="text-sm text-blue-600 dark:text-blue-400 list-disc list-inside space-y-1">
          <li>Temperature symbols (°C, °F)</li>
          <li>Currency symbols ($, €, £, ¥, ₹, ₩, ₿)</li>
          <li>Mathematical symbols (π, Σ, Δ, α, β, γ, Ω, etc.)</li>
          <li>Arrows and directional symbols</li>
          <li>Copyright, trademark, and other legal symbols</li>
          <li>Fractions and superscript numbers</li>
          <li>Playing card suits and zodiac signs</li>
          <li>Music notation symbols</li>
          <li>Various shapes and decorative symbols</li>
        </ul>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Unicode Symbol:
          </label>
          <div
            ref={ref}
            className="combo-box__field w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 relative cursor-pointer bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            tabIndex={0}
            id="unicode-combobox-input"
            data-testid="unicode-combobox"
            aria-label="Open Unicode symbol combobox"
            aria-haspopup="dialog"
            aria-owns="unicode-combobox-dropdown"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="combo-box__placeholder text-gray-700 dark:text-gray-300 text-lg">
              {selected ? selected.label : "Select a Unicode symbol..."}
            </span>
            <span className="combo-box__controls flex gap-2 items-center absolute right-3 top-1/2 -translate-y-1/2">
              <svg 
                width="20" 
                height="20" 
                fill="none" 
                viewBox="0 0 20 20"
                className={`transform transition-transform ${open ? 'rotate-180' : ''}`}
              >
                <path 
                  d="M5 8l5 5 5-5" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none" 
                  className="text-gray-500 dark:text-gray-400"
                />
              </svg>
            </span>
            
            {open && (
              <div
                className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-xl z-20 max-h-96 overflow-hidden"
                id="unicode-combobox-dropdown"
                role="listbox"
              >
                {/* Search input */}
                <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                  <input
                    ref={inputRef}
                    type="search"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded="true"
                    aria-controls="unicode-combobox-dropdown"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                    placeholder="Search symbols..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Category filter */}
                <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Options list */}
                <div className="max-h-64 overflow-y-auto">
                  {Object.keys(groupedOptions).length === 0 ? (
                    <div
                      className="option px-4 py-3 text-gray-400 dark:text-gray-500 text-center"
                      aria-selected="false"
                    >
                      No symbols found
                    </div>
                  ) : (
                    Object.entries(groupedOptions).map(([category, options]) => (
                      <div key={category}>
                        {selectedCategory === "all" && (
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            {category}
                          </div>
                        )}
                        {options.map((opt) => (
                          <div
                            key={opt.value}
                            className={`option px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors${
                              selected?.value === opt.value 
                                ? " bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200" 
                                : " text-gray-700 dark:text-gray-300"
                            }`}
                            id={`unicode-option-${opt.value}`}
                            aria-selected={selected?.value === opt.value ? "true" : "false"}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected(opt);
                              setOpen(false);
                              setSearch("");
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-lg">{opt.label}</span>
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                {opt.category}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected value display */}
        {selected && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
              Selected Symbol:
            </h3>
            <div className="space-y-2">
              <p className="text-2xl font-mono text-green-700 dark:text-green-300">
                {selected.label}
              </p>
              <div className="text-sm text-green-600 dark:text-green-400 space-y-1">
                <p><strong>Value:</strong> {selected.value}</p>
                <p><strong>Category:</strong> {selected.category}</p>
                <p><strong>Unicode Character:</strong> {selected.label.split(' ').pop()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Test attributes section */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Test Attributes
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>Main Combobox ID:</strong> unicode-combobox-input</p>
            <p><strong>Test ID:</strong> unicode-combobox</p>
            <p><strong>Dropdown ID:</strong> unicode-combobox-dropdown</p>
            <p><strong>Selected Option ID:</strong> {selected ? `unicode-option-${selected.value}` : 'None'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
