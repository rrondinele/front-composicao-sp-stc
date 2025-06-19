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

  const handleEletricistaMotoristaChange = (value) => {
    setEletricistaMotorista(value);
    setBr0Motorista(br0MappingPorEstado[estado][value] || '');
  };

  const handleEletricistaParceiroChange = (value) => {
    setEletricistaParceiro(value);
    setBr0Parceiro(br0MappingPorEstado[estado][value] || '');
  };

  // Normalização de nomes para evitar problema de espaços ou letras maiúsculas
  const normalize = (str) => str.trim().toUpperCase();

  // Função para buscar os faltantes
  const fetchFaltantes = async () => {
    if (!dataAtividade) return;

    try {
      const res = await axios.get(`${BASE_URL}/eletricistas/apontados`, {
        params: {
          data: dataAtividade,
          estado: estado,
        },
      });

      const apontados = res.data || [];
      const todosEletricistas = eletricistasCompletos[estado].map((el) => el.value);

      const faltantes = todosEletricistas.filter(
        (nome) => !apontados.map(normalize).includes(normalize(nome))
      );

      setEletricistasFaltantes(faltantes);
    } catch (error) {
      console.error('Erro ao buscar faltantes:', error);
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
      <Grid item xs={12}>
        {dataAtividade && (
          <>
            <Button
              variant="outlined"
              onClick={fetchFaltantes}
              style={{ marginBottom: 10 }}
            >
              Atualizar Faltantes
            </Button>

            {eletricistasFaltantes.length > 0 ? (
              <Paper elevation={3} style={{ padding: 16, marginTop: 10 }}>
                <Typography variant="h6" color="error" gutterBottom>
                  Eletricistas ainda NÃO apontados ({estado}) - {dataAtividade}:
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
              <Typography variant="body2" color="success.main">
                ✅ Todos os eletricistas já foram apontados para esta data!
              </Typography>
            )}
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default CadastroEquipe;