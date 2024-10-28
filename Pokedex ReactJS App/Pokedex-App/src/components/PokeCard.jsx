import { useEffect, useState } from "react";
import { baseURL, getPokedexNumber, getFullPokedexNumber } from "../utils";
import TypeCard from "./TypeCard";
import Modal from "./Modal";

export default function PokeCard(props) {
  const { selectedPokemon } = props;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState(null);
  const [loadingSkill, setLoadingSkill] = useState(false);
  async function fetchMoveData(move, moveUrl) {
    if (loadingSkill || !localStorage || !moveUrl) {
      return;
    }
    //Check if move is in cache
    let cache = {};
    if (localStorage.getItem("pokemon-moves")) {
      cache = JSON.parse(localStorage.getItem("pokemon-moves"));
    }

    if (move in cache) {
      setSkill(cache[move]);
      console.log('cache[move]: ', cache[move]);
      console.log("Found move in cache");
      return;
    }

    try {
      setLoadingSkill(true);
      const res = await fetch(moveUrl);
      const moveData = await res.json();
      console.log("moveData: ", moveData);

      const description = moveData?.flavor_text_entries.filter((val) => {
        return (val.version_group.name = "firered-leafgreen");
      })[0]?.flavor_text;

      const skillData = {
        name: move,
        description,
      };
      console.log('skillData: ', skillData);
      setSkill(skillData);

      cache[move] = skillData;
      localStorage.setItem("pokemon-moves", JSON.stringify(cache));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSkill(false);
    }
  }

  useEffect(() => {
    console.log("top");
    if (loading || !localStorage) {
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
      {skill && (
        <Modal
          handleCloseModal={() => {
            setSkill(null);
            console.log('skill set to null');
          }}
        >
          <div>
            <h6>Name</h6>
            <h2>{skill.name}</h2>
          </div>
          <div>
            <h6>description</h6>
            <p>{skill.description}</p>
          </div>
        </Modal>
      )}
      <div>
        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{data.name}</h2>
      </div>
      <div className='type-container'>
        {data.types.map((typeObj, typeIndex) => {
          return <TypeCard key={typeIndex} type={typeObj?.type?.name} />;
        })}
      </div>
      <img className='default-img' src={`/public/pokemon/${getFullPokedexNumber(selectedPokemon)}.png`} alt={`${data.name}-large-img`} />
      <div className='img-container'>
        {Object.values(data.sprites).map((imgUrl, imgIndex) => {
          if (typeof imgUrl !== "string") {
            return;
          }
          return <img key={imgIndex} src={imgUrl} alt={`${data.name}-img-${imgUrl}`} />;
        })}
      </div>
      <h3>Stats</h3>
      <div className='stats-card'>
        {data.stats.map((statObj, statIndex) => {
          const { stat, base_stat } = statObj;
          return (
            <div key={statIndex} className='stat-item'>
              <p>{stat?.name.replaceAll("-", " ")}</p>
              <h4>{base_stat}</h4>
            </div>
          );
        })}
      </div>
      <h3>Moves</h3>
      <div className='pokemon-move-grid'>
        {data.moves.map((moveObj, moveIndex) => {
          return (
            <button
              className='button-card pokemon-move'
              key={moveIndex}
              onClick={() => {
                fetchMoveData(moveObj?.move?.name, moveObj?.move?.url);
              }}
            >
              <p>{moveObj?.move?.name.replaceAll("-", " ")}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
