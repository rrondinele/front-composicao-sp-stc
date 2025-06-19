import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { eletricistasCompletos } from '../data/eletricistas';
import { br0MappingPorEstado } from '../data/eletricistas';
import { equipeOptionsCompleta } from '../data/equipes';
import { supervisorOptions } from '../data/supervisor';
import { placasPorEstado } from '../data/PlacasVeiculos';

const BASE_URL = 'https://composicao-sp-soc.onrender.com';

const CadastroEquipe = () => {
  const estado = localStorage.getItem('estado') || 'SP';

  const [supervisor, setSupervisor] = useState('');
  const [eletricistaMotorista, setEletricistaMotorista] = useState('');
  const [eletricistaParceiro, setEletricistaParceiro] = useState('');
  const [br0Motorista, setBr0Motorista] = useState('');
  const [br0Parceiro, setBr0Parceiro] = useState('');
  const [equipe, setEquipe] = useState('');
  const [placaVeiculo, setPlacaVeiculo] = useState('');
  const [dataAtividade, setDataAtividade] = useState('');
  const [eletricistasFaltantes, setEletricistasFaltantes] = useState([]);
  const [loadingFaltantes, setLoadingFaltantes] = useState(false);

  const handleEletricistaMotoristaChange = (value) => {
    setEletricistaMotorista(value);
    setBr0Motorista(br0MappingPorEstado[estado][value] || '');
  };

  const handleEletricistaParceiroChange = (value) => {
    setEletricistaParceiro(value);
    setBr0Parceiro(br0MappingPorEstado[estado][value] || '');
  };

  const fetchFaltantes = async () => {
    if (!dataAtividade) return;
    setLoadingFaltantes(true);

    try {
      const res = await axios.get(`${BASE_URL}/eletricistas/apontados`, {
        params: {
          data: dataAtividade,
          estado: estado,
        },
      });

      const apontados = res.data; // Exemplo: ["015105 - FULANO"]
      const todosEletricistas = eletricistasCompletos[estado].map((el) => el.value);

      const faltantes = todosEletricistas.filter((nome) => !apontados.includes(nome));

      setEletricistasFaltantes(faltantes);
    } catch (error) {
      console.error('Erro ao buscar faltantes:', error);
    } finally {
      setLoadingFaltantes(false);
    }
  };

  useEffect(() => {
    fetchFaltantes();
  }, [dataAtividade]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          type="date"
          label="Data da Atividade"
          value={dataAtividade}
          onChange={(e) => setDataAtividade(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>



      <Grid item xs={12}>
        <Typography variant="body2" color="textSecondary">
          Total de eletricistas cadastrados no estado <strong>{estado}</strong>:{" "}
          <strong>{eletricistasCompletos[estado]?.length || 0}</strong>
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          select
          label="Supervisor"
          fullWidth
          value={supervisor}
          onChange={(e) => setSupervisor(e.target.value)}
        >
          {supervisorOptions[estado].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          select
          label="Eletricista Motorista"
          fullWidth
          value={eletricistaMotorista}
          onChange={(e) => handleEletricistaMotoristaChange(e.target.value)}
        >
          {eletricistasCompletos[estado].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField label="BR0 Motorista" fullWidth value={br0Motorista} disabled />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          select
          label="Eletricista Parceiro"
          fullWidth
          value={eletricistaParceiro}
          onChange={(e) => handleEletricistaParceiroChange(e.target.value)}
        >
          {eletricistasCompletos[estado].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField label="BR0 Parceiro" fullWidth value={br0Parceiro} disabled />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          select
          label="Equipe"
          fullWidth
          value={equipe}
          onChange={(e) => setEquipe(e.target.value)}
        >
          {equipeOptionsCompleta[estado].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          select
          label="Placa Veículo"
          fullWidth
          value={placaVeiculo}
          onChange={(e) => setPlacaVeiculo(e.target.value)}
        >
          {placasPorEstado[estado].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" color="primary" fullWidth>
          Salvar
        </Button>
      </Grid>

      {/* Quadro de Faltantes */}
      {dataAtividade && (
        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="primary"
            onClick={fetchFaltantes}
            style={{ marginBottom: 10 }}
          >
            🔄 Atualizar Faltantes
          </Button>

          {loadingFaltantes ? (
            <Typography variant="body2">🔄 Buscando eletricistas faltantes...</Typography>
          ) : eletricistasFaltantes.length > 0 ? (
            <Paper elevation={3} style={{ padding: 16, marginTop: 10 }}>
              <Typography variant="h6" color="error" gutterBottom>
                ❌ Eletricistas ainda NÃO apontados ({estado}) - {dataAtividade}:
              </Typography>
              <List dense>
                {eletricistasFaltantes.map((nome, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={nome} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          ) : (
            <Paper elevation={1} style={{ padding: 16, marginTop: 10 }}>
              <Typography variant="body2" color="success.main">
                ✅ Todos os eletricistas já foram apontados para esta data!
              </Typography>
            </Paper>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default CadastroEquipe;