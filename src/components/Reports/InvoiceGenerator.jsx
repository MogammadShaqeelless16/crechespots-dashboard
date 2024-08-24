import React, { useState } from 'react';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { v4 as uuidv4 } from 'uuid';
import { FaPlus, FaCalculator } from 'react-icons/fa';
import './style/InvoiceGenerator.css'; // Import CSS for additional styling

// Define the Invoice PDF Document
const InvoiceDocument = ({ invoiceData }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      backgroundColor: '#f5f5f5',
    },
    header: {
      marginBottom: 20,
      textAlign: 'center',
    },
    logo: {
      width: 100,
      marginBottom: 10,
    },
    companyInfo: {
      marginBottom: 20,
    },
    section: {
      marginBottom: 20,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    col: {
      width: '50%',
    },
    title: {
      fontSize: 18,
      marginBottom: 10,
    },
    text: {
      fontSize: 12,
    },
    table: {
      marginBottom: 20,
      borderCollapse: 'collapse',
      width: '100%',
    },
    tableCell: {
      border: '1px solid #ddd',
      padding: 8,
      textAlign: 'right',
    },
    tableHeader: {
      backgroundColor: '#f4f4f4',
      fontSize: 14,
    },
    total: {
      fontSize: 18,
      marginTop: 10,
      textAlign: 'right',
    },
    footer: {
      marginTop: 20,
      textAlign: 'center',
      fontSize: 10,
      color: '#888',
    },
    notes: {
      marginTop: 20,
      borderTop: '1px solid #ddd',
      paddingTop: 10,
    },
  });

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          {invoiceData.logo && <Image style={styles.logo} src={invoiceData.logo} />}
          <Text style={styles.title}>Invoice</Text>
        </View>
        <View style={styles.companyInfo}>
          <Text style={styles.text}>{invoiceData.companyName}</Text>
          <Text style={styles.text}>{invoiceData.companyAddress}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.title}>To:</Text>
            <Text style={styles.text}>{invoiceData.customerName}</Text>
            <Text style={styles.text}>{invoiceData.customerAddress}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.text}>Invoice Number: {invoiceData.invoiceNumber}</Text>
            <Text style={styles.text}>Date: {invoiceData.invoiceDate}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Items:</Text>
          <View style={styles.table}>
            <View style={{ ...styles.row, ...styles.tableHeader }}>
              <Text style={styles.tableCell}>Description</Text>
              <Text style={styles.tableCell}>Quantity</Text>
              <Text style={styles.tableCell}>Unit Price (ZAR)</Text>
              <Text style={styles.tableCell}>Total (ZAR)</Text>
            </View>
            {invoiceData.items.map((item, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.tableCell}>{item.description}</Text>
                <Text style={styles.tableCell}>{item.quantity}</Text>
                <Text style={styles.tableCell}>{parseFloat(item.unitPrice).toFixed(2)}</Text>
                <Text style={styles.tableCell}>{parseFloat(item.total).toFixed(2)}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.total}>Subtotal: ZAR {parseFloat(invoiceData.subtotal).toFixed(2)}</Text>
          <Text style={styles.total}>Tax: ZAR {parseFloat(invoiceData.tax).toFixed(2)}</Text>
          <Text style={styles.total}>Total: ZAR {parseFloat(invoiceData.total).toFixed(2)}</Text>
        </View>
        <View style={styles.notes}>
          <Text style={styles.title}>Notes:</Text>
          <Text style={styles.text}>{invoiceData.notes}</Text>
        </View>
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
};

// Main Component
const InvoiceGenerator = () => {
  const [invoiceData, setInvoiceData] = useState({
    companyName: '',
    companyAddress: '',
    customerName: '',
    customerAddress: '',
    items: [{ description: '', quantity: 0, unitPrice: 0, total: 0 }],
    subtotal: 0,
    tax: 0,
    total: 0,
    invoiceNumber: uuidv4(),
    invoiceDate: new Date().toLocaleDateString(),
    logo: '', // Field to store the logo URL
    notes: '', // Field to store additional notes
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({ ...invoiceData, [name]: value });
  };

  const handleAddItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 0, unitPrice: 0, total: 0 }],
    });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...invoiceData.items];
    newItems[index][name] = parseFloat(value) || 0; // Ensure values are numbers
    newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const calculateTotals = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
    const tax = subtotal * 0.1; // Example 10% tax
    const total = subtotal + tax;
    setInvoiceData({ ...invoiceData, subtotal, tax, total });
  };

  return (
    <div className="invoice-generator">
      <h1>Create Invoice</h1>
      <form>
        <div className="form-group">
          <label>Company Name:</label>
          <input type="text" name="companyName" value={invoiceData.companyName} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Company Address:</label>
          <input type="text" name="companyAddress" value={invoiceData.companyAddress} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Customer Name:</label>
          <input type="text" name="customerName" value={invoiceData.customerName} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Customer Address:</label>
          <input type="text" name="customerAddress" value={invoiceData.customerAddress} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Company Logo (URL):</label>
          <input type="text" name="logo" value={invoiceData.logo} onChange={handleInputChange} placeholder="http://example.com/logo.png" />
        </div>
        <div>
          {invoiceData.items.map((item, index) => (
            <div key={index} className="item-group">
              <textarea
                name="description"
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleItemChange(index, e)}
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
              />
              <input
                type="number"
                name="unitPrice"
                placeholder="Unit Price"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(index, e)}
              />
              <input
                type="number"
                name="total"
                placeholder="Total"
                value={item.total}
                readOnly
              />
            </div>
          ))}
          <button type="button" onClick={handleAddItem} className="icon-button">
            <FaPlus /> Add Item
          </button>
        </div>
        <div className="form-group">
          <label>Additional Notes:</label>
          <textarea name="notes" value={invoiceData.notes} onChange={handleInputChange} rows="4" />
        </div>
        <button type="button" onClick={calculateTotals} className="icon-button">
          <FaCalculator /> Calculate Totals
        </button>
        <div className="invoice-summary">
          <p>Subtotal: ZAR {parseFloat(invoiceData.subtotal).toFixed(2)}</p>
          <p>Tax: ZAR {parseFloat(invoiceData.tax).toFixed(2)}</p>
          <p>Total: ZAR {parseFloat(invoiceData.total).toFixed(2)}</p>
        </div>
        <PDFDownloadLink document={<InvoiceDocument invoiceData={invoiceData} />} fileName={`invoice_${invoiceData.invoiceNumber}.pdf`}>
          {({ loading }) => (loading ? 'Generating PDF...' : 'Download Invoice')}
        </PDFDownloadLink>
      </form>
    </div>
  );
};

export default InvoiceGenerator;
