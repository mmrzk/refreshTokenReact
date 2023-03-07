import { useNotes1, useNotes2, useNotes3 } from "../hooks";

const Dashboard = () => {
  const { notes: notes1, isLoading: isLoading1 } = useNotes1();
  const { notes: notes2, isLoading: isLoading2 } = useNotes2();
  const { notes: notes3, isLoading: isLoading3 } = useNotes3(2000);
  return (
    <>
      <h2>Добрий день, то є стільниця:</h2>
      <section>
        <header>Ось ваші дані</header>
        <div style={{ display: "flex", gap: "2rem" }}>
          <div>
            <h3>Notes 1</h3>
            {isLoading1 ? (
              "loading..."
            ) : (
              <ul>
                {notes1?.map((note, idx) => (
                  <li key={note + idx}>{note}</li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3>Notes 2</h3>
            {isLoading2 ? (
              "loading..."
            ) : (
              <ul>
                {notes2?.map((note, idx) => (
                  <li key={note + idx}>{note}</li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3>Notes 3</h3>
            {isLoading3 ? (
              "loading..."
            ) : (
              <ul>
                {notes3?.map((note, idx) => (
                  <li key={note + idx}>{note}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
