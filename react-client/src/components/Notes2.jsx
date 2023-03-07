import React from "react";
import { useNotes2 } from "../hooks";
import CreateAndList from "./CreateAndList";

function Notes2() {
  const { create, notes } = useNotes2();

  const onCreate = async (val) => {
    await create(val);
  };

  return <CreateAndList list={notes} onCreate={onCreate} />;
}

export default Notes2;
