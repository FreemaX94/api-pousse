import { useState } from 'react';

export interface ResourceFilters {
  numero: string;
  titre: string;
  client: string;
  collaborateur: string;
  categorie: string;
  actif: string;
}

const defaultFilters: ResourceFilters = {
  numero: '',
  titre: '',
  client: '',
  collaborateur: 'tous',
  categorie: 'toutes',
  actif: 'tous'
};

export const useResourceFilters = () => {
  const [filters, setFilters] = useState<ResourceFilters>(defaultFilters);
  const [savedFilters, setSavedFilters] = useState<Array<{ name: string; filters: ResourceFilters }>>([]);

  const updateFilter = (key: keyof ResourceFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const saveFilter = (name: string) => {
    const newSavedFilter = { name, filters: { ...filters } };
    setSavedFilters(prev => [...prev, newSavedFilter]);
  };

  const loadFilter = (filterToLoad: ResourceFilters) => {
    setFilters(filterToLoad);
  };

  const hasActiveFilters = () => {
    return Object.keys(filters).some(key => {
      const filterKey = key as keyof ResourceFilters;
      const value = filters[filterKey];
      const defaultValue = defaultFilters[filterKey];
      return value !== defaultValue;
    });
  };

  return {
    filters,
    updateFilter,
    resetFilters,
    saveFilter,
    loadFilter,
    savedFilters,
    hasActiveFilters
  };
};