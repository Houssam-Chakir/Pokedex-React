import { useEffect, useState } from "react";
import { baseURL, getPokedexNumber, getFullPokedexNumber } from "../utils";
import TypeCard from "./TypeCard";

export default function PokeCard(props) {
  const { selectedPokemon } = props;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      const { name: pokeName, height, abilities, stats, types, moves, sprites } = data;
      console.log("data", data);
    }
  }, [data]);

  useEffect(() => {
    console.log("top");
    if (loading || !localStorage || data) {
      return;
    }

    let cache = {};

    if (localStorage.getItem("pokedex")) {
      cache = JSON.parse(localStorage.getItem("pokedex"));
    }
    console.log("mid");

    if (selectedPokemon in cache) {
      setData(cache[selectedPokemon]);
      console.log(cache[selectedPokemon]);
      console.log(data);
      return;
    }
    async function fetchPokemonData() {
      // Start by setting the loading state to true
      setLoading(true);
      console.log("test");
      try {
        const URL = `${baseURL}pokemon/${getPokedexNumber(selectedPokemon)}`;
        // Fetch data from the Pokedex API for the selected Pokémon
        const res = await fetch(URL);
        // Parse the response data to JSON
        const pokemonData = await res.json();
        // Set the state with the fetched Pokémon data
        console.log("pokemon data", pokemonData);
        setData(pokemonData);
        // Cache the fetched data for the selected Pokémon
        cache[selectedPokemon] = pokemonData;
        // Store the updated cache in local storage
        localStorage.setItem("pokedex", JSON.stringify(cache));
        // Log the fetched Pokémon data to the console
      } catch (error) {
        // Log any errors that occur during the fetch
        console.log(error.message);
      } finally {
        // Reset the loading state to false
        setLoading(false);
      }
    }

    fetchPokemonData();
  }, [selectedPokemon]);

  if (loading || !data) {
    return (
      <div>
        <h4>loading...</h4>
      </div>
    );
  }

  return (
    <div className='poke-card'>
      <div>
        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{data.name}</h2>
      </div>
      <div className="type-container">
        {
          data.types.map((typeObj, typeIndex) => {
            return (
              <TypeCard key={typeIndex} type={typeObj?.type?.name} />
            )
          })
        }
      </div>
    </div>
  );
}
