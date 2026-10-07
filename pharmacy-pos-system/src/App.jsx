import React, { useState } from 'react';
import { medicinesData } from './data/medicines';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [medicines] = useState(medicinesData);
  const [cart, setCart] = useState([]);
  const [invoice, setInvoice] = useState(null);

  // Search filter logic
  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add item to POS cart
  const addToCart = (med) => {
    const existingItem = cart.find(item => item.id === med.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === med.id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCart([...cart, { ...med, qty: 1 }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Calculate Total Bill
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Generate Invoice
  const handleCheckout = () => {
    if (cart.length === 0) return;
    const newInvoice = {
      invoiceId: "INV-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleString(),
      items: [...cart],
      total: totalAmount
    };
    setInvoice(newInvoice);
    setCart([]); // Cart clear after checkout
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <header style={{ marginBottom: "20px" }}>
        <h2 style={{ color: "#2c3e50" }}>Assort Tech - Pharmacy POS & Invoice System</h2>
        <p style={{ color: "#7f8c8d" }}>Manage inventory, search medicines, and generate instant invoices.</p>
      </header>

      {/* Main Layout Grid */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        
        {/* Left Side: Search & Inventory */}
        <div style={{ flex: "2", minWidth: "300px" }}>
          {/* Search Input Box */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Search medicine by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "10px 15px",
                width: "100%",
                borderRadius: "6px",
                border: "1px solid #bdc3c7",
                fontSize: "16px"
              }}
            />
          </div>

          {/* Inventory Table */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "#34495e", color: "#ffffff" }}>
                  <th style={{ padding: "10px" }}>Name</th>
                  <th style={{ padding: "10px" }}>Stock</th>
                  <th style={{ padding: "10px" }}>Price</th>
                  <th style={{ padding: "10px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map((med) => (
                  <tr key={med.id} style={{ borderBottom: "1px solid #ecf0f1" }}>
                    <td style={{ padding: "10px" }}>
                      <strong>{med.name}</strong><br />
                      <small style={{ color: "#7f8c8d" }}>{med.category}</small>
                    </td>
                    <td style={{ padding: "10px", color: med.stock < 10 ? "red" : "green" }}>
                      {med.stock}
                    </td>
                    <td style={{ padding: "10px" }}>Rs. {med.price}</td>
                    <td style={{ padding: "10px" }}>
                      <button 
                        onClick={() => addToCart(med)}
                        style={{ padding: "6px 12px", backgroundColor: "#27ae60", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: POS Cart & Billing */}
        <div style={{ flex: "1", minWidth: "280px", backgroundColor: "white", padding: "15px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h3 style={{ borderBottom: "2px solid #ecf0f1", paddingBottom: "10px", color: "#2c3e50" }}>Current Cart</h3>
          
          {cart.length === 0 ? (
            <p style={{ color: "#7f8c8d", textAlign: "center", marginTop: "20px" }}>Cart is empty</p>
          ) : (
            <div>
              {cart.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", borderBottom: "1px solid #f1f2f6", paddingBottom: "8px" }}>
                  <div>
                    <span style={{ fontWeight: "bold" }}>{item.name}</span><br />
                    <small>{item.qty} x Rs. {item.price}</small>
                  </div>
                  <div>
                    <span style={{ marginRight: "10px", fontWeight: "bold" }}>Rs. {item.qty * item.price}</span>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: "#e74c3c", color: "white", border: "none", borderRadius: "3px", padding: "3px 6px", cursor: "pointer" }}>X</button>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: "20px", borderTop: "2px solid #2c3e50", paddingTop: "10px" }}>
                <h4>Total: Rs. {totalAmount}</h4>
                <button 
                  onClick={handleCheckout}
                  style={{ width: "100%", padding: "10px", backgroundColor: "#2980b9", color: "white", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}
                >
                  Generate Invoice
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Invoice Receipt Section */}
      {invoice && (
        <div style={{ marginTop: "30px", backgroundColor: "white", padding: "20px", borderRadius: "8px", border: "2px dashed #2980b9", maxWidth: "600px", margin: "30px auto" }}>
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <h3 style={{ margin: "0", color: "#2c3e50" }}>Assort Tech Pharmacy Store</h3>
            <p style={{ margin: "5px 0", color: "#7f8c8d", fontSize: "14px" }}>Official Sales Invoice</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
            <span><strong>Invoice ID:</strong> {invoice.invoiceId}</span>
            <span><strong>Date:</strong> {invoice.date}</span>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", marginBottom: "15px" }}>
            <thead>
              <tr style={{ background: "#f1f2f6" }}>
                <th style={{ padding: "8px", textAlign: "left" }}>Item</th>
                <th style={{ padding: "8px", textAlign: "center" }}>Qty</th>
                <th style={{ padding: "8px", textAlign: "right" }}>Price</th>
                <th style={{ padding: "8px", textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((invItem, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #f1f2f6" }}>
                  <td style={{ padding: "8px" }}>{invItem.name}</td>
                  <td style={{ padding: "8px", textAlign: "center" }}>{invItem.qty}</td>
                  <td style={{ padding: "8px", textAlign: "right" }}>Rs. {invItem.price}</td>
                  <td style={{ padding: "8px", textAlign: "right" }}>Rs. {invItem.qty * invItem.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ textAlign: "right", fontSize: "16px", fontWeight: "bold", borderTop: "1px solid #ddd", paddingTop: "10px" }}>
            Grand Total: Rs. {invoice.total}
          </div>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button 
              onClick={() => window.print()} 
              style={{ padding: "8px 20px", backgroundColor: "#27ae60", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "10px" }}
            >
              Print Invoice
            </button>
            <button 
              onClick={() => setInvoice(null)} 
              style={{ padding: "8px 20px", backgroundColor: "#e74c3c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;