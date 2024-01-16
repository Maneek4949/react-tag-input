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

      <div className="mt-10 block " ref={autocompleteRef}>
        <div className="flex border-b-4 border-indigo-500 relative">
        {tags.map((tag, index) => (
          <div 
            key={tag.id}
            className={`px-0.5 mb-2 ml-3 rounded-full w-32 flex justify-around items-center bg-gray-300 ${lastSelectedIndex === index ? 'outline outline-offset-2 outline-blue-500' : ''}`}
          >
            <img className="w-5 object-cover" src={tag.dp}/> <span className="font-medium text-sm">{tag.name}</span><span className=" font-medium rounded-none cursor-pointer " onClick={() => removeTag(tag)}>X</span>
          </div>
        ))}
    <div className="block relative">
        <input className="ml-3 w-96 px-3 outline-none"
          value={value}
          onChange={handleChange}
          placeholder="Add new user..."
          onFocus={() => setShowSuggestions(true)}
        />
        {showSuggestions && (
        <ul className="absolute w-80 max-h-36 overflow-auto shadow-xl">
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
              ><div className="px-3 py-3 flex justify-between  items-center bg-white hover:bg-gray-200">
                <div className="flex items-center"> <img className="object-cover w-8 mr-2" src={suggestion.dp}/> <span className="font-medium">{suggestion.name} </span></div>
               <span className="text-gray-800 text-sm">{suggestion.email}</span>
              </div>
                
              </li>
            ))}
        </ul>
      )}
      </div>
      </div>
      </div>
      
    </div>
  );
};

export default AutoComplete;
