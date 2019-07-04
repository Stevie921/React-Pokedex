import React from 'react';
import './App.css';

function App() {
  return(
     <div>
      <h1>Pokédex</h1>
      <Input/>
     </div>
   )
  }

class Input extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isLoaded: false,
      input: "pikachu",
      info: "",
      evolution: "",
      isError: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.useAPI = this.useAPI.bind(this);
    }

    useAPI(){
     fetch("https://pokeapi.co/api/v2/pokemon/" + this.state.input)
    .then(res => res.json())
      .then(
        (result) => {
         this.setState({info: result, isError: false})//2nd fetch
         fetch("https://pokeapi.co/api/v2/pokemon-species/" + this.state.info.id)
         .then(res => res.json())
          .then(
            (result) => {
              this.setState({evolution: result})
             }
            )
        },//2nd fetch
       (error) => {
          this.setState({
            isLoaded: true,
            isError: true,
            error
          });
        }
      )
     }

   componentDidMount(){
    this.useAPI();

   }

   handleChange(e){
    this.setState({input: e.target.value});
   }
 
   handleClick(){
    this.useAPI();
   }

   render(){
     let movesList = [];
     let info = this.state.info;
     let evolution = this.state.evolution;
     let background = document.getElementById("image");
     let image,type,type_two,genus,desc,desc_text,previous;
     for(let i in info.moves){
      movesList.push(info.moves[i].move.name);
     }
     let moves = movesList.slice(0,5).map(move => <li key={move}>{move}</li>);
      if(info.sprites !== undefined){
       image = info.sprites["front_default"];
       type = info.types[0].type.name;
       if(info.types.length > 1){type_two = "/" + info.types[1].type.name};
       //PICK IMAGE BACKGROUND COLOUR BASED ON TYPE
        switch(type){
          case "fire":
          background.style.background = "#D62724";
          break;
          case "electric":
          background.style.background = "#E8C813";
          break;
          case "grass":
          case "bug":
          background.style.background = "#37AB20";
          break;
          case "poison":
          background.style.background = "#74448C";
          break;
          case "ground":
          background.style.background = "#704527";
          break;
          case "psychic":
          background.style.background = "#13082B";
          break;
          case "water":
          background.style.background = "#2A52A3";
          break;
          case "fighting":
          background.style.background = "#B52606";
          break;
          case "fairy":
          background.style.background = "#E08AC2";
          break;
          case "flying":
          case "normal":
          background.style.background = "#E8B48D";
          break;
          default:
          background.style.background = "#fff";
         }

       if(evolution !== undefined && evolution !== ""){
         genus = evolution.genera[2].genus;
         desc = evolution.flavor_text_entries.slice(0,10).filter(entry => entry.language.name === "en");
         desc_text = desc[0].flavor_text;
         if(evolution.evolves_from_species !== null){
          previous = evolution.evolves_from_species.name;
         } else {
          previous = "None";
         }
         }
        }
     
     return(
     <div>
      <div id="search"> 
       <input type="text" placeholder="Search Pokemon" onChange={this.handleChange}/>
       <button onClick={this.handleClick}>Search</button>
      </div> 
      {this.state.isError && <p id="error">Not Found!</p>}
      <div id="result">
       <div id="image">
        <img src={image} alt={this.state.info.name}/>
       </div>
       <div id="nametype">
        <p id="name">{this.state.info.name}</p>
        <p>Type: {type}{type_two}</p>
        <p>Genus: {genus}</p>
        <p>Evolves From: {previous}</p>
       </div>
       <ul>Move List: {moves}</ul>
       <p id="desc">{desc_text}</p>
      </div>
     </div>
    )
   }
}

export default App;
