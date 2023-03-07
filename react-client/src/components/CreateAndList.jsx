import React, { useState } from "react";

function CreateAndList({ list, onCreate }) {
  const [val, setVal] = useState("");

  const onClick = () => {
    onCreate(val);
  };

  return (
    <div>
      <ul>
        {list?.map((item, idx) => (
          <li key={item + idx}>{item}</li>
        ))}
      </ul>

      <input value={val} onInput={(e) => setVal(e.target.value)} type="text" />

      <button onClick={onClick}>Зберегти</button>
    </div>
  );
}

export default CreateAndList;
