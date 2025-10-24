// Hook personalizado para manejo de dispensadores
import { useState, useEffect } from 'react';
import dispenserService from '../services/dispenserService';

export const useDispenser = () => {
  const [dispensers, setDispensers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  const fetchDispensers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dispenserService.getDispensers();
      setDispensers(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dispensers:', err);
    } finally {
      setLoading(false);
    }
  };

  const createDispenser = async (dispenserData) => {
    try {
      setCreating(true);
      setError(null);
      const newDispenser = await dispenserService.createDispenser(dispenserData);
      setDispensers(prev => [...prev, newDispenser]);
      return newDispenser;
    } catch (err) {
      setError(err.message);
      console.error('Error creating dispenser:', err);
      throw err;
    } finally {
      setCreating(false);
    }
  };

  const getDispenserById = async (id) => {
    try {
      return await dispenserService.getDispenserById(id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateDispenser = async (id, dispenserData) => {
    try {
      const updatedDispenser = await dispenserService.updateDispenser(id, dispenserData);
      setDispensers(prev => 
        prev.map(dispenser => 
          dispenser.id === id ? updatedDispenser : dispenser
        )
      );
      return updatedDispenser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteDispenser = async (id) => {
    try {
      await dispenserService.deleteDispenser(id);
      setDispensers(prev => prev.filter(dispenser => dispenser.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchDispensers();
  }, []);

  return {
    dispensers,
    loading,
    creating,
    error,
    createDispenser,
    getDispenserById,
    updateDispenser,
    deleteDispenser,
    fetchDispensers,
    refreshDispensers: fetchDispensers
  };
};
