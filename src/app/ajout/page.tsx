"use client";

import { useState } from "react";

export default function AjoutToner() {
  const [formData, setFormData] = useState({
    nomToner: "",
    bureau: "",
    nomDemandeur: "",
    compteur: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/toners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Toner ajouté avec succès !");
        setFormData({ nomToner: "", bureau: "", nomDemandeur: "", compteur: "" });
      } else {
        setMessage("Erreur lors de l'ajout du toner.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Ajouter un Toner</h1>

      {message && <p className="text-center text-green-500 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nomToner"
          value={formData.nomToner}
          onChange={handleChange}
          placeholder="Nom du Toner"
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="bureau"
          value={formData.bureau}
          onChange={handleChange}
          placeholder="Bureau"
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="nomDemandeur"
          value={formData.nomDemandeur}
          onChange={handleChange}
          placeholder="Nom du Demandeur"
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          name="compteur"
          value={formData.compteur}
          onChange={handleChange}
          placeholder="Compteur"
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
}
