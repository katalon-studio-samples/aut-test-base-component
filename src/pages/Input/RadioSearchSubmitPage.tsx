import React, { useState, useId, useRef, useEffect } from "react";
import styles from "./Input.module.css";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
}

const mockProducts: Product[] = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 89.99, rating: 4.5 },
  { id: 2, name: "Smartphone Case", category: "Accessories", price: 19.99, rating: 4.2 },
  { id: 3, name: "Laptop Stand", category: "Accessories", price: 34.99, rating: 4.7 },
  { id: 4, name: "Bluetooth Speaker", category: "Electronics", price: 129.99, rating: 4.3 },
  { id: 5, name: "Phone Charger", category: "Electronics", price: 24.99, rating: 4.1 },
  { id: 6, name: "Wireless Mouse", category: "Electronics", price: 45.99, rating: 4.6 },
  { id: 7, name: "Keyboard Wrist Rest", category: "Accessories", price: 15.99, rating: 4.0 },
  { id: 8, name: "USB Hub", category: "Electronics", price: 29.99, rating: 4.4 },
  { id: 9, name: "Gaming Mouse", category: "Electronics", price: 79.99, rating: 4.8 },
  { id: 10, name: "Mechanical Keyboard", category: "Electronics", price: 149.99, rating: 4.9 },
  { id: 11, name: "Webcam HD", category: "Electronics", price: 59.99, rating: 4.2 },
  { id: 12, name: "Monitor Stand", category: "Accessories", price: 89.99, rating: 4.5 },
  { id: 13, name: "Cable Organizer", category: "Accessories", price: 12.99, rating: 3.8 },
  { id: 14, name: "Laptop Cooling Pad", category: "Accessories", price: 39.99, rating: 4.1 },
  { id: 15, name: "Wireless Earbuds", category: "Electronics", price: 159.99, rating: 4.7 },
  { id: 16, name: "Tablet Stand", category: "Accessories", price: 25.99, rating: 4.3 },
  { id: 17, name: "External Hard Drive", category: "Electronics", price: 89.99, rating: 4.4 },
  { id: 18, name: "Screen Protector", category: "Accessories", price: 8.99, rating: 3.9 },
  { id: 19, name: "Wireless Charger", category: "Electronics", price: 34.99, rating: 4.2 },
  { id: 20, name: "Desk Lamp", category: "Accessories", price: 49.99, rating: 4.6 },
  { id: 21, name: "USB-C Cable", category: "Electronics", price: 14.99, rating: 4.0 },
  { id: 22, name: "Laptop Sleeve", category: "Accessories", price: 22.99, rating: 4.1 },
  { id: 23, name: "Bluetooth Keyboard", category: "Electronics", price: 69.99, rating: 4.3 },
  { id: 24, name: "Mouse Pad", category: "Accessories", price: 9.99, rating: 3.7 },
  { id: 25, name: "Portable SSD", category: "Electronics", price: 199.99, rating: 4.8 },
  { id: 26, name: "Headphone Stand", category: "Accessories", price: 18.99, rating: 4.0 },
  { id: 27, name: "USB Microphone", category: "Electronics", price: 79.99, rating: 4.5 },
  { id: 28, name: "Cable Clips", category: "Accessories", price: 6.99, rating: 3.6 },
  { id: 29, name: "Wireless Gaming Headset", category: "Electronics", price: 129.99, rating: 4.6 },
  { id: 30, name: "Laptop Dock", category: "Electronics", price: 299.99, rating: 4.7 },
  { id: 31, name: "Desk Organizer", category: "Accessories", price: 32.99, rating: 4.2 },
  { id: 32, name: "Smart Watch", category: "Electronics", price: 249.99, rating: 4.4 },
  { id: 33, name: "Phone Mount", category: "Accessories", price: 16.99, rating: 3.9 },
  { id: 34, name: "Wireless Presenter", category: "Electronics", price: 44.99, rating: 4.1 },
  { id: 35, name: "Cable Sleeve", category: "Accessories", price: 11.99, rating: 3.8 },
  { id: 36, name: "Bluetooth Adapter", category: "Electronics", price: 19.99, rating: 4.0 },
  { id: 37, name: "Monitor Arm", category: "Accessories", price: 119.99, rating: 4.5 },
  { id: 38, name: "USB Fan", category: "Electronics", price: 12.99, rating: 3.5 },
  { id: 39, name: "Laptop Lock", category: "Accessories", price: 28.99, rating: 4.2 },
  { id: 40, name: "Wireless Trackball", category: "Electronics", price: 89.99, rating: 4.3 },
];

