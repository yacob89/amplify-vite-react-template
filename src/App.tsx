import { useEffect } from "react";
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const { signOut } = useAuthenticator();
  // const [people, setPeople] = useState<Array<Schema["Person"]["type"]>>([]);

  useEffect(() => {
    // For now, we'll just log to console since we don't have a full UI yet
    console.log("App loaded with new schema");
  }, []);

  function createPerson() {
    const fullName = window.prompt("Person's full name");
    const address = window.prompt("Person's address");
    const whatsapp = window.prompt("Person's WhatsApp number");
    
    if (fullName && address && whatsapp) {
      client.models.Person.create({ 
        fullName, 
        address, 
        whatsappE164: whatsapp,
        notes: "" 
      });
    }
  }

  return (
    <main>
      <h1>Church Management System</h1>
      <button onClick={createPerson}>+ Add Person</button>
      <div>
        🥳 App successfully hosted with new schema.
        <br />
        <p>This application now uses the new church management data models.</p>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
