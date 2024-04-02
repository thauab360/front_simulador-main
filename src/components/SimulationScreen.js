import React, { useState, useEffect } from "react";
import AxiosInstance from "../core/axiosInstance";
import "./SimulationScreen.css";
import { Autocomplete, MenuItem, TextField } from "@mui/material";
import { useHistory } from "react-router-dom";

const SimulationScreen = () => {
  const [origem, setOrigem] = useState("");
  const [cidades, setCidades] = useState([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState("");
  const [planoSelecionado, setPlanoSelecionado] = useState("");
  const [seguroSelecionado, setSeguroSelecionado] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [temPlano, setTemPlano] = useState(false);
  const [temPlanoSelecionado, setTemPlanoSelecionado] = useState("");
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState("");
  const [desejaDependente, setDesejaDependente] = useState(false);
  const [dependentes, setDependentes] = useState([{}]);
  const history = useHistory();


  const formatarTelefone = (telefone) => {

    const numerosTelefone = telefone.replace(/\D/g, '');

    // Aplica a máscara de telefone (XX) XXXX-XXXX
    return numerosTelefone.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
  };

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


  // useEffect(() => {
  //   const fetchCidades = async () => {
  //     if (!estadoSelecionado) return;
  //     try {
  //       if (codigoEstado === "") return;
  //       const response = await AxiosInstance.get(
  //         `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`
  //       );
  //       if (response.status != 200) {
  //         throw new Error("Erro ao buscar as cidades");
  //       }

  //       const data = await response.data;

  //       const cidadesDoEstado = data.map((cidade) => cidade.nome);
  //       setCidades(cidadesDoEstado);
  //     } catch (error) {
  //       console.error("Erro ao buscar as cidades:", error);
  //     }
  //   };

  //   fetchCidades();
  // }, [estadoSelecionado]);

  const handleSubmit = async (event) => {
    try {
      const Object = {
        origem: origem,
        nome: nome,
        celular: telefone,
        cidade: cidadeSelecionada,
        temPlano: temPlanoSelecionado,
        plano: planoSelecionado,
        idade: parseInt(idade),
        sexo: sexo,
        dependentes: dependentes.map((dependente) => {
          const Obj = {
            idade: parseInt(dependente.idade),
            seguro: parseInt(dependente.seguro),
          }

          return Obj

        }),
        seguro: parseInt(seguroSelecionado),
      }

      console.log(Object)
      const response = await AxiosInstance.post(
        "http://127.0.0.1:5000/form/save",
        Object,
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
    setDependentes([...dependentes, { idade: "", seguro: "" }]);
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

      <div className="form-group">
        <TextField
          select
          label="Como conheceu a Santa Casa Copacabana?"
          id="typeText"
          type="text"
          value={origem}
          onChange={(e) => setOrigem(e.target.value)}
          className="textfield"
          variant="standard"
          sx={{ width: "350px" }}
        >
          <MenuItem value="TV Record">TV Record</MenuItem>
          <MenuItem value="Indicação">Indicação</MenuItem>
          <MenuItem value="Outdoor">Outdoor</MenuItem>
          <MenuItem value="Facebook">Facebook</MenuItem>
          <MenuItem value="Instagram">Instagram</MenuItem>
          <MenuItem value="Site">Site</MenuItem>
          <MenuItem value="93 FM">93 FM</MenuItem>
          <MenuItem value="PremiaPão">PremiaPão</MenuItem>
        </TextField>
      </div>

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
          <TextField
            label="Telefone"
            id="typeText"
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
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
              value={temPlanoSelecionado}
              onChange={(e) => setTemPlanoSelecionado(e.target.value)}
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
            disabled={idade > 79}
            type="text"
            value={seguroSelecionado || "false"}
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

                <label>
                  <TextField
                    select
                    label="Seguro:"
                    id="typeText"
                    disabled={dependente.idade > 79}
                    value={dependente.seguro}
                    onChange={(e) => {
                      const novosDependentes = [...dependentes];
                      novosDependentes[index].seguro = e.target.value;
                      setDependentes(novosDependentes);
                    }}
                    className="textfield"
                    variant="standard"
                    sx={{ width: "100px" }}
                  >
                    <MenuItem value="false">NÃO</MenuItem>
                    <MenuItem value="14">PADRÃO</MenuItem>
                    <MenuItem value="20">ESPECIAL</MenuItem>
                  </TextField>
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
