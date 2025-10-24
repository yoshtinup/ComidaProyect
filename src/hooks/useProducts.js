// Hook personalizado para manejo de productos
import { useState, useEffect } from 'react';
import productService from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id) => {
    try {
      return await productService.getProductById(id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getProductsByIds = async (ids) => {
    try {
      return await productService.getProductsByIds(ids);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProductById,
    getProductsByIds,
    refreshProducts: fetchProducts
  };
};
