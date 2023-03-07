import React from "react";
import { useNotes3 } from "../hooks";
import CreateAndList from "./CreateAndList";

function Notes3() {
  const { create, notes } = useNotes3();

  const onCreate = async (val) => {
    await create(val);
  };

  return <CreateAndList list={notes} onCreate={onCreate} />;
}

export default Notes3;
