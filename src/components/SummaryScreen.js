import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import AxiosInstance from '../core/axiosInstance';
import jsPDF from 'jspdf';
import './SummaryScreen.css';

const SummaryScreen = ( formData ) => {
  const [data, setData] = useState({});
  const history = useHistory();

  useEffect( async () => {
    console.log(localStorage.getItem("accessToken"))
    const data = await AxiosInstance.get("http://127.0.0.1:5000/form/get", {
      headers: {
        Authorization: `Basic ${localStorage.getItem("accessToken")}`,
      },
    })
    
    setData(data.data[data.data.length -1])
  },[])

  console.log(data)

  const handleSavePDF = () => {
    const doc = new jsPDF();
    let yOffset = 10;

    doc.text('Resumo do Formulário', 10, yOffset);
    yOffset += 10;

    if (formData) {
      for (const [key, value] of Object.entries(formData)) {
        doc.text(`${key}: ${value}`, 10, yOffset);
        yOffset += 10;
      }
    }

    doc.text(`Subtotal: R$${data.valor}`, 10, yOffset);

    doc.save('resumo_formulario.pdf');
  };

  console.log(data)

  return (
    <div className="summary-container">
      <h2>Resumo da simulação</h2>
      <div className="summary-details">
        {data && (
          <>
            <p><strong>Como conheceu a Santa Casa Copacabana:</strong> {data.origem}</p>
            <p><strong>Nome:</strong> {data.nome}</p>
            <p><strong>Cidade:</strong> {data.cidade}</p>
            <p><strong>Tem plano?</strong> {data.tPlano ? 'Sim' : 'Não'}</p>
            {data.tPlano && <p><strong>Plano:</strong> {data.tPlano}</p>}
            <p><strong>Idade:</strong> {data.idade}</p>
            <p><strong>Sexo:</strong> {data.sexo}</p>
            <p><strong>Plano Desejado:</strong> {data.plano}</p>
            <p><strong>Seguro:</strong> {data.seguro>0 ? `R$${data.seguro}` : 'Não'}</p>
            {data.desejaSeguro && <p><strong>Seguro:</strong> {data.seguro}</p>}
            <p><strong>Dependentes?</strong> {data.quantidade_dependentes>0 ? data.quantidade_dependentes : 'Não'}</p>
          </>
        )}
      </div>
      <div className="subtotal">
        <p><strong>Subtotal:</strong> R${data.valor}</p>
      </div>
      <div className="buttons-container">
        {/* <button onClick={handleSavePDF}>Salvar</button> */}
        
        <button onClick={() => window.location.href = "/simulation"}>Criar Nova Simulação</button>
        
      </div>
    </div>
  );
};

export default SummaryScreen;
