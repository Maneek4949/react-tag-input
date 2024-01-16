import AutoComplete from "./components/Autocomplete";

export default function App() {

  return (
    <div className="container mx-auto flex justify-center">
      <AutoComplete />
    </div>
  );
}
// options={ [
//   { id: "1", name: "Oranges", email: "oranges.bing@mail.com", dp: "location" },
//   { id: "2", name: "Apples", email: "apples.bing@mail.com", dp: "location" },
//   { id: "3", name: "Pears", email: "pears.bing@mail.com", dp: "location" }
// ]}