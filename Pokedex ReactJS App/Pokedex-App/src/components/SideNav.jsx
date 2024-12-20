import { first151Pokemon, getFullPokedexNumber } from "../utils";

export default function SideNAv(props) {
  const { selectedPokemon, setSelectedPokemon } = props;
  return (
    <nav>
      <div className={"header"}>
        <h1 className='text-gradient'> Poke</h1>
      </div>
      <input />
      {first151Pokemon.map((poke, pokeIndex) => (
        <button key={pokeIndex} className={"nav-card"} onClick={() => {setSelectedPokemon(pokeIndex)}}>
          <p>{getFullPokedexNumber(pokeIndex)}</p>
          <p>{poke}</p>
        </button>
      ))}
    </nav>
  );
}