export const RadioSearchSubmitPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(mockProducts);
  const [isFiltered, setIsFiltered] = useState(false);
  const [error, setError] = useState("");
  const [useAutocomplete, setUseAutocomplete] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // Generate suggestions based on search query
  useEffect(() => {
    if (useAutocomplete && searchQuery.trim()) {
      const productNames = mockProducts.map(product => product.name);
      const filteredSuggestions = productNames.filter(name =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
      setSelectedSuggestionIndex(-1);
    } else if (useAutocomplete && !searchQuery.trim()) {
      // Clear suggestions when search query is empty
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  }, [searchQuery, useAutocomplete]);

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!useAutocomplete || !showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
          e.preventDefault();
          e.stopPropagation();
          const selectedSuggestion = suggestions[selectedSuggestionIndex];
          setSearchQuery(selectedSuggestion);
          // Immediately close suggestions
          setShowSuggestions(false);
          setSuggestions([]);
          setSelectedSuggestionIndex(-1);
        }
        // If no suggestion is selected but suggestions are shown, just close them
        else if (showSuggestions) {
          e.preventDefault();
          setShowSuggestions(false);
          setSuggestions([]);
          setSelectedSuggestionIndex(-1);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSuggestions([]);
        setSelectedSuggestionIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedSuggestionIndex(-1);
    // Keep focus on input for keyboard users
    searchInputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle input focus to show suggestions if there's a query
  const handleInputFocus = () => {
    if (useAutocomplete && searchQuery.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Handle input blur with a small delay to allow for clicks
  const handleInputBlur = () => {
    setTimeout(() => {
      // Only close suggestions if we're not clicking on a suggestion
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false);
        setSuggestions([]);
        setSelectedSuggestionIndex(-1);
      }
    }, 150);
  };

  // Handle input key down for form submission when suggestions are not shown
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    // If autocomplete is disabled or suggestions are not shown, let Enter submit the form
    if (!useAutocomplete || !showSuggestions) {
      // Let the form submit naturally - don't prevent default
      return;
    }
    
    // Otherwise, handle autocomplete navigation
    handleKeyDown(e);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with query:', searchQuery); // Debug log
    
    setError("");
    setIsFiltered(true);
    
    // Clear all autocomplete state
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedSuggestionIndex(-1);

    // Filter products based on search criteria
    let filteredProducts = mockProducts;

    // Apply search query filter if provided
    if (searchQuery.trim()) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(product => 
        product.category === selectedCategory
      );
    }

    // Apply price range filter
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      filteredProducts = filteredProducts.filter(product => 
        product.price >= min && product.price <= max
      );
    }

    // Apply rating filter
    if (selectedRating) {
      const minRating = Number(selectedRating);
      filteredProducts = filteredProducts.filter(product => 
        product.rating >= minRating
      );
    }

    setDisplayedProducts(filteredProducts);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedPriceRange("");
    setSelectedRating("");
    setDisplayedProducts(mockProducts);
    setIsFiltered(false);
    setError("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    setUseAutocomplete(false);
  };

  return (
    <div className={styles.container} id={`${id}-container`}>
      <h2 className={styles.h2} id={`${id}-title`}>
        Product Search & Filter
      </h2>
      <br />
      
      <form onSubmit={handleSubmit} id={`${id}-form`}>
        {/* Search Mode Toggle */}
        <div className={styles.inputGroup} id={`${id}-search-mode-group`}>
          <label>Search Mode:</label>
          <div className={styles.radioGroup}>
            <label htmlFor={`${id}-search-regular`}>
              <input
                id={`${id}-search-regular`}
                type="radio"
                name="searchMode"
                checked={!useAutocomplete}
                onChange={() => setUseAutocomplete(false)}
              />
              Regular Search
            </label>
            <label htmlFor={`${id}-search-autocomplete`}>
              <input
                id={`${id}-search-autocomplete`}
                type="radio"
                name="searchMode"
                checked={useAutocomplete}
                onChange={() => setUseAutocomplete(true)}
              />
              Autocomplete Search
            </label>
          </div>
        </div>

        {/* Search Input with Autocomplete */}
        <div className={styles.inputGroup} id={`${id}-search-group`}>
          <label htmlFor={`${id}-search`}>
            Search Products:
            <div className={styles.searchContainer}>
              <input
                id={`${id}-search`}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className={styles.textInput}
                placeholder={useAutocomplete ? "Type to see suggestions..." : "Enter product name..."}
                ref={searchInputRef}
              />
              {useAutocomplete && showSuggestions && (
                <div className={styles.suggestionsContainer} ref={suggestionsRef}>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion}
                      className={`${styles.suggestionItem} ${
                        index === selectedSuggestionIndex ? styles.suggestionSelected : ''
                      }`}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Category Radio Buttons */}
        <div className={styles.inputGroup} id={`${id}-category-group`}>
          <label>Category:</label>
          <div className={styles.radioGroup}>
            <label htmlFor={`${id}-category-all`}>
              <input
                id={`${id}-category-all`}
                type="radio"
                name="category"
                value=""
                checked={selectedCategory === ""}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
              All Categories
            </label>
            <label htmlFor={`${id}-category-electronics`}>
              <input
                id={`${id}-category-electronics`}
                type="radio"
                name="category"
                value="Electronics"
                checked={selectedCategory === "Electronics"}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
              Electronics
            </label>
            <label htmlFor={`${id}-category-accessories`}>
              <input
                id={`${id}-category-accessories`}
                type="radio"
                name="category"
                value="Accessories"
                checked={selectedCategory === "Accessories"}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
              Accessories
            </label>
          </div>
        </div>

        {/* Price Range Radio Buttons */}
        <div className={styles.inputGroup} id={`${id}-price-group`}>
          <label>Price Range:</label>
          <div className={styles.radioGroup}>
            <label htmlFor={`${id}-price-all`}>
              <input
                id={`${id}-price-all`}
                type="radio"
                name="priceRange"
                value=""
                checked={selectedPriceRange === ""}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
              />
              All Prices
            </label>
            <label htmlFor={`${id}-price-low`}>
              <input
                id={`${id}-price-low`}
                type="radio"
                name="priceRange"
                value="0-30"
                checked={selectedPriceRange === "0-30"}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
              />
              Under $30
            </label>
            <label htmlFor={`${id}-price-medium`}>
              <input
                id={`${id}-price-medium`}
                type="radio"
                name="priceRange"
                value="30-80"
                checked={selectedPriceRange === "30-80"}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
              />
              $30 - $80
            </label>
            <label htmlFor={`${id}-price-high`}>
              <input
                id={`${id}-price-high`}
                type="radio"
                name="priceRange"
                value="80-200"
                checked={selectedPriceRange === "80-200"}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
              />
              $80 - $200
            </label>
          </div>
        </div>

        {/* Rating Radio Buttons */}
        <div className={styles.inputGroup} id={`${id}-rating-group`}>
          <label>Minimum Rating:</label>
          <div className={styles.radioGroup}>
            <label htmlFor={`${id}-rating-all`}>
              <input
                id={`${id}-rating-all`}
                type="radio"
                name="rating"
                value=""
                checked={selectedRating === ""}
                onChange={(e) => setSelectedRating(e.target.value)}
              />
              Any Rating
            </label>
            <label htmlFor={`${id}-rating-4`}>
              <input
                id={`${id}-rating-4`}
                type="radio"
                name="rating"
                value="4"
                checked={selectedRating === "4"}
                onChange={(e) => setSelectedRating(e.target.value)}
              />
              4+ Stars
            </label>
            <label htmlFor={`${id}-rating-4.5`}>
              <input
                id={`${id}-rating-4.5`}
                type="radio"
                name="rating"
                value="4.5"
                checked={selectedRating === "4.5"}
                onChange={(e) => setSelectedRating(e.target.value)}
              />
              4.5+ Stars
            </label>
          </div>
        </div>

        {/* Submit and Reset Buttons */}
        <div className={styles.inputGroup} id={`${id}-buttons-group`}>
          <input
            id={`${id}-submit`}
            type="submit"
            value="Search Products"
            className={styles.submitButton}
          />
          <input
            id={`${id}-reset`}
            type="button"
            value="Reset Filters"
            onClick={handleReset}
            className={styles.resetButton}
          />
        </div>
      </form>

      {error && (
        <div className={styles.error} id={`${id}-error`}>
          {error}
        </div>
      )}

      {/* Products Data Grid */}
      <div className={styles.dataGridContainer} id={`${id}-data-grid`}>
        <h3 className={styles.dataGridTitle}>
          {isFiltered ? `Search Results (${displayedProducts.length} products found)` : "All Products"}
        </h3>
        
        <div className={styles.dataGrid} id={`${id}-products-table`}>
          <table className={styles.productsTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {displayedProducts.map(product => (
                <tr key={product.id} data-product-id={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.rating}★</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {displayedProducts.length === 0 && (
          <div className={styles.noResults}>
            <p>No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}; 