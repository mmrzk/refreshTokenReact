import React from "react";
import { useNotes1 } from "../hooks";
import CreateAndList from "./CreateAndList";

function Notes1() {
  const { create, notes } = useNotes1();

  const onCreate = async (val) => {
    await create(val);
  };

  return <CreateAndList list={notes} onCreate={onCreate} />;
}

export default Notes1;
