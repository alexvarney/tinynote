import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  font-family: "Roboto Slab", sans-serif;
  
  display: flex;
  align-items: center;
  color: #434343;
  
  input {
    border: none;
    background: #F9F9F9;
    font-size: 40px;
    padding-left: 0.5rem;
    border-radius: 0.5rem;
    margin-right: 1rem;
    margin-bottom: 1rem;
    display: inline-block;
    flex: 1 1 80%;
    color: #434343;
  }

`;

const inputFlex = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

export default function TitleEditor({ value, onChange, onSave=()=>{} }) {
  const [isEditing, setEditing] = useState(false);
  const expand = () => {
    
    if(!isEditing){
      setEditing(true)
    }

  };

  const save = (e) => {
    e.stopPropagation();
    setEditing(false);
    onSave();
  }

  return (
    <Container onClick={expand}>
      {isEditing ? (<>
        <input value={value} onChange={onChange} />
        <i onClick={save} className="fas fa-check"></i>
</>
      ) : (
        <h1>{value}</h1>
      )}
    </Container>
  );
}
