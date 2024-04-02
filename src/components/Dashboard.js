import React, { useState, useEffect } from 'react';
import { getSavedForms } from '../services/formService';
import './Dashboard.css';
import AxiosInstance from '../core/axiosInstance';

const Dashboard = () => {
  const [savedForms, setSavedForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [filterStartDate, setFilterStartDate] = useState('');
  // const [filterEndDate, setFilterEndDate] = useState('');

  useEffect( async () => {
    const data = await AxiosInstance.get("http://127.0.0.1:5000/form/get", {
      headers: {
        Authorization: `Basic ${localStorage.getItem("accessToken")}`,
      },
    })
    console.log(data)
    // fetchSavedForms();
  }, []);

  useEffect(() => {
    
    filterFormsByDate();
  }, [filterStartDate, savedForms]);

  const fetchSavedForms = async () => {
    try {
      const forms = await getSavedForms(); // Função para buscar os formulários salvos do backend
      setSavedForms(forms);
    } catch (error) {
      console.error('Erro ao buscar formulários salvos:', error);
    }
  };

  const filterFormsByDate = () => {
    const filtered = savedForms.filter(form => {
      const formDate = new Date(form.date);
      const startDate = new Date(filterStartDate);
      // return (!filterStartDate || formDate >= startDate) && (!filterEndDate || formDate <= endDate);
    });
    setFilteredForms(filtered);
  };

  const handleFilterStartDateChange = (event) => {
    setFilterStartDate(event.target.value);
  };

  const handleSavePDF = (form) => {
    
  };

  return (
    <div class="container">
      <h1>Minhas simulações</h1>
      
      <div class="date-filter">
        <label>Data Inicial:</label>
        <input type="date" value="{filterStartDate}" onChange="{handleFilterStartDateChange}" />
{/*         
        <label>Data Final:</label>
        <input type="date" value="{filterEndDate}" onChange="{handleFilterEndDateChange}" />

        <button onclick="handleFilterClick()">Filtrar</button> */}
      </div>
   
      <ul>
        {filteredForms.map(form => (
          <li key={form.id}>
            <div>{form.clientName}</div>
            <div>{form.date}</div>
            {/* Resumo do formulário */}
            <div>
              <p><strong>Nome:</strong> {form.clientName}</p>
              <p><strong>Quantidade de Dependentes:</strong> {form.dependents.length}</p>
              <p><strong>Subtotal:</strong> R$ {calculateSubtotal(form)}</p>
            </div>

          </li>
        ))}
      </ul>
    </div>
  );
};

// Função para calcular o subtotal
const calculateSubtotal = (form) => {
  // Lógica para calcular o subtotal
  return 0; // Retorna 0 por enquanto, substitua pela lógica real
};

export default Dashboard;
