import React, { useState, useEffect } from "react";
import AxiosInstance from "../core/axiosInstance";
import "./SimulationScreen.css";
import { Autocomplete, MenuItem, TextField } from "@mui/material";
import { useHistory } from "react-router-dom";

const SimulationScreen = () => {
  const [cidades, setCidades] = useState([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState("");
  const [planoSelecionado, setPlanoSelecionado] = useState("");
  const [seguroSelecionado, setSeguroSelecionado] = useState("");
  const [nome, setNome] = useState("");
  const [temPlano, setTemPlano] = useState(false);
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState("");
  const [desejaDependente, setDesejaDependente] = useState(false);
  const [dependentes, setDependentes] = useState([{ idade: "" }]);
  const history = useHistory();

  useEffect(() => {
    const fetchCidades = async () => {
      try {
        const response = await AxiosInstance.get(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados/33/municipios"
        );
        if (response.status != 200) {
          throw new Error("Erro ao buscar as cidades");
        }

        const data = await response.data;

        const cidadesDoRioDeJaneiro = data.map((cidade) => cidade.nome);
        setCidades(cidadesDoRioDeJaneiro);
      } catch (error) {
        console.error("Erro ao buscar as cidades:", error);
      }
    };
    
    fetchCidades();
  }, []);

  const handleSubmit = async (event) => {
    try {
      const response = await AxiosInstance.post(
        "http://127.0.0.1:5000/form/save",
        {
          nome: nome,
          cidade: cidadeSelecionada,
          plano: planoSelecionado,
          idade: idade,
          sexo: sexo,
          dependentes: dependentes.map((idade) => {
            return idade.idade
          }),
          seguro: seguroSelecionado,
        },
        {
          headers: {
            Authorization: `Basic ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      console.log("Dados salvos com sucesso:", response.data);
      history.push("/summary");
    
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  const handleAddDependente = () => {
    setDependentes([...dependentes, { idade: ""}]);
  };

  const handleRemoveDependente = (index) => {
    const novosDependentes = [...dependentes];
    novosDependentes.splice(index, 1);
    setDependentes(novosDependentes);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");

    window.location.href = "/";
  };

  return (
    <div className="main-container">
      <h2>Simulação</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <TextField
            label="Nome"
            id="typeText"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="textfield"
            variant="standard"
          />
        </div>

        <div className="form-group">
          <Autocomplete
            id="cidade"
            options={cidades}
            getOptionLabel={(option) => option}
            value={cidadeSelecionada}
            onChange={(event, newValue) => setCidadeSelecionada(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cidade"
                variant="standard"
                sx={{ width: "250px" }}
              />
            )}
          />
        </div>

        <div className="form-group toggle-label">
          Tem outro plano?
          <div className="toggle-button" onClick={() => setTemPlano(!temPlano)}>
            <div className={`slider ${temPlano ? "checked" : ""}`}></div>
          </div>
        </div>

        {temPlano && (
          <div className="form-group">
            <TextField
              label="Qual plano?"
              id="typeText"
              type="text"
              onChange={(e) => e.target.value}
              className="textfield"
              variant="standard"
            />
          </div>
        )}
        <div className="form-group">
          <TextField
            label="Idade"
            id="typeText"
            type="text"
            value={idade}
            onChange={(e) => {
              const inputValue = e.target.value;
              const numbersOnly = inputValue.replace(/[^0-9]/g, "");
              setIdade(numbersOnly);
            }}
            className="textfield"
            variant="standard"
            sx={{ width: "45px" }}
          />
        </div>

        <div className="form-group">
          <TextField
            select
            label="Sexo"
            id="typeText"
            type="text"
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            className="textfield"
            variant="standard"
            sx={{ width: "100px" }}
          >
            <MenuItem value="masculino">Masculino</MenuItem>
            <MenuItem value="feminino">Feminino</MenuItem>
          </TextField>
        </div>

        <div className="form-group">
          <TextField
            select
            label="Plano desejado:"
            id="typeText"
            type="text"
            value={planoSelecionado}
            onChange={(e) => setPlanoSelecionado(e.target.value)}
            className="textfield"
            variant="standard"
            sx={{ width: "135px" }}
          >
            <MenuItem value="PADRÃO">PADRÃO</MenuItem>
            <MenuItem value="POPULAR">POPULAR</MenuItem>
            <MenuItem value="SEMI-LUXO">SEMI-LUXO</MenuItem>
            <MenuItem value="LUXO">LUXO</MenuItem>
            <MenuItem value="SUPER-LUXO">SUPER-LUXO</MenuItem>
            <MenuItem value="PRESIDENCIAL">PRESIDENCIAL</MenuItem>
          </TextField>
        </div>

        <div className="form-group">
          <TextField 
            defaultValue={"false"}
            placeholder="Não"
            select
            label="Seguro:"
            id="typeText"
            type="text"
            value={seguroSelecionado}
            onChange={(e) => setSeguroSelecionado(e.target.value)}
            className="textfield"
            variant="standard"
            sx={{ width: "100px" }}
          >
            <MenuItem value="false">NÃO</MenuItem>
            <MenuItem value="14">PADRÃO</MenuItem>
            <MenuItem value="20">ESPECIAL</MenuItem>
          </TextField>
        </div>

        <div className="form-group toggle-label">
          Deseja adicionar dependente?
          <div
            className="toggle-button"
            onClick={() => setDesejaDependente(!desejaDependente)}
          >
            <div
              className={`slider ${desejaDependente ? "checked" : ""}`}
            ></div>
          </div>
        </div>

        {desejaDependente && (
          <div>
            {dependentes.map((dependente, index) => (
              <div key={index} className="form-group dependent-card">
                <h3>Dependente {index + 1}</h3>

                <label>
                  <TextField
                    label="Idade:"
                    id="typeText"
                    type="text"
                    value={dependente.idade}
                    onChange={(e) => {
                      const novosDependentes = [...dependentes];
                      const inputValue = e.target.value;
                      const numbersOnly = inputValue.replace(/[^0-9]/g, "");
                      novosDependentes[index].idade = numbersOnly;
                      setDependentes(novosDependentes);
                    }}
                    className="textfield"
                    variant="standard"
                    sx={{ width: "45px" }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => handleRemoveDependente(index)}
                >
                  Remover
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddDependente}
              className="form-group"
            >
              Adicionar Dependente
            </button>
          </div>
        )}

        <div className="button-group">
            
            <button onClick={handleSubmit} type="button">Enviar</button>
            
          <button onClick={handleLogout} type="button">Logout</button>
        </div>
      </form>
    </div>
  );
};

export default SimulationScreen;
