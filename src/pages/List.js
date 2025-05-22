import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import CarTable from '../components/CarTable';
import axios from '../axios';

function List() {
  const [models, setModels] = useState([]);
  const [search, setSearch] = useState('');

  const loadModels = async () => {
    try {
      const res = await axios.get('/api/car-models');
      setModels(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete?')) {
      await axios.delete(`/api/car-models/${id}`);
      loadModels();
    }
  };

  const filtered = models.filter(m =>
    m.modelName.toLowerCase().includes(search.toLowerCase()) ||
    m.modelCode.toLowerCase().includes(search.toLowerCase())
  );

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableData = filtered.map(m => [
      m.modelName,
      m.brand,
      m.class,
      `₹${m.price}`,
      m.active ? 'Yes' : 'No',
      new Date(m.dateOfManufacturing).toLocaleDateString()
    ]);

    autoTable(doc, {
      head: [['Model Name', 'Brand', 'Class', 'Price', 'Active', 'Manufactured']],
      body: tableData
    });

    doc.save('CarModelInventory.pdf');
  };

  const exportToExcel = () => {
    const wsData = [
      ['Model Name', 'Brand', 'Class', 'Price', 'Active', 'Manufactured'],
      ...filtered.map(m => [
        m.modelName,
        m.brand,
        m.class,
        m.price,
        m.active ? 'Yes' : 'No',
        new Date(m.dateOfManufacturing).toLocaleDateString()
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'CarModelInventory.xlsx');
  };

  return (
    <div className="list-wrapper">
      <h2 className="page-title">Car Model Management</h2>

      <div className="top-actions">
        <input
          type="text"
          className="search-input"
          placeholder="Search by model name or code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="button-group">
          <Link to="/create">
            <button className="btn primary-btn">Add New Model</button>
          </Link>
          <button className="btn export-btn" onClick={exportToPDF}>PDF</button>
          <button className="btn export-btn" onClick={exportToExcel}>Excel</button>
        </div>
      </div>

      <CarTable cars={filtered} onDelete={handleDelete} />
    </div>
  );
}

export default List;
