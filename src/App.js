import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:8087/customer";

function App() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [phno, setPhno] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [editId, setEditId] = useState(null);

  // Get all customers
  const getCustomers = async () => {
    try {
      const response = await fetch(`${API}/lists`);

      if (!response.ok) {
        throw new Error("Unable to fetch customers");
      }

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  // Clear form
  const clearForm = () => {
    setName("");
    setEmail("");
    setAge("");
    setPhno("");
    setCity("");
    setState("");
    setEditId(null);
  };

  // Add or update customer
  const saveCustomer = async (e) => {
    e.preventDefault();

    const customer = {
      name,
      email,
      age: Number(age),
      phno: Number(phno),
      city,
      state,
    };

    try {
      const url =
        editId === null ? API : `${API}/${editId}`;

      const method = editId === null ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      alert(editId === null ? "Customer added!" : "Customer updated!");

      clearForm();
      getCustomers();
    } catch (error) {
      console.error("Save error:", error);
      alert("Unable to save customer. Check the Spring Boot API.");
    }
  };

  // Edit customer
  const editCustomer = (customer) => {
    setName(customer.name || "");
    setEmail(customer.email || "");
    setAge(String(customer.age ?? ""));
    setPhno(String(customer.phno ?? ""));
    setCity(customer.city || "");
    setState(customer.state || "");
    setEditId(customer.cid);
  };

  // Delete customer
  const deleteCustomer = async (id) => {
    if (!window.confirm("Do you want to delete this customer?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      alert("Customer deleted!");
      getCustomers();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Unable to delete customer. Check the backend API.");
    }
  };

  return (
    <div className="container">
      <h1>Customer Portal</h1>
      <form onSubmit={saveCustomer}>
        <h2>{editId === null ? "Add Customer" : "Update Customer"}</h2>

        <input
          type="text"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Phone Number"
          value={phno}
          onChange={(e) => setPhno(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />

        <button type="submit">
          {editId === null ? "Add Customer" : "Update Customer"}
        </button>

        {editId !== null && (
          <button type="button" onClick={clearForm}>
            Cancel
          </button>
        )}
      </form>

      <h2>Customer List</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Phone</th>
            <th>City</th>
            <th>State</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer.cid}>
              <td>{customer.cid}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.age}</td>
              <td>{customer.phno}</td>
              <td>{customer.city}</td>
              <td>{customer.state}</td>
              <td>
                <button
                  type="button"
                  onClick={() => editCustomer(customer)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => deleteCustomer(customer.cid)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;