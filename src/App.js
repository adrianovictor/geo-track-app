import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

import { vehicleService } from './services/vehicleService';
import VehicleModal from './components/vehicle/vehicleModel';
import UploadModal from './components/upload/uploadModal';
import MapView from './components/map/mapView';

import './App.css';

export default function App() {
  const [vehicles, setVehicles] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  const [filters, setFilters] = useState({
    Renavam: '',
    Plate: '',
    Model: '',
    Brand: '',
    Limit: 10,
    Offset: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, [currentPage]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        Offset: (currentPage - 1) * filters.Limit
      };
      
      const data = await vehicleService.getVehicles(params);
      
      // A API retorna { vehicles: [...], totalRecords, currentPage, pageItens }
      setVehicles(data.vehicles || []);
      setTotalRecords(data.totalRecords || 0);
      
      console.log('Veículos carregados:', data);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      setVehicles([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadVehicles();
  };

  const handleCreate = () => {
    setSelectedVehicle(null);
    setIsModalOpen(true);
  };

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedVehicle) {
        await vehicleService.updateVehicle(selectedVehicle.id, data);
      } else {
        await vehicleService.createVehicle(data);
      }
      setIsModalOpen(false);
      loadVehicles();
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
      alert('Erro ao salvar veículo');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este veículo?')) {
      try {
        await vehicleService.deleteVehicle(id);
        loadVehicles();
      } catch (error) {
        console.error('Erro ao excluir veículo:', error);
        alert('Erro ao excluir veículo');
      }
    }
  };

  const handleUpload = async (file) => {
    console.log('Upload de arquivo:', file);
    setIsUploadModalOpen(false);
    alert('Arquivo enviado com sucesso!');
  };

  const totalPages = Math.ceil(totalRecords / filters.Limit);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">GeoTruck - Sistema de Gerenciamento de Veículos</h1>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="RENAVAM"
              value={filters.Renavam}
              onChange={(e) => setFilters({...filters, Renavam: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Placa"
              value={filters.Plate}
              onChange={(e) => setFilters({...filters, Plate: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Modelo"
              value={filters.Model}
              onChange={(e) => setFilters({...filters, Model: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Marca"
              value={filters.Brand}
              onChange={(e) => setFilters({...filters, Brand: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Buscar
            </button>
            <button
              onClick={handleCreate}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              + Adicionar Veículo
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              📤 Upload de Rotas
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Id</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Placa</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Modelo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Marca</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ano</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">RENAVAM</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Carregando...
                    </td>
                  </tr>
                ) : vehicles.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Nenhum veículo encontrado
                    </td>
                  </tr>
                ) : (
                  vehicles.map((vehicle, idx) => (
                    <tr key={vehicle.id || idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{vehicle.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{vehicle.plate}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{vehicle.model}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{vehicle.brand}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{vehicle.year}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{vehicle.renavam}</td>
                      <td className="px-6 py-4 text-sm text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setViewingVehicle(vehicle)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
                          >
                            Ver Rota
                          </button>
                          <button
                            onClick={() => handleEdit(vehicle)}
                            className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-xs"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(vehicle.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">
              Página {currentPage} de {totalPages || 1} ({totalRecords} veículos)
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicle={selectedVehicle}
        onSave={handleSave}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />

      {viewingVehicle && (
        <MapView
          vehicle={viewingVehicle}
          onClose={() => setViewingVehicle(null)}
        />
      )}
    </div>
  );
}