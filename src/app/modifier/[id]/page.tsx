"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditToner({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [toner, setToner] = useState({
    nomToner: "",
    bureau: "",
    nomDemandeur: "",
    compteur: "",
  });

  // Charger le toner à modifier
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/toners/${params.id}`)
      .then((res) => res.json())
      .then((data) => setToner(data))
      .catch((err) => console.error("Erreur:", err));
  }, [params.id]);

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/toners/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toner),
      });

      if (response.ok) {
        alert("Toner modifié avec succès !");
        router.push("/"); // Rediriger vers la liste
      } else {
        console.error("Erreur lors de la mise à jour.");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 shadow-md rounded">
      <h1 className="text-xl font-bold mb-4 text-center">Modifier le Toner</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={toner.nomToner}
          onChange={(e) => setToner({ ...toner, nomToner: e.target.value })}
          className="w-full p-2 border rounded"
          placeholder="Nom du Toner"
          required
        />
        <input
          type="text"
          value={toner.bureau}
          onChange={(e) => setToner({ ...toner, bureau: e.target.value })}
          className="w-full p-2 border rounded"
          placeholder="Bureau"
          required
        />
        <input
          type="text"
          value={toner.nomDemandeur}
          onChange={(e) => setToner({ ...toner, nomDemandeur: e.target.value })}
          className="w-full p-2 border rounded"
          placeholder="Nom du Demandeur"
          required
        />
        <input
          type="number"
          value={toner.compteur}
          onChange={(e) => setToner({ ...toner, compteur: e.target.value })}
          className="w-full p-2 border rounded"
          placeholder="Compteur"
          required
        />

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700">
          Mettre à jour
        </button>
      </form>
    </div>
  );
}
