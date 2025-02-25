"use client"; // Indique que ce composant s'exécute côté client

import { useEffect, useState } from "react";

export default function Home() {
  const [toners, setToners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTonerId, setSelectedTonerId] = useState(null);
  const [isExiting, setIsExiting] = useState(false);

  const [formData, setFormData] = useState({
    nomToner: "",
    bureau: "",
    nomDemandeur: "",
    compteur: "",
  });

  // Fonction pour ouvrir la modale
  const openModal = (tonerId) => {
    console.log("voiciiiiiiiiiiii: ",tonerId);
    if (tonerId) {
      setIsEditMode(true);
      setSelectedTonerId(tonerId);
      setIsModalOpen(true);
      const tonerSelec = fetchTonerData(tonerId); // Assurez-vous que cette fonction est bien appelée
      console.log("voiciiiiiiiiiiii: ",tonerSelec);
    } else {
      setIsEditMode(false);
      setFormData({
        nomToner: '',
        bureau: '',
        nomDemandeur: '',
        compteur: '',
      });
      setIsModalOpen(true);
    }
  };
  

  // Fonction pour récupérer les données d'un toner spécifique
  const fetchTonerData = async (tonerId) => {
    console.log("voiciiiiiiiiiiiidans fetch: ",tonerId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/toners/${tonerId}`);
      if (!response.ok) throw new Error("Erreur lors de la récupération des données");
      const toner = await response.json();
      setFormData(toner);
    } catch (error) {
      console.error(error);
    }
  };

  // Fonction pour fermer la modale
  const closeModal = () => {
    setIsExiting(true); // Commence l'animation de fermeture
    setTimeout(() => {
      setIsModalOpen(false); // Cache la modale après l'animation
      setIsExiting(false); // Réinitialise l'état d'animation de sortie
    }, 500); // Durée de l'animation (500ms)
  };

  // Gestion des inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode
      ? `${process.env.NEXT_PUBLIC_API_URL}/toners/${selectedTonerId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/toners`;
  
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const responseText = await response.text(); // Lire la réponse brute
  
      console.log("Statut:", response.status, "Réponse:", responseText); // Debug
  
      if (!response.ok) throw new Error(`Erreur ${response.status}: ${responseText}`);
  
      refreshList();
      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error.message);
    }
  };
  


  // Rafraîchir la liste des toners
  const refreshList = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/toners`);
      if (!response.ok) throw new Error("Erreur lors du chargement des toners");
      const data = await response.json();
      setToners(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    refreshList();
  }, []);

  // Supprimer un toner
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce toner ?")) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/toners/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setToners((prevToners) => prevToners.filter((toner) => toner._id !== id));
      } else {
        console.error("Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur de connexion au serveur:", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Gestion des Toners</h1>

      <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => openModal()}>
        Ajouter un Toner
      </button>

      {/* Modale */}
      {isModalOpen && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className={`bg-white p-8 rounded-lg shadow-lg w-96 transform ${
              isExiting ? 'opacity-0' : 'opacity-100'
            } transition-opacity duration-500`}
            style={{ animation: !isExiting && 'fadeIn 0.5s ease-out' }}>
            <h2>{isEditMode ? "Modifier un toner" : "Ajouter un toner"}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Nom du toner:
                <input
                  type="text"
                  name="nomToner"
                  value={formData.nomToner}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Bureau:
                <input
                  type="text"
                  name="bureau"
                  value={formData.bureau}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Nom du demandeur:
                <input
                  type="text"
                  name="nomDemandeur"
                  value={formData.nomDemandeur}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Compteur:
                <input
                  type="number"
                  name="compteur"
                  value={formData.compteur}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <button type="submit">Soumettre</button>
              <button type="button" onClick={closeModal}>
                Fermer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tableau des toners */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full border border-gray-300 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 border">Nom du Toner</th>
              <th className="px-4 py-2 border">Bureau</th>
              <th className="px-4 py-2 border">Nom du Demandeur</th>
              <th className="px-4 py-2 border">Compteur</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {toners.map((toner) => (
              <tr key={toner._id} className="text-center hover:bg-gray-100">
                <td className="px-4 py-2 border">{toner.nomToner}</td>
                <td className="px-4 py-2 border">{toner.bureau}</td>
                <td className="px-4 py-2 border">{toner.nomDemandeur}</td>
                <td className="px-4 py-2 border">{toner.compteur}</td>
                <td className="border p-2">
                  <button
                    onClick={() => openModal(toner._id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(toner._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 ml-2"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Styles */}
      <style jsx>{`
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* S'assure qu'elle est au-dessus des autres éléments */
  }
  .modal {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    z-index: 1001; /* Doit être supérieur à celui de l'overlay */
  }
  input {
    margin: 10px 0;
    padding: 8px;
    width: 100%;
  }
  button {
    margin-top: 10px;
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  button[type="button"] {
    background-color: #ccc;
  }
  button:hover {
    background-color: #0056b3;
  }
    @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
`}</style>

    </div>
  );
}
