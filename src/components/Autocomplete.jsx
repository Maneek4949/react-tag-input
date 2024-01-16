import React, { useState, useEffect, useRef } from "react";

const AutoComplete = ({ options = [
  { id: "1", name: "Jhon Jon", email: "jhon@abc.com", dp: "/src/assets/1.png" },
  { id: "2", name: "Deni Half", email: "deni@acs@.com", dp: "/src/assets/2.png" },
  { id: "3", name: "Tracy Ne", email: "tracy@gmail.com", dp: "/src/assets/3.png" },
  { id: "4", name: "Ken Albo", email: "ken@abc.com", dp: "/src/assets/4.png" },
  { id: "5", name: "Nancy Nas", email: "nancy@mail.com", dp: "/src/assets/5.png" }
] }) => {
  const [tags, setTags] = useState([]);
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
  const autocompleteRef = useRef();
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setLastSelectedIndex(null);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Backspace" && value === "") {
        if (lastSelectedIndex !== null) {
          removeTag(tags[lastSelectedIndex]);
        } else if (tags.length > 0) {
          setLastSelectedIndex(tags.length - 1);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [value, tags, lastSelectedIndex]);

  useEffect(() => {
    const newSuggestions = options.filter(
      (option) =>
        !tags.some((tag) => tag.id === option.id) &&
        option.name.toLowerCase().includes(value.toLowerCase())
    );

    if (autocompleteRef.current && autocompleteRef.current.contains(document.activeElement)) {
      if (lastSelectedIndex !== null) {
        setShowSuggestions(false);
      } else {
        setShowSuggestions(newSuggestions.length > 0);
      }
    }
  }, [value, tags, options, lastSelectedIndex]);

  const handleChange = (event) => {
    setValue(event.target.value);
    setLastSelectedIndex(null);
  };

  const handleSuggestionClick = (suggestion) => {
    setTags([...tags, suggestion]);
    setShowSuggestions(true);
    setValue("");
    setLastSelectedIndex(null);

    if (autocompleteRef.current && lastSelectedIndex === null) {
      autocompleteRef.current.querySelector("input").focus();
    }
  };

  const removeTag = (removedTag) => {
    const newTags = tags.filter((tag) => tag.id !== removedTag.id);
    setTags(newTags);
    setLastSelectedIndex(null);
  };

  return (
    <div>

      <div className="mt-5 block" ref={autocompleteRef}>
        <div className="flex">
        {tags.map((tag, index) => (
          <div 
            key={tag.id}
            className={`rounded-full flex w-28 gap-2 items-center bg-gray-100 ${lastSelectedIndex === index ? 'selected' : ''}`}
          >
            <img className="w-5 h-5" src={tag.dp}/> <span className="font-medium">{tag.name}</span><span onClick={() => removeTag(tag)}>x</span>
          </div>
        ))}

        <input className="w-96 border-b-4 border-indigo-500 px-3 outline-none"
          value={value}
          onChange={handleChange}
          placeholder="Search"
          onFocus={() => setShowSuggestions(true)}
        />
      </div>
      </div>
      {showSuggestions && (
        <ul className=" w-80 max-h-36 overflow-auto shadow-xl">
          {options
            .filter(
              (option) =>
                !tags.some((tag) => tag.id === option.id) &&
                option.name.toLowerCase().includes(value.toLowerCase())
            )
            .map((suggestion) => (
              <li
                onClick={() => handleSuggestionClick(suggestion)}
                key={suggestion.id}
              ><div className="px-1 py-3 flex gap-4 items-center bg-white hover:bg-gray-100">
                <img className="w-8 h-8" src={suggestion.dp}/> <span className="font-medium">{suggestion.name} </span>
                <span className="text-gray-800 text-sm">{suggestion.email}</span>
              </div>
                
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default AutoComplete;
