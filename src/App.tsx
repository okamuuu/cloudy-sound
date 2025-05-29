import "./App.css";

import { Tracks } from "./pages/Tracks";

function App() {
  return (
    <>
      <h1
        className="p-4 text-3xl font-logo tracking-wide text-gray-800"
        style={{ fontFamily: "Quicksand" }}
      >
        Cloudy Sound
      </h1>
      <Tracks />
    </>
  );
}

export default App;
