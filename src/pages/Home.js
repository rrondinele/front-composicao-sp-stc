import React from "react";
import FormEquipe from "../components/FormEquipe";
import ListaEquipes from "../components/ListaEquipes";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <FormEquipe />
        <ListaEquipes />
      </div>
    </div>
  );
};

export default Home;