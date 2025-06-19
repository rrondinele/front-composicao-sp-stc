CadastroEquipe.js

import React, { useState } from 'react';
import { TextField, Button, MenuItem, Grid } from '@mui/material';
import { eletricistasCompletos } from '../data/eletricistas';
import { br0MappingPorEstado } from '../data/eletricistas';
import { equipeOptionsCompleta } from '../data/equipes';
import { supervisorOptions } from '../data/supervisor';
import { placasPorEstado } from '../data/PlacasVeiculos';

const CadastroEquipe = () => {
  const estado = localStorage.getItem('estado') || 'SP';

  const [supervisor, setSupervisor] = useState('');
  const [eletricistaMotorista, setEletricistaMotorista] = useState('');
  const [eletricistaParceiro, setEletricistaParceiro] = useState('');
  const [br0Motorista, setBr0Motorista] = useState('');
  const [br0Parceiro, setBr0Parceiro] = useState('');
  const [equipe, setEquipe] = useState('');
  const [placaVeiculo, setPlacaVeiculo] = useState('');

  const handleEletricistaMotoristaChange = (value) => {
    setEletricistaMotorista(value);
    setBr0Motorista(br0MappingPorEstado[estado][value] || '');
  };

  const handleEletricistaParceiroChange = (value) => {
    setEletricistaParceiro(value);
    setBr0Parceiro(br0MappingPorEstado[estado][value] || '');
  };

  return (
    <Grid container spacing={2}>
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
        <TextField
          label="BR0 Motorista"
          fullWidth
          value={br0Motorista}
          disabled
        />
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
        <TextField
          label="BR0 Parceiro"
          fullWidth
          value={br0Parceiro}
          disabled
        />
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
    </Grid>
  );
};

export default CadastroEquipe;